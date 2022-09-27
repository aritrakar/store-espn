import { Leagues, SeasonTypes, Sports } from './enum.js';

export type InputSchema = {
    debug: boolean,
    scrapeMatchList: boolean,
    years: string[],
    seasonTypes: SeasonTypes[]
    leagues: Leagues[],
    games: string[],
    gameDetailsLeague: Leagues,
    newsLeagues: Leagues[]
}

export type ParsedInput = {
    scrapeMatchList: boolean,
    scrapeMatchDetails: boolean,
    scrapeNews: boolean,
    years: number[],
    games: number[],
    seasonTypes: SeasonTypes[]
    leagues: Leagues[],
    gameDetailsLeague: Leagues,
    gameDetailsSport: Sports,
    newsLeagues: Leagues[]
}
