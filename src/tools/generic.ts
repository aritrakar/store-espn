import { Leagues, SeasonTypes, Sports } from '../types/enum.js';
import { InputSchema, ParsedInput } from '../types/base.js';

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

export const parseInput = (input: InputSchema): ParsedInput => {
    if (!input) throw new Error('Input not provided.');

    const {
        scrapeMatchList,
        years,
        seasonTypes,
        leagues,
        games,
        gameDetailsLeague,
        newsLeagues,
    } = input;

    const parsedYears = years.map((year) => parseInt(year, 10));

    const parsedSeasonTypes = seasonTypes.map((seasonType) => {
        if (!isEnumType<SeasonTypes>(seasonType)) {
            throw new Error('Provided invalid season type input');
        }

        return seasonType as SeasonTypes;
    });

    const parsedLeagues = leagues.map((league) => {
        if (!isEnumType<Leagues>(league)) {
            throw new Error('Provided invalid season type input');
        }

        return league as Leagues;
    });

    const parsedGames = games
        .map((rawGameInput) => getGameIdFromInput(rawGameInput))
        .filter((gameId) => (gameId !== null)) as number[];
    const scrapeMatchDetails = games.length > 0;

    if (scrapeMatchDetails && !gameDetailsLeague) {
        throw new Error('For game details scraping, you have to provide gameDetailsLeague input');
    }

    if (!isEnumType<Leagues>(gameDetailsLeague as Leagues)) {
        throw new Error('Provided invalid gamesDetailsLeague input');
    }

    const gameDetailsSport = getSportByLeague(gameDetailsLeague);

    if (newsLeagues && typeof newsLeagues.length !== 'number') {
        throw new Error('Provided invalid newsLeagues input');
    }

    return {
        scrapeMatchList,
        years: parsedYears,
        seasonTypes: parsedSeasonTypes,
        leagues: parsedLeagues,
        games: parsedGames,
        scrapeMatchDetails,
        gameDetailsLeague,
        gameDetailsSport,
        scrapeNews: newsLeagues && newsLeagues.length > 0,
        newsLeagues,
    };
};

export const getSportByLeague = (league: Leagues) => {
    const mappings = {
        [Leagues.MLB]: Sports.Baseball,
        [Leagues.NHL]: Sports.Hockey,
        [Leagues.NBA]: Sports.Basketball,
        [Leagues.WNBA]: Sports.Basketball,
        [Leagues.CollegeBasketballMen]: Sports.Basketball,
        [Leagues.CollegeBasketballWomen]: Sports.Basketball,
        [Leagues.NFL]: Sports.Football,
    };

    return mappings[league];
};

const getGameIdFromInput = (rawGameInput: string): number | null => {
    // rawGameInput might be ID or url
    if (!Number.isNaN(Number(rawGameInput))) return parseInt(rawGameInput, 10);

    // URLs might be in two formats
    // URL in format https://www.espn.com/mlb/recap?gameId={id}
    const url = new URL(rawGameInput);

    if (url.searchParams.has('gameId')) {
        const gameId = url.searchParams.get('gameId');
        return parseInt(gameId as string, 10);
    }

    // URL in format: https://www.espn.com/mlb/{type_of_view}/_/gameId/401444866
    const splitPathname = url.pathname.split('/');
    if (splitPathname.length === 0) return null;

    const gameId = splitPathname[splitPathname.length - 1];
    if (!Number.isNaN(Number(gameId))) return parseInt(gameId, 10);

    return null;
};

const isEnumType = <T>(e: T) => (token: unknown): token is T[keyof T] => Object.values(e).includes(token as T[keyof T]);
