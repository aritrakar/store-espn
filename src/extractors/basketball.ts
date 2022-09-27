import { getGeneralMatchInformationData, getPlayerMap, getTimeInSeconds } from './base.js';
import { MatchPlayerData } from '../types/dataset/base.js';
import { BasketballEventSummaryResponse, BasketballPlayInformation } from '../types/response/basketball.js';
import { BasketballMatchDetailData, BasketballScoreTypes, BasketballScoringData } from '../types/dataset/basketball.js';

export const getBasketballMatchInformationData = (eventSummary: BasketballEventSummaryResponse): BasketballMatchDetailData => {
    const matchDetailData = getGeneralMatchInformationData(eventSummary);
    if (!matchDetailData) throw new Error('Match could not be parsed');

    const playerMap = getPlayerMap(matchDetailData.players);
    const scoring = getBasketballScoringData(eventSummary, playerMap);

    return {
        ...matchDetailData,
        scoring,
    };
};

const getBasketballScoringData = (eventSummary: BasketballEventSummaryResponse, athletes: Map<string, MatchPlayerData>): BasketballScoringData[] => {
    const periodCount = eventSummary.format.regulation.periods;
    const regulationLength = eventSummary.format.regulation.clock;
    const overtimeLength = eventSummary.format.overtime.clock;

    const filteredShootingPlays = eventSummary.plays
        .filter((play) => play.shootingPlay)
        .filter((play) => play.participants.length > 0);

    return filteredShootingPlays.map((play) => {
        const playerId = play.participants[0].athlete.id;
        const playerData = athletes.get(playerId);
        const player = playerData ? {
            id: playerId,
            name: playerData.name,
            team: playerData.team,
        } : undefined;

        return {
            id: play.id,
            homeScore: play.homeScore,
            awayScore: play.awayScore,
            scored: play.scoringPlay,
            description: play.text,
            type: getBasketballPlayType(play),
            player,
            timeInSeconds: getTimeInSeconds(play.period.number, play.clock.displayValue, periodCount, regulationLength, overtimeLength, true),
        };
    });
};

const getBasketballPlayType = (play: BasketballPlayInformation): BasketballScoreTypes => {
    // Three pointers always have word 'three' in text description
    if (play.text.toLowerCase().includes('three')) return BasketballScoreTypes.ThreePoints;

    // Free throws always have 'Free Throw' in type description
    if (play.type.text.toLowerCase().includes('free throw')) return BasketballScoreTypes.FreeThrow;

    return BasketballScoreTypes.TwoPoints;
};
