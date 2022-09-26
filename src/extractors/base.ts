import { log } from 'crawlee';
import { BoxScoreResponse, CompetitionResponse, EventSummaryResponse, VenueResponse } from '../types/response/base.js';
import { CompetitionData, CompetitorData, MatchDetailData, MatchPlayerData } from '../types/dataset/base.js';
import { ResultTypes } from '../types/enum.js';

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
            id: competitor.id,
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
 * Extracts data for specific match.
 * Works for all supported sports, does not contain any sport specific logic.
 *
 * @param eventSummary
 */
export const getGeneralMatchInformationData = (eventSummary: EventSummaryResponse): MatchDetailData => {
    if (eventSummary.header.competitions.length === 0) throw new Error('No competition returned');

    const { attendance } = eventSummary.gameInfo;
    const competitionData = getCompetitionData(eventSummary.header.competitions[0]);
    const officials = getOfficials(eventSummary);
    const players = getPlayersData(eventSummary.boxscore);
    const venue = getFormattedVenue(eventSummary.gameInfo.venue);

    return {
        resultType: ResultTypes.MatchDetail,
        ...competitionData,
        officials,
        venue,
        attendance,
        players,
    };
};

export const getPlayerMap = (players: MatchPlayerData[]): Map<string, MatchPlayerData> => {
    const map = new Map<string, MatchPlayerData>();

    players.forEach((player) => {
        map.set(player.id, player);
    });

    return map;
};

export const getTeamMap = (competitors: CompetitorData[]): Map<string, CompetitorData> => {
    const map = new Map<string, CompetitorData>();

    competitors.forEach((competitor) => {
        map.set(competitor.id, competitor);
    });

    return map;
};

export const getTimeInSeconds = (
    period: number,
    clock: string,
    periodCount: number,
    regulationLength: number,
    overtimeLength: number,
    reversedTime: boolean,
) => {
    /*
     * Api provides only time in display clock.
     * Some leagues are starting at 0 and clock is incremented e.g. NHL.
     * Some leagues start at period length and decrement down to 0. e.g. NBA
     * Default clock format: '12:23' - minutes:seconds
     * Clock with less than minute: '2.3' - seconds with decimals.
     */

    const tmp = clock.split(':');

    // If less than minute is left on clock, only seconds are shown
    const minutes = tmp.length > 1 ? parseInt(tmp[0], 10) : 0;
    const seconds = tmp.length > 1 ? parseInt(tmp[1], 10) : parseInt(tmp[0], 10);

    const currentPeriodLength = period <= periodCount ? regulationLength : overtimeLength;

    const currentTimeInSeconds = minutes * 60 + seconds;
    const secondsFromPeriodStart = reversedTime ? currentPeriodLength - currentTimeInSeconds : currentTimeInSeconds;

    const pastRegulationPeriods = Math.min(period - 1, periodCount);
    const pastOvertimePeriods = Math.max((period - 1) - periodCount, 0);

    const secondsInPastPeriods = (pastRegulationPeriods * regulationLength) + (pastOvertimePeriods * overtimeLength);
    return secondsInPastPeriods + secondsFromPeriodStart;
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
            const { names, labels, athletes, type } = statisticsType;
            // Some sports have names array, some have labels
            const statNames = names ?? labels;
            if (!statNames) {
                log.error('Could not load statistics names');
                continue;
            }

            for (const athlete of athletes) {
                if (statNames.length !== athlete.stats.length) continue;

                const playerStats: Record<string, string> = {};
                statNames.forEach((statName, index) => {
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

const getOfficials = (eventSummary: EventSummaryResponse): string[] => {
    if (!eventSummary.gameInfo.officials) return [];
    return eventSummary.gameInfo.officials.map((official) => (official.displayName));
};
