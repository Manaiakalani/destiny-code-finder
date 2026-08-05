// Full Emblem Scraper Script
// Refreshes the Bungie emblem icon manifest in public/data/emblems.json.
//
// Safety contract: the code -> emblem mapping is DERIVED from the canonical
// catalogue in src/services/codeScraperService.ts, never from a copy kept in
// this file. Hand-maintained sections (legacyEmblems) are preserved, and the
// script refuses to write a file that would drop codes or icon coverage.

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BUNGIE_API_KEY = process.env.BUNGIE_API_KEY;

if (!BUNGIE_API_KEY) {
  console.error('BUNGIE_API_KEY environment variable is required');
  console.error('   Get a free key at: https://www.bungie.net/en/Application');
  console.error('   Then run: BUNGIE_API_KEY=your_key node scripts/scrape-emblems.js');
  process.exit(1);
}

const MANIFEST_URL = 'https://www.bungie.net/common/destiny2_content/json/en/DestinyInventoryItemDefinition-6a2a46ee-e5f9-4c5b-ad6b-bf29948434d6.json';
const CATALOGUE_PATH = path.join(__dirname, '..', 'src', 'services', 'codeScraperService.ts');
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'data', 'emblems.json');

// Read the single source of truth rather than duplicating it here.
function readCatalogueMappings() {
  const source = fs.readFileSync(CATALOGUE_PATH, 'utf8');
  const entryPattern = /\{\s*code:\s*'([^']+)'\s*,\s*emblemName:\s*'((?:[^'\\]|\\.)*)'/g;
  const mappings = {};

  for (const match of source.matchAll(entryPattern)) {
    mappings[match[1]] = match[2].replace(/\\'/g, "'").replace(/\\\\/g, '\\');
  }

  if (Object.keys(mappings).length === 0) {
    throw new Error(`Parsed 0 codes from ${CATALOGUE_PATH} - refusing to continue.`);
  }

  return mappings;
}

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'X-API-Key': BUNGIE_API_KEY,
        'User-Agent': 'Destiny Code Finder/1.0'
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function countResolvableCodes(codeToEmblem, emblems, legacyEmblems) {
  return Object.values(codeToEmblem)
    .filter((name) => Boolean(legacyEmblems[name] || emblems[name]))
    .length;
}

async function main() {
  const previous = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));
  const legacyEmblems = previous.legacyEmblems ?? {};
  const codeToEmblem = readCatalogueMappings();

  console.log(`Catalogue codes: ${Object.keys(codeToEmblem).length}`);
  console.log('Fetching Bungie manifest...');

  const manifest = await fetchJSON(MANIFEST_URL);
  const emblems = {};

  for (const [hash, item] of Object.entries(manifest)) {
    if (item.itemTypeDisplayName === 'Emblem' && item.displayProperties?.icon) {
      const { name, icon } = item.displayProperties;
      if (name && icon) {
        emblems[name] = { hash: parseInt(hash, 10), icon };
      }
    }
  }

  console.log(`Found ${Object.keys(emblems).length} emblems in manifest`);

  // Regression guards: never ship fewer codes or less icon coverage than we already have.
  const previousCodeCount = Object.keys(previous.codeToEmblem ?? {}).length;
  const nextCodeCount = Object.keys(codeToEmblem).length;
  if (nextCodeCount < previousCodeCount) {
    throw new Error(`Refusing to write: code count would drop ${previousCodeCount} -> ${nextCodeCount}.`);
  }

  const previousResolvable = countResolvableCodes(previous.codeToEmblem ?? {}, previous.emblems ?? {}, legacyEmblems);
  const nextResolvable = countResolvableCodes(codeToEmblem, emblems, legacyEmblems);
  if (nextResolvable < previousResolvable) {
    throw new Error(`Refusing to write: icon coverage would drop ${previousResolvable} -> ${nextResolvable}.`);
  }

  const unresolved = Object.entries(codeToEmblem)
    .filter(([, name]) => !legacyEmblems[name] && !emblems[name]);

  for (const [code, name] of unresolved) {
    console.warn(`  ${code} -> ${name} (no icon in manifest or legacyEmblems)`);
  }

  const database = {
    version: previous.version,
    lastUpdated: new Date().toISOString(),
    localCache: previous.localCache ?? false,
    codeToEmblem,
    legacyEmblems,
    emblems
  };

  // Keep the file minified - it ships to the browser and diffs stay readable.
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(database));

  console.log(`Saved database to ${OUTPUT_PATH}`);
  console.log(`Codes: ${nextCodeCount} | icon coverage: ${nextResolvable}/${nextCodeCount} | unresolved: ${unresolved.length}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
