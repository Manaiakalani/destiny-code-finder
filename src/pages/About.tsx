import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="mx-auto w-full max-w-3xl px-4 py-3">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            Back to Code Vault
          </Link>
        </div>
      </div>
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="mb-10">
          <h1 className="mb-3">
            About Code Vault
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Your automated guardian for tracking and discovering Destiny 2 emblem redemption codes across the web
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* What We Do */}
          <section className="border-b border-border py-6">
            <h2 className="mb-3">What We Do</h2>
            <p className="text-muted-foreground leading-relaxed">
              Code Vault is a hand-curated catalogue of Destiny 2 emblem redemption codes. Every code is verified against
              official Bungie announcements, community databases, and partner programs before it ships, so what you see
              here is checked rather than guessed.
            </p>
          </section>

          {/* How It Works */}
          <section className="border-b border-border py-6">
            <h2 className="mb-3">How It Works</h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                The catalogue is compiled and verified before each release, drawing on these sources:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className="text-foreground">Destiny Emblem Collector:</strong> The community's reference list of universal emblem codes and their availability
                </li>
                <li>
                  <strong className="text-foreground">Reddit &amp; community sources:</strong> r/DestinyTheGame, r/destiny2, and r/raidsecrets are reviewed for newly shared codes
                </li>
                <li>
                  <strong className="text-foreground">Bungie API:</strong> Official emblem images and metadata from Bungie's manifest
                </li>
                <li>
                  <strong className="text-foreground">Curated catalogue:</strong> 79 codes, each labelled active, expired, restricted, or Destiny 1
                </li>
              </ul>
              <p className="leading-relaxed pt-2">
                The catalogue ships with the site and is cached in your browser for 30 minutes for fast loading. Refresh
                at any time to reload it. Because codes are verified by hand rather than scraped live, always confirm a
                code at Bungie's redemption page before relying on it.
              </p>
            </div>
          </section>

          {/* Data Sources */}
          <section className="border-b border-border py-6">
            <h2 className="mb-3">Data Sources</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <a
                href="https://www.bungie.net"
                target="_blank"
                rel="noopener noreferrer"
                className="block border-b border-border py-3 hover:text-foreground"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Bungie API</span>
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </div>
                <p className="text-sm text-muted-foreground">Official emblem data & images</p>
              </a>
              <a
                href="https://www.blueberries.gg/items/destiny-2-free-emblems/"
                target="_blank"
                rel="noopener noreferrer"
                className="block border-b border-border py-3 hover:text-foreground"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Blueberries.gg</span>
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </div>
                <p className="text-sm text-muted-foreground">Comprehensive emblem guide</p>
              </a>
              <a
                href="https://www.reddit.com/r/DestinyTheGame"
                target="_blank"
                rel="noopener noreferrer"
                className="block border-b border-border py-3 hover:text-foreground"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">r/DestinyTheGame</span>
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </div>
                <p className="text-sm text-muted-foreground">Main Destiny community</p>
              </a>
              <a
                href="https://www.reddit.com/r/raidsecrets"
                target="_blank"
                rel="noopener noreferrer"
                className="block border-b border-border py-3 hover:text-foreground"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">r/raidsecrets</span>
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </div>
                <p className="text-sm text-muted-foreground">Destiny secrets & discoveries</p>
              </a>
            </div>
          </section>

          {/* Update Frequency */}
          <section className="border-b border-border py-6">
            <h2 className="mb-3">Update Frequency</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The catalogue ships with the site, so it updates when a new version is released rather than on a timer.
              Your browser keeps a local copy for 30 minutes purely to make repeat visits load instantly; the refresh
              button reloads it at any time.
            </p>
            <p className="text-sm text-muted-foreground">
              "The Light provides... but patience is a virtue." (Commander Zavala)
            </p>
          </section>

          {/* Open Source */}
          <section className="border-b border-border py-6">
            <h2 className="mb-3">Open Source</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Code Vault is open source and built by Guardians, for Guardians. The entire codebase is available on GitHub 
              for transparency, contributions, and community improvements.
            </p>
            <Button
              onClick={() => window.open('https://github.com/Manaiakalani/destiny-code-finder', '_blank')}
              variant="solar"
              className="min-h-11"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              View on GitHub
            </Button>
          </section>

          {/* Footer Quote */}
          <p className="py-8 text-sm text-muted-foreground">
            "Eyes up, Guardian. There are always more emblems to collect."
          </p>
        </div>
      </div>
    </div>
  );
}
