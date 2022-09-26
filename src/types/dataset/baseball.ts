import { MatchDetailData } from './base.js';

export interface BaseballMatchDetailData extends MatchDetailData {
    atBats: BaseballAtBatData[],
}

export interface BaseballPitchData {
    pitchType: string,
    strike: boolean,
    outcome: string,
}

export interface BaseballAtBatData {
    id: string,
    balls: number,
    strikes: number,
    homeScore: number,
    awayScore: number,
    outcome: string,
    description: string,
    pitcher?: {
        name: string,
        id: string,
        team: string,
    },
    batter?: {
        name: string,
        id: string,
        team: string,
    },
    pitches: {
        pitchType: string,
        strike: boolean,
        outcome: string,
    }[]
}
