#!/usr/bin/env node
/**
 * Triaged production dependency audit.
 *
 * `npm audit` is all-or-nothing: one advisory that cannot affect this app leaves the
 * check permanently red, and a permanently red check is one nobody reads. That is the
 * failure mode this script exists to prevent — not to silence findings.
 *
 * Behaviour:
 *   - Any advisory NOT in ACCEPTED fails the run, so genuinely new vulnerabilities
 *     still break the build.
 *   - An ACCEPTED entry that no longer appears also fails the run, so the allowlist
 *     cannot quietly rot into a list of stale excuses.
 *   - Each acceptance carries a written, checkable reason and a review date.
 *
 * Dev-only dependencies are excluded (`--omit=dev`): they never reach a user's browser
 * because the deployed artifact is a static bundle.
 */

import { execSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

/**
 * Advisories consciously accepted, with the reason they cannot affect this app.
 * `verify` is a human-checkable assertion, not a vibe — if it stops being true, the
 * entry must be removed and the dependency upgraded.
 */
const ACCEPTED = [];

function runAudit() {
  // A constant command string: there is no interpolated input anywhere here, so there
  // is no injection surface. Note this deliberately avoids execFileSync with an args
  // array — on Windows npm is a .cmd shim, which Node refuses to spawn without a shell
  // (EINVAL), and passing an args array *with* a shell trips DEP0190.
  //
  // The npm_config_* variables are stripped because npm exports its own resolved config
  // into the environment of the scripts it runs. A nested `npm audit` then inherits
  // settings it rejects (EALLOWSCRIPTS), which made this check pass standalone but fail
  // under `npm run`. Stripping them makes the result independent of how it was invoked.
  const env = Object.fromEntries(
    Object.entries(process.env).filter(([key]) => !key.toLowerCase().startsWith('npm_config_')),
  );
  try {
    return execSync('npm audit --omit=dev --json', {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
      env,
    });
  } catch (error) {
    // npm audit exits non-zero whenever findings exist; the JSON is still on stdout.
    if (error.stdout) return error.stdout;
    throw error;
  }
}

/** Collect the advisory ids npm reported, mapped to a readable summary. */
function collectAdvisories(report) {
  const found = new Map();
  for (const vuln of Object.values(report.vulnerabilities ?? {})) {
    for (const via of vuln.via ?? []) {
      // A string `via` is a transitive pointer to another package, not an advisory.
      if (typeof via !== 'object' || !via.url) continue;
      const id = via.url.split('/').pop();
      found.set(id, {
        id,
        module: via.name ?? vuln.name,
        severity: via.severity ?? vuln.severity,
        title: via.title ?? '(no title)',
        url: via.url,
      });
    }
  }
  return found;
}

/**
 * Decide the outcome for one npm audit report. Pure, so every branch is testable
 * against a synthetic report with no network and no npm.
 *
 * That matters more here than usual: the two real bugs this script has had so far
 * (a crash spawning npm, and parsing npm's own error envelope as "zero
 * vulnerabilities") both lived in branches that could only be reached by hand.
 *
 * Returns `{ ok, fatal, accepted, unexpected, stale }`. `fatal` is set when the
 * report itself is unusable, which must never be mistaken for a clean result.
 */
export function evaluateAudit(report, accepted = ACCEPTED) {
  const byId = new Map(accepted.map((a) => [a.id, a]));

  // npm reports its own failures as a well-formed JSON envelope with an `error` key
  // and no `vulnerabilities`. Reading that as "nothing found" would turn a broken
  // audit into a green check — the worst possible outcome for a security gate.
  if (report?.error) {
    return {
      ok: false,
      fatal: `npm audit did not run. ${report.error.code ?? 'unknown'}: ${report.error.summary ?? ''}`.trim(),
      accepted: [],
      unexpected: [],
      stale: [],
    };
  }
  if (typeof report?.vulnerabilities !== 'object' || report.vulnerabilities === null) {
    return {
      ok: false,
      fatal:
        'npm audit returned no `vulnerabilities` field; the output format may have changed. ' +
        `Received keys: ${Object.keys(report ?? {}).join(', ') || '(none)'}`,
      accepted: [],
      unexpected: [],
      stale: [],
    };
  }

  const found = collectAdvisories(report);
  const unexpected = [...found.values()].filter((a) => !byId.has(a.id));
  const stale = accepted.filter((a) => !found.has(a.id));
  const matched = [...found.values()]
    .filter((a) => byId.has(a.id))
    .map((a) => ({ ...a, acceptance: byId.get(a.id) }));

  return {
    ok: unexpected.length === 0 && stale.length === 0,
    fatal: null,
    accepted: matched,
    unexpected,
    stale,
  };
}

function report_() {
  const result = evaluateAudit(JSON.parse(runAudit()));

  if (result.fatal) {
    console.error(`FAIL: ${result.fatal}`);
    return 1;
  }

  for (const advisory of result.accepted) {
    console.log(`accepted  ${advisory.id}  ${advisory.module} (${advisory.severity})`);
    console.log(`          ${advisory.acceptance.reason}`);
    console.log(`          verify: ${advisory.acceptance.verify}`);
    console.log(`          last reviewed: ${advisory.acceptance.reviewed}`);
  }

  if (result.unexpected.length > 0) {
    console.error(
      `\nFAIL: ${result.unexpected.length} untriaged advisory/advisories in production dependencies:`,
    );
    for (const a of result.unexpected) {
      console.error(`  ${String(a.severity).toUpperCase()}  ${a.module}  ${a.id}  ${a.title}`);
      console.error(`         ${a.url}`);
    }
    console.error('\nFix the dependency, or add a justified entry to ACCEPTED in scripts/audit-triage.mjs.');
  }

  if (result.stale.length > 0) {
    console.error(`\nFAIL: ${result.stale.length} accepted advisory/advisories no longer reported:`);
    for (const a of result.stale) {
      console.error(`  ${a.id} (${a.module}) — resolved or renamed. Remove it from ACCEPTED.`);
    }
  }

  if (!result.ok) return 1;

  console.log(
    `\nOK: ${result.accepted.length} production advisory/advisories, all triaged and documented (0 untriaged).`,
  );
  return 0;
}

// Only run when invoked directly, so the module can be imported by tests.
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  process.exit(report_());
}
