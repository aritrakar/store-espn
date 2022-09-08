import { InputOptions, Leagues, ParsedInput, SeasonTypes, Sports } from '../types.js';

export const getDatesBetween = (startDateString: string, endDateString: string) => {
    const rangeEndDate = new Date(endDateString);
    const currentDate = new Date(startDateString);
    const todayDate = new Date();

    // Ending always on today's date or sooner
    const endDate = todayDate < rangeEndDate ? todayDate : rangeEndDate;

    const days = [];
    while (currentDate <= endDate) {
        const monthString = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const dayString = currentDate.getDate().toString().padStart(2, '0');
        const formattedDate = `${currentDate.getFullYear()}${monthString}${dayString}`;
        days.push(formattedDate);

        // Add 1 day
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
};

export const parseInput = (input: InputOptions): ParsedInput => {
    if (!input) throw new Error('Input not provided.');

    const {
        scrapeMatchList,
        years,
        seasonTypes,
        leagues,
    } = input;

    const parsedYears = years.map((year) => parseInt(year, 10));

    const parsedSeasonTypes = seasonTypes.map((seasonType) => {
        if (!Object.values(SeasonTypes).includes(seasonType as SeasonTypes)) {
            throw new Error('Provided invalid season type as an input ');
        }

        return seasonType as SeasonTypes;
    });

    const parsedLeagues = leagues.map((league) => {
        if (!Object.values(Leagues).includes(league as Leagues)) {
            throw new Error('Provided invalid season type as an input ');
        }

        return league as Leagues;
    });

    return {
        scrapeMatchList,
        years: parsedYears,
        seasonTypes: parsedSeasonTypes,
        leagues: parsedLeagues,
    };
};

export const getSportByLeague = (league: Leagues) => {
    const mappings = {
        [Leagues.MLB]: Sports.Baseball,
    };

    return mappings[league];
};
