export enum Sports {
    Baseball = 'baseball',
    Hockey = 'hockey',
    Basketball = 'basketball',
    Football = 'football',
}

export enum Leagues {
    MLB = 'mlb',
    NHL = 'nhl',
    NBA = 'nba',
    WNBA = 'wnba',
    NFL = 'nfl',
}

export enum Labels {
    ScoreDates = 'scoreDates',
    ScoreBoard = 'scoreBoard',
}

export enum SeasonTypes {
    Preseason = 'pre',
    RegularSeason = 'reg',
    PostSeason = 'post',
    OffSeason = 'off',
}

export enum ResultTypes {
    MatchList = 'matchList',
}

export type StandingsResponse = {
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

export type CompetitionResponse = {
    id: string,
    date: string,
    attendance: number,
    headlines?: {
        description: string,
        shortLinkText: string,
    }[],
    venue?: {
        capacity: number,
        fullName: string,
        address: {
            city: string,
            state: string,
        },
    },
    competitors: {
        homeAway: string,
        winner?: boolean,
        team: {
            displayName: string,
            abbreviation: string,
        },
        score: string,
    }[]
}

export type ScoreboardResponse = {
    events: {
        competitions: CompetitionResponse[]
    }[]
}

export type InputOptions = {
    scrapeMatchList: boolean,
    years: string[],
    seasonTypes: string[]
    leagues: string[],
}

export type ParsedInput = {
    scrapeMatchList: boolean,
    years: number[],
    seasonTypes: SeasonTypes[]
    leagues: Leagues[],
}
