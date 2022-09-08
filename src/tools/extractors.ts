import { CompetitionResponse } from '../types.js';

export type CompetitionData = {
    id: string,
    date: string,
    competitors: {
        displayName: string,
        abbreviation: string,
        winner: boolean | null,
        home: boolean,
        score: number,
    }[],
    attendance: number,
    headlines: {
        long: string,
        short: string,
    }[],
    venue: {
        capacity: number,
        fullName: string,
        city: string,
        state: string,
    } | null,
    winnerAbbreviation: string | null,
}

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

    const venue = getFormattedVenue(competition);
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

const getFormattedVenue = (competition: CompetitionResponse) => {
    if (!competition.venue) return null;

    return {
        capacity: competition.venue.capacity,
        fullName: competition.venue.fullName,
        city: competition.venue.address.city,
        state: competition.venue.address.state,
    };
};
