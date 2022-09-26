import { Leagues, SeasonTypes, Sports } from './enum.js';

export type InputSchema = {
    scrapeMatchList: boolean,
    years: string[],
    seasonTypes: SeasonTypes[]
    leagues: Leagues[],
    games: string[],
    gameDetailsLeague: Leagues,
}

export type ParsedInput = {
    scrapeMatchList: boolean,
    years: number[],
    seasonTypes: SeasonTypes[]
    leagues: Leagues[],
    scrapeMatchDetails: boolean,
    games: number[],
    gameDetailsLeague: Leagues,
    gameDetailsSport: Sports,
}
