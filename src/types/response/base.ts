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
        id: string,
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
            names?: string[],
            labels?: string[],
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

export interface ScoreboardResponse {
    events: {
        competitions: CompetitionResponse[]
    }[]
}

export interface ArticleFeedResponse {
    feed: {
        data: {
            now: ArticleResponse[]
        }
    }[],
    resultsCount: number,
}

export interface ArticleDetailResponse {
    content: ArticleResponse,
}

export interface ArticleResponse {
    images: {
        url: string,
    }[],
    headline: string,
    description: string,
    story: string,
    links: {
        web: {
            href: string
        }
    },
    published: string,
    inlines?: ArticleResponse[],
}
