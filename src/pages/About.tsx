import { ArrowLeft, Database, ExternalLink, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const SOURCES = [
  {
    name: 'Bungie',
    description: 'Official reward metadata and redemption destination.',
    href: 'https://www.bungie.net/7/en/Codes/Redeem',
  },
  {
    name: 'Destiny Emblem Collector',
    description: 'Universal-code and emblem cross-reference.',
    href: 'https://destinyemblemcollector.com/availability/universalcode',
  },
  {
    name: 'Blueberries.gg',
    description: 'Community-maintained reward and code reference.',
    href: 'https://www.blueberries.gg/items/destiny-2-free-emblems/',
  },
  {
    name: "Mijago's Destiny 2 Rewards",
    description: 'Independent reward catalogue used for cross-checking.',
    href: 'https://rewards.mijago.net',
  },
];

export default function About() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto max-w-4xl px-4">
          <Link
            to="/"
            className="inline-flex min-h-16 items-center gap-2 text-sm font-medium text-accent hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Code Vault
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-10">
        <div className="max-w-2xl">
          <h1 className="font-heading text-3xl font-bold tracking-[0.04em] text-foreground sm:text-4xl">
            How the catalogue is checked
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            Code Vault is a curated community reference, not a live Bungie verification service.
            The catalogue was reviewed on July 14, 2026 against official metadata and independent
            community sources.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <section className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">Availability language</h2>
                <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="font-semibold text-strand">Redeemable</dt>
                    <dd className="mt-1 text-muted-foreground">
                      A universal-format code confirmed by the reviewed catalogue. Bungie makes the final decision.
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-solar">Destiny 1</dt>
                    <dd className="mt-1 text-muted-foreground">
                      A legacy Destiny 1 reward code retained for players who still use that catalogue.
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">Restricted</dt>
                    <dd className="mt-1 text-muted-foreground">
                      A reward tied to an individual promotion, vendor, creator, purchase, or manual grant.
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-start gap-3">
              <Database className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <div className="w-full">
                <h2 className="text-lg font-semibold text-foreground">Cross-reference sources</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Entries are compared across multiple public references before they are added to the bundled catalogue.
                  Code Vault does not scrape these sites from your browser.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {SOURCES.map(source => (
                    <a
                      key={source.name}
                      href={source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-border p-4 transition-colors hover:border-accent/60"
                    >
                      <span className="flex items-center justify-between gap-3 font-semibold text-foreground">
                        {source.name}
                        <ExternalLink className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">{source.description}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground">Know before redeeming</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>Format validation does not prove that Bungie will accept a code.</li>
              <li>A Redeemable label is not a guarantee; Bungie can change availability.</li>
              <li>Locally pinned codes are marked unverified until they match a reviewed catalogue entry.</li>
              <li>Final availability and account eligibility are always determined on Bungie.net.</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
