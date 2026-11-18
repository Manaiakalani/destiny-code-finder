import { ExternalLink, Zap, Database, RefreshCw, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { useCodeScanner } from '@/hooks/useCodeScanner';

const SOURCES = [
  {
    name: 'Bungie API',
    detail: 'Official emblem data & images',
    href: 'https://www.bungie.net',
  },
  {
    name: 'Blueberries.gg',
    detail: 'Comprehensive emblem guide',
    href: 'https://www.blueberries.gg/items/destiny-2-free-emblems/',
  },
  {
    name: 'r/DestinyTheGame',
    detail: 'Main Destiny community',
    href: 'https://www.reddit.com/r/DestinyTheGame',
  },
  {
    name: 'r/raidsecrets',
    detail: 'Destiny secrets & discoveries',
    href: 'https://www.reddit.com/r/raidsecrets',
  },
];

export default function About() {
  const { codes, addManualCode } = useCodeScanner();
  const activeCount = codes.filter((code) => code.status === 'active').length;

  return (
    <div className="min-h-screen">
      <Header onAddCode={addManualCode} activeCount={activeCount} totalCount={codes.length} />

      <main className="container mx-auto max-w-3xl px-4 py-14">
        <h1 className="font-heading text-4xl font-bold text-balance text-foreground title-shadow md:text-5xl">
          About Code Vault
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          A hand-checked catalogue of Destiny 2 emblem redemption codes.
        </p>

        <div className="mt-12 space-y-10">
          <section className="border-t border-border/40 pt-8">
            <h2 className="mb-3 flex items-center gap-3 font-heading text-xl font-bold md:text-2xl">
              <Shield className="h-5 w-5 text-accent" aria-hidden="true" />
              What We Do
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Code Vault is a hand-curated catalogue of Destiny 2 emblem redemption codes. Every code is verified against
              official Bungie announcements, community databases, and partner programs before it ships, so what you see
              here is checked rather than guessed.
            </p>
          </section>

          <section className="border-t border-border/40 pt-8">
            <h2 className="mb-3 flex items-center gap-3 font-heading text-xl font-bold md:text-2xl">
              <Zap className="h-5 w-5 text-solar" aria-hidden="true" />
              How It Works
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                The catalogue is compiled and verified before each release, drawing on these sources:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-strand" aria-hidden="true" />
                  <span><strong className="text-foreground">Destiny Emblem Collector:</strong> The community&apos;s reference list of universal emblem codes and their availability</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-strand" aria-hidden="true" />
                  <span><strong className="text-foreground">Reddit &amp; community sources:</strong> r/DestinyTheGame, r/destiny2, and r/raidsecrets are reviewed for newly shared codes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-strand" aria-hidden="true" />
                  <span><strong className="text-foreground">Bungie API:</strong> Official emblem images and metadata from Bungie&apos;s manifest</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-strand" aria-hidden="true" />
                  <span><strong className="text-foreground">Curated catalogue:</strong> 79 codes, each labelled active, expired, restricted, or Destiny 1</span>
                </li>
              </ul>
              <p className="leading-relaxed">
                The catalogue ships with the site and is cached in your browser for 30 minutes for fast loading. Refresh
                at any time to reload it. Because codes are verified by hand rather than scraped live, always confirm a
                code at Bungie&apos;s redemption page before relying on it.
              </p>
            </div>
          </section>

          <section className="border-t border-border/40 pt-8">
            <h2 className="mb-3 flex items-center gap-3 font-heading text-xl font-bold md:text-2xl">
              <Database className="h-5 w-5 text-strand" aria-hidden="true" />
              Data Sources
            </h2>
            <ul className="divide-y divide-border/40 border-y border-border/40">
              {SOURCES.map((source) => (
                <li key={source.href}>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 py-3"
                  >
                    <span>
                      <span className="block font-medium text-foreground">{source.name}</span>
                      <span className="text-sm text-muted-foreground">{source.detail}</span>
                    </span>
                    <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-accent" />
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="border-t border-border/40 pt-8">
            <h2 className="mb-3 flex items-center gap-3 font-heading text-xl font-bold md:text-2xl">
              <RefreshCw className="h-5 w-5 text-solar" aria-hidden="true" />
              Update Frequency
            </h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              The catalogue ships with the site, so it updates when a new version is released rather than on a timer.
              Your browser keeps a local copy for 30 minutes purely to make repeat visits load instantly; the refresh
              button reloads it at any time.
            </p>
            <p className="text-sm italic text-muted-foreground">
              &quot;The Light provides... but patience is a virtue.&quot; — Commander Zavala
            </p>
          </section>

          <section className="border-t border-border/40 pt-8">
            <h2 className="mb-3 font-heading text-xl font-bold">Open Source</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              Code Vault is open source and built by Guardians, for Guardians. The entire codebase is available on GitHub
              for transparency, contributions, and community improvements.
            </p>
            <Button
              onClick={() => window.open('https://github.com/Manaiakalani/destiny-code-finder', '_blank', 'noopener,noreferrer')}
              variant="solar"
              className="h-11 font-heading"
            >
              <ExternalLink className="h-4 w-4" />
              View on GitHub
            </Button>
          </section>

          <p className="border-t border-border/40 pt-8 text-center text-sm italic text-muted-foreground">
            &quot;Eyes up, Guardian. There are always more emblems to collect.&quot;
          </p>
        </div>
      </main>
    </div>
  );
}
