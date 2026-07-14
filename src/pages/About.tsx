import { ExternalLink, Zap, Database, RefreshCw, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-accent via-solar to-strand bg-clip-text text-transparent">
            About Code Vault
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your automated guardian for tracking and discovering Destiny 2 emblem redemption codes across the web
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* What We Do */}
          <section className="glass-card p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-accent/10">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h2 className="font-heading text-2xl font-bold">What We Do</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Code Vault automatically scans multiple sources across the web to find and track Destiny 2 emblem redemption codes. 
              We aggregate codes from official Bungie announcements, community sources, and partner programs to provide you with 
              the most comprehensive and up-to-date collection of active codes.
            </p>
          </section>

          {/* How It Works */}
          <section className="glass-card p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-solar/10">
                <Zap className="w-6 h-6 text-solar" />
              </div>
              <h2 className="font-heading text-2xl font-bold">How It Works</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                Our automated scraping system continuously monitors multiple data sources to keep the code database fresh:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-strand mt-1">◆</span>
                  <span><strong className="text-foreground">Reddit Communities:</strong> We scan r/DestinyTheGame, r/destiny2, and r/raidsecrets for newly shared codes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-strand mt-1">◆</span>
                  <span><strong className="text-foreground">Blueberries.gg:</strong> Comprehensive Destiny 2 resource database with community-verified codes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-strand mt-1">◆</span>
                  <span><strong className="text-foreground">Bungie API:</strong> Official emblem images and metadata from Bungie's manifest</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-strand mt-1">◆</span>
                  <span><strong className="text-foreground">Known Active Codes:</strong> Curated database of 20+ verified working codes</span>
                </li>
              </ul>
              <p className="leading-relaxed pt-2">
                All discovered codes are cached locally for 30 minutes to reduce server load and provide fast access. 
                You can manually refresh at any time to get the latest updates.
              </p>
            </div>
          </section>

          {/* Data Sources */}
          <section className="glass-card p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-strand/10">
                <Database className="w-6 h-6 text-strand" />
              </div>
              <h2 className="font-heading text-2xl font-bold">Data Sources</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <a
                href="https://www.bungie.net"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg border border-border/40 hover:border-accent/40 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Bungie API</span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground">Official emblem data & images</p>
              </a>
              <a
                href="https://www.blueberries.gg/items/destiny-2-free-emblems/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg border border-border/40 hover:border-accent/40 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Blueberries.gg</span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground">Comprehensive emblem guide</p>
              </a>
              <a
                href="https://www.reddit.com/r/DestinyTheGame"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg border border-border/40 hover:border-accent/40 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">r/DestinyTheGame</span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground">Main Destiny community</p>
              </a>
              <a
                href="https://www.reddit.com/r/raidsecrets"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg border border-border/40 hover:border-accent/40 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">r/raidsecrets</span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground">Destiny secrets & discoveries</p>
              </a>
            </div>
          </section>

          {/* Update Frequency */}
          <section className="glass-card p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-solar/10">
                <RefreshCw className="w-6 h-6 text-solar" />
              </div>
              <h2 className="font-heading text-2xl font-bold">Update Frequency</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The code database is automatically refreshed whenever you visit the site or manually click the refresh button. 
              To reduce load on source servers and provide faster performance, we cache results locally for 30 minutes.
            </p>
            <p className="text-sm text-muted-foreground italic">
              "The Light provides... but patience is a virtue." — Commander Zavala
            </p>
          </section>

          {/* Open Source */}
          <section className="glass-card p-6 rounded-lg border-2 border-accent/20">
            <h2 className="font-heading text-xl mb-4">Open Source</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Code Vault is open source and built by Guardians, for Guardians. The entire codebase is available on GitHub 
              for transparency, contributions, and community improvements.
            </p>
            <Button
              onClick={() => window.open('https://github.com/Manaiakalani/destiny-code-finder', '_blank')}
              className="btn-solar text-white font-heading"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on GitHub
            </Button>
          </section>

          {/* Footer Quote */}
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground italic">
              "Eyes up, Guardian. There are always more emblems to collect."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
