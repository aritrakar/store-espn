import { Request } from 'crawlee';
import { Labels, Leagues, Sports } from '../types/enum.js';
import { ParsedInput } from '../types/response/base.js';
import { BASE_URL } from '../constants.js';
import { getSportByLeague } from './generic.js';

export const getStandingsUrl = (sport: Sports, league: Leagues, season: number) => {
    const url = new URL(`${BASE_URL}/apis/v2/sports/${sport}/${league}/standings`);
    url.searchParams.set('lang', 'en');
    url.searchParams.set('region', 'us');
    url.searchParams.set('level', '1');
    url.searchParams.set('season', season.toString());
    return url.toString();
};

export const getGameSummaryUrl = (sport: Sports, league: Leagues, gameId: number) => {
    const url = new URL(`${BASE_URL}/apis/site/v2/sports/${sport}/${league}/summary`);
    url.searchParams.set('lang', 'en');
    url.searchParams.set('region', 'us');
    url.searchParams.set('event', gameId.toString());
    return url.toString();
};

export const getScoreboardUrl = (sport: Sports, league: Leagues, date: string) => {
    const url = new URL(`${BASE_URL}/apis/site/v2/sports/${sport}/${league}/scoreboard`);
    url.searchParams.set('dates', date);
    return url.toString();
};

export const getStartRequests = (input: ParsedInput): Request[] => {
    const requests = [];
    if (input.scrapeMatchList) requests.push(...getMatchListStartRequests(input));
    if (input.scrapeMatchDetails) requests.push(...getMatchGamesStartRequests(input));
    return requests;
};

const getMatchListStartRequests = (input: ParsedInput): Request[] => {
    if (input.years.length === 0) return [];
    if (input.seasonTypes.length === 0) return [];

    // For each league, we have enqueue one starting ScoreDates request
    const requests = [];
    for (const league of input.leagues) {
        const sport = getSportByLeague(league);
        if (!sport) continue;

        requests.push(new Request({
            // The year is irrelevant, standings endpoint returns information about all seasons
            url: getStandingsUrl(sport, league, input.years[0]),
            userData: {
                label: Labels.ScoreDates,
                seasons: input.years,
                seasonTypes: input.seasonTypes,
                sport,
                league,
            },
        }));
    }

    return requests;
};

const getMatchGamesStartRequests = (input: ParsedInput): Request[] => {
    const {
        games,
        gameDetailsSport,
        gameDetailsLeague,
    } = input;

    const requests = [];
    for (const game of games) {
        requests.push(new Request({
            url: getGameSummaryUrl(gameDetailsSport, gameDetailsLeague, game),
            userData: {
                label: Labels.MatchDetail,
                sport: gameDetailsSport,
                league: gameDetailsLeague,
            },
        }));
    }
    return requests;
};
