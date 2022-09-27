import { Actor } from 'apify';
import { HttpCrawler, log, LogLevel } from 'crawlee';
import { router } from './routes.js';
import { parseInput } from './tools/generic.js';
import { getStartRequests } from './tools/url.js';
import { InputSchema } from './types/base.js';
import { CONCURRENCY } from './constants.js';

await Actor.init();

const input = await Actor.getInput<InputSchema>();
if (!input) throw new Error('Input not provided');

if (input.debug) {
    log.setLevel(LogLevel.DEBUG);
}

const parsedInput = parseInput(input);
const startUrls = getStartRequests(parsedInput);
const proxyConfiguration = await Actor.createProxyConfiguration();

const crawler = new HttpCrawler({
    proxyConfiguration,
    maxConcurrency: CONCURRENCY,
    requestHandler: router,
});

await crawler.run(startUrls);

await Actor.exit();
