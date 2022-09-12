import { SeasonTypes, Leagues, Sports } from './enum.js';

export type InputOptions = {
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

export interface StandingsResponse {
    seasons: {
        year: number,
        types: {
            abbreviation: string,
            name: string,
            startDate: string,
            endDate: string,
        }[]
    }[]
}

export interface VenueResponse {
    capacity: number,
    fullName: string,
    address: {
        city: string,
        state: string,
    },
}

export interface TeamResponse {
    displayName: string,
    abbreviation: string,
}

export interface CompetitionResponse {
    id: string,
    date: string,
    attendance: number,
    headlines?: {
        description: string,
        shortLinkText: string,
    }[],
    venue?: VenueResponse,
    competitors: {
        homeAway: string,
        winner?: boolean,
        team: TeamResponse,
        score: string,
    }[]
}

export interface AthleteResponse {
    id: string,
    displayName: string,
    shortName: string,
    position: {
        abbreviation: string,
        name: string,
    },
    starter: boolean
}

export interface BasePlayInformation {
    homeScore: number,
    awayScore: number,
    id: string,
    sequenceNumber: string,
    text: string,
    team: {
        id: string,
    },
}

export interface BoxScoreResponse {
    players:{
        statistics: {
            athletes: {
                athlete: AthleteResponse,
                stats: string[],
            }[],
            names: string[],
            type?: string,
        }[],
        team: TeamResponse
    }[],
    teams: {
        statistics: {
            name: string,
            stats: {
                name: string,
                abbreviation: string,
                value: number
            }[]
        },
        team: TeamResponse,
    }[],
}

export interface EventSummaryResponse {
    gameInfo: {
        attendance: number,
        duration: string,
        venue: VenueResponse,
        officials?: {
            displayName: string,
            position: {
                name: string,
            },
        }[],
    },
    header: {
        id: string,
        competitions: CompetitionResponse[],
        season: {
            type: number,
            year: number,
        },
        week: number,
    },
    rosters: {
        homeAway: string,
        team: TeamResponse,
    }[],
    boxscore: BoxScoreResponse,
}

export type ScoreboardResponse = {
    events: {
        competitions: CompetitionResponse[]
    }[]
}
