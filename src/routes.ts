import { createHttpRouter, Request } from 'crawlee';
import { Actor } from 'apify';
import { Labels, ResultTypes, Sports } from './types/enum.js';
import {
    ArticleDetailResponse,
    ArticleFeedResponse,
    ScoreboardResponse,
    StandingsResponse,
} from './types/response/base.js';
import { getDatesBetween } from './tools/generic.js';
import { getArticleDetailUrl, getArticleFeedUrl, getScoreboardUrl } from './tools/url.js';
import { getBaseballMatchInformationData } from './extractors/baseball.js';
import { getBasketballMatchInformationData } from './extractors/basketball.js';
import { getHockeyMatchInformationData } from './extractors/hockey.js';
import {
    getArticleData,
    getCompetitionData,
    getGeneralMatchInformationData,
    getSingleArticleData,
} from './extractors/base.js';
import { ARTICLE_FEED_LIMIT } from './constants.js';

export const router = createHttpRouter();

/**
 * Route calls standings endpoint and gathers start and end dates for each season.
 * Then enqueues all scoreboard URLs.
 */
router.addHandler(Labels.ScoreDates, async ({ crawler, request, log, json }) => {
    log.info(`${request.label}: Parsing standings response - ${request.loadedUrl}`);
    const response = json as StandingsResponse;
    const { seasons, seasonTypes, sport, league } = request.userData;

    // Each year contains four seasons, pre-season, regular season, post-season and off-season
    const filteredYears = response.seasons.filter((season) => seasons.includes(season.year));

    const allSeasons = [];
    for (const year of filteredYears) {
        for (const season of year.types) {
            if (!seasonTypes.includes(season.abbreviation)) continue;

            allSeasons.push({
                startDate: season.startDate,
                endDate: season.endDate,
                type: season.abbreviation,
                year: year.year,
                sport,
                league,
            });
        }
    }

    // Enqueue scoreboard requests for each day of each season
    const requests = allSeasons.flatMap((season) => {
        const { startDate, endDate } = season;
        const days = getDatesBetween(startDate, endDate);

        // Add each day to request queue
        return days.map((day) => {
            return new Request({
                url: getScoreboardUrl(sport, league, day),
                userData: {
                    year: season.year,
                    type: season.type,
                    label: Labels.ScoreBoard,
                    sport,
                    league,
                },
            });
        });
    });

    await crawler.addRequests(requests);
});

/**
 * Route calls scoreboard endpoint and saves to default dataset all matches of this day
 */
router.addHandler(Labels.ScoreBoard, async ({ json, log, request }) => {
    log.info(`${request.label}: Parsing one day scoreboard - ${request.url}`);
    const { year, type, sport, league } = request.userData;
    const response = json as ScoreboardResponse;
    for (const event of response.events) {
        try {
            if (event.competitions.length === 0) continue;

            const competition = event.competitions[0];
            const competitionData = getCompetitionData(competition);
            await Actor.pushData({
                ...competitionData,
                sport,
                league,
                season: year,
                seasonType: type,
                url: request.loadedUrl,
                resultType: ResultTypes.MatchList,
            });
        } catch (err) {
            throw new Error(`Unable to parse match list data - ${request.loadedUrl}, Error: ${err}`);
        }
    }
});

/**
 * Route calls event summary endpoint and saves both general and sport specific data about this event
 */
router.addHandler(Labels.MatchDetail, async ({ json, log, request }) => {
    log.info(`${request.label}: Parsing match detail - ${request.url}`);
    const { sport } = request.userData;
    try {
        switch (sport) {
            case Sports.Baseball: {
                const data = getBaseballMatchInformationData(json);
                await Actor.pushData(data);
                break;
            }
            case Sports.Basketball: {
                const data = getBasketballMatchInformationData(json);
                await Actor.pushData(data);
                break;
            }
            case Sports.Hockey: {
                const data = getHockeyMatchInformationData(json);
                await Actor.pushData(data);
                break;
            }
            default: {
                const data = getGeneralMatchInformationData(json);
                await Actor.pushData(data);
                break;
            }
        }
    } catch (err) {
        throw new Error(`Unable to parse match detail - ${request.loadedUrl}, Error: ${err}`);
    }
});

/**
 * Enqueues article detail requests.
 * First request handles pagination.
 */
router.addHandler(Labels.ArticleFeed, async ({ json, log, request, crawler }) => {
    const { label, offset, league } = request.userData;
    log.info(`${label}: Handling article list - ${request.url}`);
    const response = json as ArticleFeedResponse;

    const parsedFeedItems = response.feed
        .flatMap((feedItem) => getArticleData(feedItem.data.now, league));

    const articles = parsedFeedItems.filter((feedItem) => feedItem && typeof feedItem === 'object');
    await Actor.pushData(articles);

    const articleUrls = parsedFeedItems.filter((feedItem) => typeof feedItem === 'string') as string[];
    const articleDetailRequests = articleUrls.map((articleUrl) => {
        return new Request({
            url: getArticleDetailUrl(articleUrl),
            userData: {
                label: Labels.ArticleDetail,
                league,
            },
        });
    });

    await crawler.addRequests(articleDetailRequests);

    // Enqueue other pages
    if (offset === 0) {
        const feedRequests = [];
        for (let tmpOffset = ARTICLE_FEED_LIMIT; tmpOffset < response.resultsCount; tmpOffset += ARTICLE_FEED_LIMIT) {
            feedRequests.push(new Request({
                url: getArticleFeedUrl(league, tmpOffset),
                userData: {
                    label: Labels.ArticleFeed,
                    offset: tmpOffset,
                    league,
                },
            }));
        }
        await crawler.addRequests(feedRequests);
    }
});

/**
 * Saves article data.
 */
router.addHandler(Labels.ArticleDetail, async ({ json, log, request }) => {
    const { label, league } = request.userData;
    log.info(`${label}: Handling article detail - ${request.url}`);
    const response = json as ArticleDetailResponse;

    const article = getSingleArticleData(response.content, league);
    if (!article || typeof article === 'string') {
        log.warning(`Article detail could not be parsed - ${request.url}`);
        return;
    }

    await Actor.pushData(article);
});
