// Turns discover-codes.mjs JSON into a job summary and, when there are
// candidates, an issue body. Kept out of the workflow YAML so it can be run and
// debugged locally: node scripts/discovery-report.mjs discovery.json

import fs from 'fs';

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('usage: node scripts/discovery-report.mjs <discovery.json>');
  process.exit(1);
}

let report;
try {
  report = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
} catch (error) {
  // A malformed payload means the discovery step itself broke; say so rather
  // than reporting a reassuring "no candidates".
  console.error(`Could not read ${inputPath}: ${error.message}`);
  process.exit(1);
}

const candidates = report.candidates ?? [];
const sources = report.sources ?? [];
// A run that read nothing proves nothing. Without this, an all-sources-down week
// would headline "No unknown codes found" and read as reassurance.
const readAnySource = sources.some(source => source.status === 'ok');

const sourceLines = sources.map(source =>
  source.status === 'ok'
    ? `- \`${source.id}\`: ${source.sightings} code(s) seen`
    : `- \`${source.id}\`: ${source.status} — ${source.reason}`
);

const lines = [
  `Catalogue holds ${report.knownCodeCount} code(s).`,
  '',
  '**Sources**',
  ...sourceLines,
  '',
];

if (!readAnySource) {
  lines.push(
    '**Inconclusive run — no source could be read.**',
    '',
    'This says nothing about whether the catalogue is current.'
  );
} else if (candidates.length === 0) {
  lines.push('No unknown codes found.');
} else {
  lines.push(
    `**${candidates.length} candidate code(s) not in the catalogue**`,
    '',
    'These are unverified. Redeem attempts are one-shot per account, so confirm each',
    'against Bungie before adding it to `src/services/codeScraperService.ts`, then run',
    '`npm run scrape:emblems && npm run verify:catalogue`.',
    ''
  );

  for (const candidate of candidates) {
    lines.push(`- \`${candidate.code}\`${candidate.emblemName ? ` — ${candidate.emblemName}` : ''}`);
    for (const source of candidate.sources ?? []) {
      lines.push(`  - ${source.id}: ${source.url}`);
    }
  }
}

if (report.notListedUpstream?.length) {
  lines.push(
    '',
    `${report.notListedUpstream.length} catalogue code(s) are absent from the upstream`,
    'availability list. That is expected for expired codes and is not proof of expiry.'
  );
}

const body = `${lines.join('\n')}\n`;

fs.writeFileSync('candidates.md', body);

if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, body);
}

if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `has_candidates=${candidates.length > 0}\n`);
}

console.log(body);
