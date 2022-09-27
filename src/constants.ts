import { Leagues } from './types/enum.js';

// Higher values are causing timeouts
export const CONCURRENCY = 15;

export const DOMAIN_NAME = 'espn.com';
export const API_BASE_URL = 'https://site.web.api.espn.com';
export const ONEFEED_BASE_URL = 'https://onefeed.fan.api.espn.com';

export const HOCKEY_OVERTIME_LENGTH = 300;

export const ARTICLE_FEED_LIMIT = 20;
export const ARTICLE_FEED_PUBKEYS: Record<string, string> = {
    [Leagues.CollegeBasketballMen]: 'ncb',
    [Leagues.CollegeBasketballWomen]: 'ncaaw',
};
