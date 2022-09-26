import { MatchDetailData } from './base.js';

export interface BasketballMatchDetailData extends MatchDetailData {
    scoring: BasketballScoringData[],
}

export interface BasketballScoringData {
    id: string,
    homeScore: number,
    awayScore: number,
    scored: boolean,
    type: BasketballScoreTypes,
    player?: {
        id: string,
        name: string,
        team: string,
    },
    description: string,
    timeInSeconds: number,
}

export enum BasketballScoreTypes {
    FreeThrow = 'free-throw',
    TwoPoints = '2-pointer',
    ThreePoints = '3-pointer',
}
