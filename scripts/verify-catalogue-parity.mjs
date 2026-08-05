// Verifies public/data/emblems.json stays in parity with the canonical
// catalogue in src/services/codeScraperService.ts.
// Run: node scripts/verify-catalogue-parity.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOGUE_PATH = path.join(__dirname, '..', 'src', 'services', 'codeScraperService.ts');
const DATA_PATH = path.join(__dirname, '..', 'public', 'data', 'emblems.json');

const source = fs.readFileSync(CATALOGUE_PATH, 'utf8');
const entryPattern = /\{\s*code:\s*'([^']+)'\s*,\s*emblemName:\s*'((?:[^'\\]|\\.)*)'/g;

const catalogue = {};
const duplicates = [];
for (const match of source.matchAll(entryPattern)) {
  const code = match[1];
  if (catalogue[code]) duplicates.push(code);
  catalogue[code] = match[2].replace(/\\'/g, "'").replace(/\\\\/g, '\\');
}

const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
const codeToEmblem = data.codeToEmblem ?? {};
const legacyEmblems = data.legacyEmblems ?? {};
const emblems = data.emblems ?? {};

const catalogueCodes = Object.keys(catalogue);
const charset = /^[ACDFGHJKLMNPRTVXY34679]{3}-[ACDFGHJKLMNPRTVXY34679]{3}-[ACDFGHJKLMNPRTVXY34679]{3}$/;

const problems = [];

if (duplicates.length) {
  problems.push(`Duplicate codes in catalogue: ${duplicates.join(', ')}`);
}

const badFormat = catalogueCodes.filter((code) => !charset.test(code));
if (badFormat.length) {
  problems.push(`Codes failing Bungie charset: ${badFormat.join(', ')}`);
}

const missingFromData = catalogueCodes.filter((code) => !codeToEmblem[code]);
if (missingFromData.length) {
  problems.push(`Codes missing from emblems.json: ${missingFromData.join(', ')}`);
}

const orphaned = Object.keys(codeToEmblem).filter((code) => !catalogue[code]);
if (orphaned.length) {
  problems.push(`emblems.json codes absent from catalogue: ${orphaned.join(', ')}`);
}

const nameMismatches = catalogueCodes
  .filter((code) => codeToEmblem[code] && codeToEmblem[code] !== catalogue[code])
  .map((code) => `${code} (json="${codeToEmblem[code]}" vs catalogue="${catalogue[code]}")`);
if (nameMismatches.length) {
  problems.push(`Emblem name mismatches: ${nameMismatches.join('; ')}`);
}

const missingIcons = catalogueCodes.filter(
  (code) => !legacyEmblems[catalogue[code]] && !emblems[catalogue[code]]
);
if (missingIcons.length) {
  problems.push(`Codes with no resolvable icon: ${missingIcons.join(', ')}`);
}

console.log(`Catalogue codes:      ${catalogueCodes.length}`);
console.log(`emblems.json codes:   ${Object.keys(codeToEmblem).length}`);
console.log(`Manifest emblems:     ${Object.keys(emblems).length}`);
console.log(`Legacy icon overrides:${Object.keys(legacyEmblems).length}`);
console.log(`Icon coverage:        ${catalogueCodes.length - missingIcons.length}/${catalogueCodes.length}`);

if (problems.length) {
  console.error('\nFAILED:');
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log('\nOK: catalogue and emblem database are in parity.');
