import { BoxScoreResponse, CompetitionResponse, EventSummaryResponse, VenueResponse } from '../types/base.js';
import { BaseballEventSummaryResponse, BaseballPlayInformation } from '../types/baseball.js';
import { BaseballPlayerTypes, BaseballPlayTypes } from '../types/enum.js';

export type VenueData = {
    capacity: number,
    fullName: string,
    city: string,
    state: string,
}

export type CompetitorData = {
    displayName: string,
    abbreviation: string,
    winner: boolean | null,
    home: boolean,
    score: number,
};

export interface CompetitionData {
    id: string,
    date: string,
    competitors: CompetitorData[],
    attendance: number,
    headlines: {
        long: string,
        short: string,
    }[],
    venue: VenueData | null,
    winnerAbbreviation: string | null,
}

interface MatchPlayerData {
    id: string,
    statType?: string,
    position: string,
    stats: Record<string, string>,
    team: string,
    name: string,
}

interface MatchDetailData extends CompetitionData {
    officials: string[],
    players: MatchPlayerData[],
}

interface PitchData {
    pitchType: string,
    strike: boolean,
    outcome: string,
}

interface BaseballAtBatData {
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

interface BaseballMatchDetailData extends MatchDetailData {
    atBats: BaseballAtBatData[],
}

/**
 * Extracts general data about match.
 * Works for all supported sports, does not contain any sport specific logic
 *
 * @param competition
 */
export const getCompetitionData = (competition: CompetitionResponse): CompetitionData => {
    const competitors = [];
    let winner;

    const { id, date } = competition;
    for (const competitor of competition.competitors) {
        competitors.push({
            winner: (typeof competitor.winner === 'boolean') ? competitor.winner : null,
            displayName: competitor.team.displayName,
            abbreviation: competitor.team.abbreviation,
            home: competitor.homeAway === 'home',
            score: parseInt(competitor.score, 10),
        });

        if (competitor.winner) winner = competitor;
    }

    const headlines = competition.headlines?.map((headline) => {
        return {
            long: headline.description,
            short: headline.shortLinkText,
        };
    });

    const venue = getFormattedVenue(competition.venue);
    return {
        id,
        date,
        venue,
        competitors,
        headlines: headlines || [],
        attendance: competition.attendance,
        winnerAbbreviation: winner ? winner.team.abbreviation : null,
    };
};

/**
 * Extracts baseball data for specific match
 *
 * @param eventSummary
 */
export const getBaseballMatchInformationData = (eventSummary: BaseballEventSummaryResponse): BaseballMatchDetailData | null => {
    const matchDetailData = getMatchInformationData(eventSummary);
    if (!matchDetailData) return null;

    const playerMap = getPlayerMap(matchDetailData.players);
    const atBats = getBaseballAtBatsData(eventSummary, playerMap);

    return {
        ...matchDetailData,
        atBats,
    };
};

/**
 * Extracts data for specific match.
 * Works for all supported sports, does not contain any sport specific logic.
 * Should be called by a function, that adds additional data for specific sport
 *
 * @param eventSummary
 */
const getMatchInformationData = (eventSummary: EventSummaryResponse): MatchDetailData => {
    if (eventSummary.header.competitions.length === 0) throw new Error('No competition returned');

    const { attendance } = eventSummary.gameInfo;
    const competitionData = getCompetitionData(eventSummary.header.competitions[0]);
    const officials = getOfficials(eventSummary);
    const players = getPlayersData(eventSummary.boxscore);
    const venue = getFormattedVenue(eventSummary.gameInfo.venue);

    return {
        ...competitionData,
        officials,
        venue,
        attendance,
        players,
    };
};

const getOfficials = (eventSummary: EventSummaryResponse): string[] => {
    if (!eventSummary.gameInfo.officials) return [];
    return eventSummary.gameInfo.officials.map((official) => (official.displayName));
};

const getPlayerMap = (players: MatchPlayerData[]): Map<string, MatchPlayerData> => {
    const map = new Map<string, MatchPlayerData>();

    players.forEach((player) => {
        map.set(player.id, player);
    });

    return map;
};

const getFormattedVenue = (venueResponse: VenueResponse | undefined) => {
    if (!venueResponse) return null;

    return {
        capacity: venueResponse.capacity,
        fullName: venueResponse.fullName,
        city: venueResponse.address.city,
        state: venueResponse.address.state,
    };
};

const getPlayersData = (boxScore: BoxScoreResponse): MatchPlayerData[] => {
    const { players } = boxScore;

    // Parse statistics for each player
    const parsedPlayerStats: MatchPlayerData[] = [];
    for (const playerStatistics of players) {
        const { team } = playerStatistics;
        // Iterate over each statistics type e.g.: batting and pitcher statistics
        // Some sports have only one type of statistics
        for (const statisticsType of playerStatistics.statistics) {
            const { names, athletes, type } = statisticsType;

            for (const athlete of athletes) {
                if (names.length !== athlete.stats.length) continue;

                const playerStats: Record<string, string> = {};
                names.forEach((statName, index) => {
                    playerStats[statName] = athlete.stats[index];
                });

                parsedPlayerStats.push({
                    id: athlete.athlete.id,
                    stats: playerStats,
                    team: team.abbreviation,
                    statType: type || undefined,
                    position: athlete.athlete.position.abbreviation,
                    name: athlete.athlete.displayName,
                });
            }
        }
    }

    return parsedPlayerStats;
};

const getAtBatOutcome = (pitches: PitchData[], playResult: BaseballPlayInformation): string => {
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

/**
 * Parses data for baseball match.
 * Creates one entry for each at-bat.
 *
 * @param eventSummary
 * @param athletes
 */
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
