import { BaseballPlayerTypes, BaseballPlayTypes } from '../types/enum.js';
import { MatchPlayerData } from '../types/dataset/base.js';
import { getGeneralMatchInformationData, getPlayerMap } from './base.js';
import { BaseballEventSummaryResponse, BaseballPlayInformation } from '../types/response/baseball.js';
import { BaseballMatchDetailData, BaseballAtBatData, BaseballPitchData } from '../types/dataset/baseball.js';

export const getBaseballMatchInformationData = (eventSummary: BaseballEventSummaryResponse): BaseballMatchDetailData => {
    const matchDetailData = getGeneralMatchInformationData(eventSummary);
    if (!matchDetailData) throw new Error('Match could not be parsed');

    const playerMap = getPlayerMap(matchDetailData.players);
    const atBats = getBaseballAtBatsData(eventSummary, playerMap);

    return {
        ...matchDetailData,
        atBats,
    };
};

const getAtBatOutcome = (pitches: BaseballPitchData[], playResult: BaseballPlayInformation): string => {
    // If there are no pitches, get text from play result
    if (pitches.length === 0) {
        return playResult.text;
    }

    // If there are pitches, get better result from last pitch
    const type = pitches[pitches.length - 1].outcome as BaseballPlayTypes;
    if ([BaseballPlayTypes.StrikeSwinging, BaseballPlayTypes.StrikeSwinging].includes(type)) {
        return 'strikeout';
    }

    if ([BaseballPlayTypes.Ball, BaseballPlayTypes.FoulBall].includes(type)) {
        return 'walk';
    }

    return type;
};

const getBaseballAtBatsData = (eventSummary: BaseballEventSummaryResponse, athletes: Map<string, MatchPlayerData>): BaseballAtBatData[] => {
    const parsedAtBats: BaseballAtBatData[] = [];
    for (const [atBatId, atBat] of Object.entries(eventSummary.atBats)) {
        const plays = [];

        // Load plays referenced at atBat
        for (const playReference of atBat) {
            const ref = playReference.$ref.split('/');
            const id = parseInt(ref[ref.length - 1], 10);
            plays.push(eventSummary.plays[id]);
        }

        // Get play that has the at-bat summary
        const playResultArr = plays.filter((play) => play.type.type === BaseballPlayTypes.PlayResult);
        if (playResultArr.length === 0) continue;
        const playResult = playResultArr[0];

        // Plays without participants are irrelevant
        if (!playResult.participants) continue;

        const pitcherId = playResult.participants.filter((participant) => participant.type === BaseballPlayerTypes.Pitcher)[0]?.athlete.id;
        const batterId = playResult.participants.filter((participant) => participant.type === BaseballPlayerTypes.Batter)[0]?.athlete.id;
        if (!pitcherId || !batterId) continue;

        const pitcherData = athletes.get(pitcherId);
        const pitcher = pitcherData ? {
            id: pitcherId,
            name: pitcherData.name,
            team: pitcherData.team,
        } : undefined;

        const batterData = athletes.get(batterId);
        const batter = batterData ? {
            id: pitcherId,
            name: batterData.name,
            team: batterData.team,
        } : undefined;

        // Get all plays, that have information about thrown pitch
        const pitchPlays = plays.filter((play) => play.pitchType);

        const parsedPitches = pitchPlays.map((play) => {
            return {
                pitchType: play.pitchType?.abbreviation || '',
                strike: [BaseballPlayTypes.StrikeSwinging, BaseballPlayTypes.StrikeLooking, BaseballPlayTypes.FoulBall].includes(play.type.type),
                outcome: play.type.type,
            };
        });

        // Last pitch has information about total at bat outcome
        const atBatOutcome = getAtBatOutcome(parsedPitches, playResult);

        parsedAtBats.push({
            id: atBatId,
            homeScore: playResult.homeScore,
            awayScore: playResult.awayScore,
            description: playResult.text,
            balls: playResult.resultCount.balls,
            strikes: playResult.resultCount.strikes,
            outcome: atBatOutcome,
            pitches: parsedPitches,
            pitcher,
            batter,
        });
    }

    return parsedAtBats;
};
