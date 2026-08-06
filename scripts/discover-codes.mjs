// Community code discovery
//
// The original scraper ran in the browser through a public CORS proxy and was
// removed as broken. The problem was never the idea, it was the location:
// server-side there is no CORS and no third party in the data path. Reddit's
// anonymous JSON endpoints now return 403, so Reddit is opt-in via OAuth and
// the primary source is the community catalogue the project already trusts.
//
// This deliberately does NOT edit the catalogue. Codes redeem once per account,
// so a wrong entry costs a user a real redemption and erodes trust in every
// other row. Candidates are reported for a human to verify before they land in
// src/services/codeScraperService.ts.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOGUE_PATH = path.join(__dirname, '..', 'src', 'services', 'codeScraperService.ts');

const USER_AGENT =
  'destiny-code-finder/1.0 (+https://github.com/Manaiakalani/destiny-code-finder) code-discovery';
const REQUEST_TIMEOUT_MS = 20_000;

// Bungie codes exclude the glyphs that are easy to misread: B E I O S U Z 0 1 2 5 8.
const BUNGIE_CHARSET = 'ACDFGHJKLMNPRTVXY34679';
const BUNGIE_CODE = new RegExp(
  `^[${BUNGIE_CHARSET}]{3}-[${BUNGIE_CHARSET}]{3}-[${BUNGIE_CHARSET}]{3}$`
);
const CANDIDATE_PATTERN = /\b[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}\b/gi;

// Placeholders that look exactly like codes and appear constantly in threads.
const NOISE = new Set(['XXX-XXX-XXX', 'AAA-AAA-AAA', '333-333-333', '777-777-777']);

const REDDIT_SEARCHES = [
  { subreddit: 'DestinyTheGame', query: 'emblem code' },
  { subreddit: 'destiny2', query: 'emblem code' },
  { subreddit: 'raidsecrets', query: 'emblem code' },
];

function isBungieCode(value) {
  const code = value.toUpperCase();
  return BUNGIE_CODE.test(code) && !NOISE.has(code);
}

/** The catalogue is the single source of truth; never duplicate it here. */
function readKnownCodes() {
  const source = fs.readFileSync(CATALOGUE_PATH, 'utf8');
  const codes = new Set();

  for (const match of source.matchAll(/\{\s*code:\s*'([^']+)'/g)) {
    codes.add(match[1].toUpperCase());
  }

  if (codes.size === 0) {
    throw new Error(`Parsed 0 codes from ${CATALOGUE_PATH} — refusing to continue.`);
  }

  return codes;
}

async function fetchText(url, headers = {}) {
  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, ...headers },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.text();
}

/**
 * Destiny Emblem Collector lists every emblem currently redeemable with a
 * universal code, one block per emblem. No auth, and it is the reference the
 * catalogue was last reconciled against.
 */
async function fetchEmblemCollector() {
  const html = await fetchText('https://destinyemblemcollector.com/availability/universalcode');
  const sightings = [];

  for (const block of html.split('gridemblem-index').slice(1)) {
    // Some entries ship an empty "Emblem Code:" label but still carry the code
    // in the redeem link, so fall back to the token rather than lose the row.
    const code =
      block.match(/Emblem Code:\s*([A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3})/i)?.[1] ??
      block.match(/Codes\/Redeem\/?\?token=([A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3})/i)?.[1];
    if (!code || !isBungieCode(code)) continue;

    const emblemName = block.match(/<h2>([^<]+)<\/h2>/)?.[1]?.trim() ?? null;
    const emblemId = block.match(/\/emblem\?id=(\d+)/)?.[1] ?? null;

    sightings.push({
      code: code.toUpperCase(),
      emblemName,
      url: emblemId
        ? `https://destinyemblemcollector.com/emblem?id=${emblemId}`
        : 'https://destinyemblemcollector.com/availability/universalcode',
    });
  }

  if (sightings.length === 0) {
    // Better to fail loudly than to silently report "no new codes" because the
    // page markup changed underneath us.
    throw new Error('parsed 0 codes — page structure may have changed');
  }

  return sightings;
}

/**
 * Reddit's anonymous endpoints return 403, so this needs an app credential.
 * Create a "script" app at https://www.reddit.com/prefs/apps and expose
 * REDDIT_CLIENT_ID / REDDIT_CLIENT_SECRET. Without them the source is skipped,
 * not failed.
 */
async function fetchReddit() {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    const error = new Error('no REDDIT_CLIENT_ID / REDDIT_CLIENT_SECRET configured');
    error.skipped = true;
    throw error;
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'User-Agent': USER_AGENT,
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!tokenResponse.ok) {
    throw new Error(`token request failed: HTTP ${tokenResponse.status}`);
  }

  const { access_token: token } = await tokenResponse.json();
  if (!token) throw new Error('token request returned no access_token');

  const sightings = [];

  for (const { subreddit, query } of REDDIT_SEARCHES) {
    const url =
      `https://oauth.reddit.com/r/${subreddit}/search` +
      `?q=${encodeURIComponent(query)}&restrict_sr=1&sort=new&limit=100&t=month`;

    let payload;
    try {
      payload = JSON.parse(await fetchText(url, { Authorization: `Bearer ${token}` }));
    } catch {
      continue; // One dead subreddit must not sink the whole source.
    }

    for (const post of payload?.data?.children ?? []) {
      const title = post?.data?.title ?? '';
      const selftext = post?.data?.selftext ?? '';
      const permalink = post?.data?.permalink
        ? `https://www.reddit.com${post.data.permalink}`
        : 'https://www.reddit.com';

      for (const raw of `${title} ${selftext}`.match(CANDIDATE_PATTERN) ?? []) {
        if (!isBungieCode(raw)) continue;
        sightings.push({
          code: raw.toUpperCase(),
          emblemName: null,
          url: permalink,
          context: title.slice(0, 140),
        });
      }
    }
  }

  return sightings;
}

const SOURCES = [
  { id: 'emblem-collector', label: 'Destiny Emblem Collector', run: fetchEmblemCollector },
  { id: 'reddit', label: 'Reddit', run: fetchReddit },
];

async function main() {
  const asJson = process.argv.includes('--json');
  const verbose = process.argv.includes('--verbose');
  const log = asJson ? () => {} : (...args) => console.log(...args);

  const knownCodes = readKnownCodes();
  log(`Catalogue codes: ${knownCodes.size}`);

  const candidates = new Map();
  const seenAtSource = new Set();
  const sourceReports = [];

  for (const source of SOURCES) {
    try {
      const sightings = await source.run();
      sourceReports.push({ id: source.id, status: 'ok', sightings: sightings.length });
      log(`  ${source.label}: ${sightings.length} code(s) seen`);

      for (const sighting of sightings) {
        seenAtSource.add(sighting.code);
        if (knownCodes.has(sighting.code)) continue;

        if (!candidates.has(sighting.code)) {
          candidates.set(sighting.code, { code: sighting.code, emblemName: null, sources: [] });
        }

        const candidate = candidates.get(sighting.code);
        candidate.emblemName ??= sighting.emblemName;
        if (!candidate.sources.some(entry => entry.id === source.id)) {
          candidate.sources.push({ id: source.id, url: sighting.url, context: sighting.context });
        }
      }
    } catch (error) {
      const status = error.skipped ? 'skipped' : 'failed';
      sourceReports.push({ id: source.id, status, reason: error.message });
      log(`  ${source.label}: ${status} — ${error.message}`);
    }
  }

  const usable = sourceReports.filter(report => report.status === 'ok');
  // Corroboration across sources is the strongest cheap signal available.
  const ranked = [...candidates.values()].sort((a, b) => b.sources.length - a.sources.length);

  // Only meaningful if a source actually enumerates current availability.
  const notListed = usable.some(report => report.id === 'emblem-collector')
    ? [...knownCodes].filter(code => !seenAtSource.has(code)).sort()
    : [];

  if (asJson) {
    console.log(
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          knownCodeCount: knownCodes.size,
          sources: sourceReports,
          candidates: ranked,
          notListedUpstream: notListed,
        },
        null,
        2
      )
    );
  } else if (usable.length === 0) {
    log('\nEvery source failed. Nothing can be concluded from this run.');
  } else if (ranked.length === 0) {
    log('\nNo unknown codes found. Catalogue looks current.');
  } else {
    log(`\n${ranked.length} candidate code(s) not in the catalogue:\n`);
    for (const candidate of ranked) {
      log(`  ${candidate.code}${candidate.emblemName ? `  — ${candidate.emblemName}` : ''}`);
      for (const source of candidate.sources) {
        log(`      ${source.id}: ${source.url}`);
        if (source.context) log(`      "${source.context}"`);
      }
      log('');
    }
    log('Verify each against Bungie before adding to src/services/codeScraperService.ts,');
    log('then run: npm run scrape:emblems && npm run verify:catalogue');
  }

  if (notListed.length) {
    log(
      `\n${notListed.length} catalogue code(s) are not on the upstream availability list. ` +
        'That is expected for expired or account-specific codes, not proof of expiry.'
    );
    if (verbose) log(`  ${notListed.join(', ')}`);
  }

  // A run where nothing could be read proves nothing; make that distinguishable
  // from a genuinely clean run so a scheduled job cannot report false confidence.
  if (usable.length === 0) {
    process.exitCode = 2;
  }
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
