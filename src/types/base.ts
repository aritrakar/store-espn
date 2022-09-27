import { Leagues, SeasonTypes, Sports } from './enum.js';

export type InputSchema = {
    debug: boolean,
    scrapeMatchList: boolean,
    matchListYears: string[],
    matchListSeasonTypes: SeasonTypes[]
    matchListLeagues: Leagues[],
    scrapeMatchDetails: boolean,
    detailMatches: string[],
    matchDetailsLeague: Leagues,
    scrapeNews: boolean,
    newsLeagues: Leagues[]
}

export type ParsedInput = {
    scrapeMatchList: boolean,
    matchListYears: number[],
    matchListSeasonTypes: SeasonTypes[]
    matchListLeagues: Leagues[],
    scrapeMatchDetails: boolean,
    detailMatches: number[],
    matchDetailsLeague: Leagues,
    matchDetailsSport: Sports,
    scrapeNews: boolean,
    newsLeagues: Leagues[]
}
