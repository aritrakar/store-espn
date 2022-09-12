import { BasePlayInformation, EventSummaryResponse } from './base.js';
import { BaseballPlayTypes } from './enum';

export interface BaseballPlayInformation extends BasePlayInformation {
    atBatId:string,
    pitchCount: {
        balls: number,
        strikes: number,
    },
    resultCount: {
        balls: number,
        strikes: number,
    },
    pitchType?: {
        id: string,
        text: string,
        abbreviation: string,
    },
    participants: {
        athlete: {
            id: string,
        },
        type: string,
    }[],
    scoringPlay: boolean,
    type: {
        id: string,
        text: string,
        type: BaseballPlayTypes,
    },
}

export interface BaseballEventSummaryResponse extends EventSummaryResponse {
    plays: BaseballPlayInformation[],
    atBats: Map<string, { $ref: string}[]>
}
