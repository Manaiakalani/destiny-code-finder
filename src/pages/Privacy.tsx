import { Shield, Database, Cookie, ExternalLink, Lock, Eye, ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background pt-0">
      {/* Back Button - Fixed at top */}
      <div className="sticky top-0 z-50 glass-card backdrop-blur-xl border-b border-border/40">
        <div className="container mx-auto px-4 py-3">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-accent hover:text-solar transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-heading tracking-wider">Back to Code Vault</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-accent via-stasis to-arc bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your privacy is protected. We don't collect, store, or share any personal information.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* No Data Collection */}
          <section className="glass-card p-6 rounded-lg border-2 border-strand/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-strand/10">
                <Shield className="w-6 h-6 text-strand" />
              </div>
              <h2 className="font-heading text-2xl font-bold">No Personal Data Collection</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Code Vault does not collect, store, or transmit any personal information. We don't require accounts, 
              emails, passwords, or any form of registration. You can use this service completely anonymously.
            </p>
          </section>

          {/* Local Storage */}
          <section className="glass-card p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-accent/10">
                <Database className="w-6 h-6 text-accent" />
              </div>
              <h2 className="font-heading text-2xl font-bold">Local Storage</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                We use your browser's localStorage to temporarily cache emblem code data. This improves performance 
                and reduces load on external data sources. The cached data includes:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-strand mt-1">◆</span>
                  <span>Emblem codes and their metadata (name, status, expiry date)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-strand mt-1">◆</span>
                  <span>Timestamp of last data refresh</span>
                </li>
              </ul>
              <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg mt-4">
                <p className="text-sm">
                  <strong className="text-foreground">Storage Key:</strong> <code className="text-accent">destiny2-codes-cache</code>
                </p>
                <p className="text-sm mt-2">
                  <strong className="text-foreground">Cache Duration:</strong> 30 minutes
                </p>
                <p className="text-sm mt-2">
                  <strong className="text-foreground">Data Location:</strong> Your browser only (never sent to our servers)
                </p>
              </div>
              <p className="leading-relaxed pt-2">
                You can clear this cache at any time by clearing your browser's localStorage or refreshing the code database.
              </p>
            </div>
          </section>

          {/* No Cookies */}
          <section className="glass-card p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-solar/10">
                <Cookie className="w-6 h-6 text-solar" />
              </div>
              <h2 className="font-heading text-2xl font-bold">No Cookies</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Code Vault does not use cookies of any kind. We don't track your browsing behavior, create user profiles, 
              or use analytics services. Your usage of this site is completely private.
            </p>
          </section>

          {/* Third-Party Data Sources */}
          <section className="glass-card p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-stasis/10">
                <ExternalLink className="w-6 h-6 text-stasis" />
              </div>
              <h2 className="font-heading text-2xl font-bold">Third-Party Data Sources</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                To provide you with the latest emblem codes, we fetch data from these external sources:
              </p>
              <div className="grid gap-3">
                <div className="p-4 border border-border/40 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">Reddit API</span>
                    <a
                      href="https://www.reddit.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent/80 text-sm"
                    >
                      reddit.com
                    </a>
                  </div>
                  <p className="text-sm">Public JSON API for community posts. No authentication required.</p>
                </div>
                <div className="p-4 border border-border/40 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">Bungie API</span>
                    <a
                      href="https://www.bungie.net"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent/80 text-sm"
                    >
                      bungie.net
                    </a>
                  </div>
                  <p className="text-sm">Official Destiny 2 manifest for emblem images and metadata.</p>
                </div>
                <div className="p-4 border border-border/40 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">Blueberries.gg</span>
                    <a
                      href="https://www.blueberries.gg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent/80 text-sm"
                    >
                      blueberries.gg
                    </a>
                  </div>
                  <p className="text-sm">Destiny 2 game guide and resource database. Accessed via CORS proxy.</p>
                </div>
              </div>
              <p className="leading-relaxed pt-2">
                These third-party services may have their own privacy policies. We recommend reviewing them if you have concerns 
                about how they handle data.
              </p>
            </div>
          </section>

          {/* No Analytics */}
          <section className="glass-card p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-accent/10">
                <Eye className="w-6 h-6 text-accent" />
              </div>
              <h2 className="font-heading text-2xl font-bold">No Analytics or Tracking</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              We don't use Google Analytics, Facebook Pixel, or any other tracking or analytics services. 
              Your usage patterns, clicks, and browsing behavior are never monitored or recorded.
            </p>
          </section>

          {/* Data Security */}
          <section className="glass-card p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-solar/10">
                <Lock className="w-6 h-6 text-solar" />
              </div>
              <h2 className="font-heading text-2xl font-bold">Data Security</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                Since we don't collect any personal data, there's no sensitive information to protect. The only data 
                stored is:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-strand mt-1">◆</span>
                  <span>Publicly available emblem codes (already public information)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-strand mt-1">◆</span>
                  <span>Cached in your browser's localStorage (you control this data)</span>
                </li>
              </ul>
              <p className="leading-relaxed pt-2">
                The website is served over HTTPS to ensure secure communication between your browser and our servers.
              </p>
            </div>
          </section>

          {/* Changes to Privacy Policy */}
          <section className="glass-card p-6 rounded-lg">
            <h2 className="font-heading text-xl mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              If we ever make changes to this privacy policy, we will update the "Last updated" date at the top of this page. 
              Since we don't collect contact information, we cannot notify you directly of changes.
            </p>
          </section>

          {/* Contact */}
          <section className="glass-card p-6 rounded-lg border-2 border-accent/20">
            <h2 className="font-heading text-xl mb-4">Questions or Concerns?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about this privacy policy or how Code Vault handles data, feel free to reach out 
              via GitHub or Twitter:
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/Manaiakalani/destiny-code-finder"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg border border-accent/40 hover:bg-accent/10 transition-colors text-sm flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                GitHub
              </a>
              <a
                href="https://twitter.com/manaiakalani"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg border border-accent/40 hover:bg-accent/10 transition-colors text-sm flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Twitter
              </a>
            </div>
          </section>

          {/* Guardian Quote */}
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground italic">
              "Your Light is yours alone. So is your privacy." — The Speaker
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
