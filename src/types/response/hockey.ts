import { BasePlayInformation, EventSummaryResponse } from './base.js';

export enum HockeyPlayType {
    Penalty = 'penalty',
    ShotOnGoal = 'shot-on-goal',
    ShotMissed = 'shot-missed',
    ShotBlocked = 'shot-blocked',
}

export interface HockeyPlayInformation extends BasePlayInformation {
    participants: {
        athlete: {
            id: string,
            displayName: string,
        },
        ytdGoals?: number,
        ytdAssists?: number,
    }[],
    scoringPlay: boolean,
    shootingPlay: boolean,
    type: {
        id: string,
        abbreviation: HockeyPlayType | string,
        text: string,
    },
    clock: {
        displayValue: string,
    },
    period: {
        number: number,
    },
    team: {
        id: string
    }
}

export interface HockeyEventSummaryResponse extends EventSummaryResponse {
    plays: HockeyPlayInformation[],
    format: {
        regulation: {
            clock: number,
            periods: number,
        },
    }
}
