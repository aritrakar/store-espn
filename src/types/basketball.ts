import { BasePlayInformation, EventSummaryResponse } from './base.js';

export interface BasketballPlayInformation extends BasePlayInformation {
    participants: {
        athlete: {
            id: string,
        },
    }[],
    scoringPlay: boolean,
    shootingPlay: boolean,
    type: {
        id: string,
        text: string,
    },
    clock: {
        displayValue: string,
    },
    period: {
        number: number,
    }
}

export interface BasketballEventSummaryResponse extends EventSummaryResponse {
    plays: BasketballPlayInformation[],
    format: {
        regulation: {
            clock: number,
            periods: number,
        },
        overtime: {
            clock: number,
        }
    }
}
