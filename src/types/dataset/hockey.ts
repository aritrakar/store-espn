import { MatchDetailData } from './base.js';

export interface HockeyMatchDetailData extends MatchDetailData {
    shooting: HockeyShotData[],
    penalties: HockeyPenaltyData[],
}

export interface HockeyShotData {
    id: string,
    homeScore: number,
    awayScore: number,
    scored: boolean,
    team: string,
    shooter: {
        id: string,
        name: string,
    },
    assists: {
        id: string,
        name: string,
    }[],
    timeInSeconds: number,
    description: string,
}

export interface HockeyPenaltyData {
    id: string,
    team: string,
    punishedPlayer: {
        id: string,
        name: string,
    } | null,
    timeInSeconds: number,
    lengthInMinutes: number | null,
    description: string,
}
