import { Request } from 'crawlee';
import { Labels, Leagues, Sports } from '../types/enum.js';
import { ARTICLE_FEED_LIMIT, API_BASE_URL, ONEFEED_BASE_URL, DOMAIN_NAME, ARTICLE_FEED_PUBKEYS } from '../constants.js';
import { getSportByLeague } from './generic.js';
import { ParsedInput } from '../types/base.js';

export const getStandingsUrl = (sport: Sports, league: Leagues, season: number) => {
    const url = new URL(`${API_BASE_URL}/apis/v2/sports/${sport}/${league}/standings`);
    url.searchParams.set('lang', 'en');
    url.searchParams.set('region', 'us');
    url.searchParams.set('level', '1');
    url.searchParams.set('season', season.toString());
    return url.toString();
};

export const getGameSummaryUrl = (sport: Sports, league: Leagues, gameId: number) => {
    const url = new URL(`${API_BASE_URL}/apis/site/v2/sports/${sport}/${league}/summary`);
    url.searchParams.set('lang', 'en');
    url.searchParams.set('region', 'us');
    url.searchParams.set('event', gameId.toString());
    return url.toString();
};

export const getScoreboardUrl = (sport: Sports, league: Leagues, date: string) => {
    const url = new URL(`${API_BASE_URL}/apis/site/v2/sports/${sport}/${league}/scoreboard`);
    url.searchParams.set('dates', date);
    return url.toString();
};

export const getStartRequests = (input: ParsedInput): Request[] => {
    const requests = [];
    if (input.scrapeMatchList) requests.push(...getMatchListStartRequests(input));
    if (input.scrapeMatchDetails) requests.push(...getMatchGamesStartRequests(input));
    if (input.scrapeNews) requests.push(getNewsStartRequest(input));
    return requests;
};

export const getArticleFeedUrl = (league: Leagues, offset: number): string => {
    const url = new URL(`/apis/v3/cached/contentEngine/oneFeed/leagues/${league}`, ONEFEED_BASE_URL);
    url.searchParams.set('offset', offset.toString());
    url.searchParams.set('limit', ARTICLE_FEED_LIMIT.toString());
    url.searchParams.set('pubkey', getArticleFeedPubKey(league));
    return url.toString();
};

export const isArticleDetailUrl = (urlString: string): boolean => {
    const url = new URL(urlString);
    if (!url.hostname.includes(DOMAIN_NAME)) return false;
    return url.pathname.includes('/story/');
};

export const getArticleDetailUrl = (webUrl: string): string => {
    const url = new URL(webUrl);
    url.searchParams.set('xhr', '1');
    return url.toString();
};

const getMatchListStartRequests = (input: ParsedInput): Request[] => {
    if (input.matchListYears.length === 0) return [];
    if (input.matchListSeasonTypes.length === 0) return [];

    // For each league, we have enqueue one starting ScoreDates request
    const requests = [];
    for (const league of input.matchListLeagues) {
        const sport = getSportByLeague(league);
        if (!sport) continue;

        requests.push(new Request({
            // The year is irrelevant, standings endpoint returns information about all seasons
            url: getStandingsUrl(sport, league, input.matchListYears[0]),
            userData: {
                label: Labels.ScoreDates,
                seasons: input.matchListYears,
                seasonTypes: input.matchListSeasonTypes,
                sport,
                league,
            },
        }));
    }

    return requests;
};

const getMatchGamesStartRequests = (input: ParsedInput): Request[] => {
    const {
        detailMatches,
        matchDetailsSport,
        matchDetailsLeague,
    } = input;

    return detailMatches.map((match) => {
        return new Request({
            url: getGameSummaryUrl(matchDetailsSport, matchDetailsLeague, match),
            userData: {
                label: Labels.MatchDetail,
                sport: matchDetailsSport,
                league: matchDetailsLeague,
            },
        });
    });
};

const getNewsStartRequest = (input: ParsedInput): Request => {
    const { newsLeague } = input;
    const offset = 0;
    return new Request({
        url: getArticleFeedUrl(newsLeague, offset),
        userData: {
            label: Labels.ArticleFeed,
            offset,
            league: newsLeague,
        },
    });
};

const getArticleFeedPubKey = (league: Leagues): string => {
    const pubkeyLeaguePart = ARTICLE_FEED_PUBKEYS[league] ?? league;
    return `espn-en-${pubkeyLeaguePart}-index`;
};
