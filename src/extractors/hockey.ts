import { HOCKEY_OVERTIME_LENGTH } from '../constants.js';
import { getGeneralMatchInformationData, getPlayerMap, getTeamMap, getTimeInSeconds } from './base.js';
import { CompetitorData, MatchPlayerData } from '../types/dataset/base.js';
import { HockeyEventSummaryResponse, HockeyPlayType } from '../types/response/hockey.js';
import { HockeyMatchDetailData, HockeyPenaltyData, HockeyShotData } from '../types/dataset/hockey.js';

export const getHockeyMatchInformationData = (eventSummary: HockeyEventSummaryResponse): HockeyMatchDetailData => {
    const matchDetailData = getGeneralMatchInformationData(eventSummary);
    if (!matchDetailData) throw new Error('Match could not be parsed');

    const playerMap = getPlayerMap(matchDetailData.players);
    const teamMap = getTeamMap(matchDetailData.competitors);

    const shootingData = getHockeyShootingData(eventSummary, playerMap);
    const penaltyData = getHockeyPenaltiesData(eventSummary, teamMap);

    return {
        ...matchDetailData,
        shooting: shootingData,
        penalties: penaltyData,
    };
};

const getHockeyShootingData = (eventSummary: HockeyEventSummaryResponse, playerMap: Map<string, MatchPlayerData>): HockeyShotData[] => {
    const parsedShootingData: HockeyShotData[] = [];

    const periodCount = eventSummary.format.regulation.periods;
    const regulationLength = eventSummary.format.regulation.clock;

    for (const play of eventSummary.plays) {
        if (!play.shootingPlay) continue;
        if (play.participants.length === 0) continue;

        // Filter out participant with set ytdGoals (shooter)
        const shooter = play.participants.filter((player) => player.ytdGoals !== undefined)[0]?.athlete;
        if (!shooter) continue;

        // Filter out participant with set ytdAssits (shooter)
        const playersWithAssists = play.participants.filter((player) => player.ytdAssists !== undefined);
        const assists = playersWithAssists.map((player) => {
            return {
                id: player.athlete.id,
                name: player.athlete.displayName,
            };
        });

        const shooterPlayerData = playerMap.get(shooter.id);
        if (!shooterPlayerData) continue;

        const timeInSeconds = getTimeInSeconds(play.period.number, play.clock.displayValue, periodCount, regulationLength, HOCKEY_OVERTIME_LENGTH, false);

        parsedShootingData.push({
            id: play.id,
            homeScore: play.homeScore,
            awayScore: play.awayScore,
            scored: play.scoringPlay,
            team: shooterPlayerData.team,
            shooter: {
                id: shooter.id,
                name: shooter.displayName,
            },
            assists: play.scoringPlay ? assists : [],
            timeInSeconds,
            description: play.text,
        });
    }

    return parsedShootingData;
};

const getHockeyPenaltiesData = (eventSummary: HockeyEventSummaryResponse, teamMap: Map<string, CompetitorData>): HockeyPenaltyData[] => {
    const parsedPenaltyData: HockeyPenaltyData[] = [];

    const periodCount = eventSummary.format.regulation.periods;
    const regulationLength = eventSummary.format.regulation.clock;

    const penaltyPlays = eventSummary.plays.filter((play) => play.type.abbreviation === HockeyPlayType.Penalty);
    for (const play of penaltyPlays) {
        const punishedPlayer = play.participants?.[0]?.athlete;

        const punishedTeam = teamMap.get(play.team.id);
        if (!punishedTeam) continue;

        const timeInSeconds = getTimeInSeconds(play.period.number, play.clock.displayValue, periodCount, regulationLength, HOCKEY_OVERTIME_LENGTH, false);

        parsedPenaltyData.push({
            id: play.id,
            team: punishedTeam.abbreviation,
            punishedPlayer: punishedPlayer ? {
                id: punishedPlayer.id,
                name: punishedPlayer.displayName,
            } : null,
            timeInSeconds,
            lengthInMinutes: getHockeyPenaltyLength(play.text),
            description: play.text,
        });
    }

    return parsedPenaltyData;
};

const getHockeyPenaltyLength = (description: string): number | null => {
    const splitByMinutes = description.split('minutes')[0];
    const splitBySpaces = splitByMinutes.trim().split(' ');
    const minutes = splitBySpaces[splitBySpaces.length - 1];
    if (Number.isNaN(minutes)) return null;

    return parseInt(minutes, 10);
};
