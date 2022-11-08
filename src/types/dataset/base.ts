import { Leagues, ResultTypes } from '../enum.js';

export type VenueData = {
    capacity: number,
    fullName: string,
    city: string | null,
    state: string | null,
}

export interface CompetitorData {
    id: string,
    displayName: string,
    abbreviation: string,
    winner: boolean | null,
    home: boolean,
    score: number,
}

export interface CompetitionData {
    id: string,
    date: string,
    competitors: CompetitorData[],
    attendance: number,
    headlines: {
        long: string,
        short: string,
    }[],
    venue: VenueData | null,
    winnerAbbreviation: string | null,
}

export interface MatchPlayerData {
    id: string,
    statType?: string,
    position: string | null,
    stats: Record<string, string>,
    team: string,
    name: string,
}

export interface MatchDetailData extends CompetitionData {
    officials: string[],
    players: MatchPlayerData[],
}

export interface ArticleData {
    resultType: ResultTypes,
    league: Leagues,
    title: string,
    description: string,
    content: string,
    url: string,
    imageUrl: string | null,
    publishedAt: string,
}
