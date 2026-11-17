import { Shield, Database, Cookie, ExternalLink, Lock, Eye } from 'lucide-react';
import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { useCodeScanner } from '@/hooks/useCodeScanner';

export default function Privacy() {
  const { codes, addManualCode } = useCodeScanner();
  const activeCount = codes.filter((code) => code.status === 'active').length;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Header onAddCode={addManualCode} activeCount={activeCount} totalCount={codes.length} />

      <main className="container mx-auto max-w-3xl px-4 py-14">
        <h1 className="font-heading text-4xl font-bold text-balance text-foreground title-shadow md:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Your privacy is protected. We don&apos;t collect, store, or share any personal information.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: November 17, 2026
        </p>

        <div className="mt-12 space-y-10">
          {/* No Data Collection */}
          <section className="border-t border-border/40 pt-8">
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
          <section className="border-t border-border/40 pt-8">
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
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-strand" aria-hidden="true" />
                  <span>Emblem codes and their metadata (name, status, expiry date)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-strand" aria-hidden="true" />
                  <span>Timestamp of last data refresh</span>
                </li>
              </ul>
              <div className="p-4 rounded-lg bg-secondary/60 mt-4">
                <p className="text-sm">
                  <strong className="text-foreground">Storage Key:</strong> <code className="text-accent">destiny2-codes-cache-v2</code>
                </p>
                <p className="text-sm mt-2">
                  <strong className="text-foreground">Cache Duration:</strong> 30 minutes
                </p>
                <p className="text-sm mt-2">
                  <strong className="text-foreground">Saved Codes Key:</strong> <code className="text-accent">destiny2-manual-codes</code> — codes you add yourself, kept separately so they never expire with the cache
                </p>
                <p className="text-sm mt-2">
                  <strong className="text-foreground">Data Location:</strong> Your browser only (never sent to our servers)
                </p>
              </div>
              <p className="leading-relaxed pt-2">
                You can clear this cache at any time by clearing your browser's localStorage. Codes you add yourself
                are kept across a refresh and persist until you clear localStorage.
              </p>
            </div>
          </section>

          {/* No Cookies */}
          <section className="border-t border-border/40 pt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-solar/10">
                <Cookie className="w-6 h-6 text-solar" />
              </div>
              <h2 className="font-heading text-2xl font-bold">No Cookies</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Code Vault does not use cookies of any kind. We don't create user profiles, follow you across other
              sites, or sell data. See the analytics section below for the one aggregate measurement we do collect.
            </p>
          </section>

          {/* Third-Party Data Sources */}
          <section className="border-t border-border/40 pt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-stasis/10">
                <ExternalLink className="w-6 h-6 text-stasis" />
              </div>
              <h2 className="font-heading text-2xl font-bold">Third-Party Data Sources</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                Emblem codes are curated from publicly available community sources and verified manually.
                Your browser contacts these third parties:
              </p>
              <div className="border-b border-border/40">
                <div className="border-t border-border/40 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">Bungie CDN</span>
                    <a
                      href="https://www.bungie.net"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent/80 text-sm"
                    >
                      bungie.net
                    </a>
                  </div>
                  <p className="text-sm">Official Destiny 2 emblem images served directly from Bungie's content delivery network.</p>
                </div>
                <div className="border-t border-border/40 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">Destiny Emblem Collector CDN</span>
                    <span className="text-muted-foreground text-sm">destinyemblemcollector.b-cdn.net</span>
                  </div>
                  <p className="text-sm">Destiny 1 emblem artwork, which Bungie's own CDN no longer serves.</p>
                </div>
                <div className="border-t border-border/40 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">Analytics</span>
                    <span className="text-muted-foreground text-sm">analytics.invalid</span>
                  </div>
                  <p className="text-sm">Cookieless, aggregate page-view counts. Details in the analytics section below.</p>
                </div>
                <div className="border-t border-border/40 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">Google Fonts</span>
                    <span className="text-muted-foreground text-sm">fonts.googleapis.com</span>
                  </div>
                  <p className="text-sm">The Orbitron and Rajdhani typefaces used across the site.</p>
                </div>
              </div>
              <p className="leading-relaxed pt-2">
                The code catalogue itself is bundled with the app — no code data is fetched from an external API.
              </p>
            </div>
          </section>

          {/* Privacy-Focused Analytics */}
          <section className="border-t border-border/40 pt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-accent/10">
                <Eye className="w-6 h-6 text-accent" />
              </div>
              <h2 className="font-heading text-2xl font-bold">Privacy-Focused Analytics</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                We use a minimal, privacy-focused analytics solution to understand general usage patterns
                (page views, visit counts). This helps us improve the service.
              </p>
              <div className="p-4 rounded-lg bg-secondary/60">
                <p className="text-sm"><strong className="text-foreground">What we collect:</strong> Page views, approximate visitor counts</p>
                <p className="text-sm mt-2"><strong className="text-foreground">What we don't collect:</strong> Personal data, IP addresses, device fingerprints, or tracking cookies</p>
              </div>
              <p className="leading-relaxed">
                We don't use Google Analytics, Facebook Pixel, or any invasive tracking services.
                No personal data is ever shared with third parties.
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section className="border-t border-border/40 pt-8">
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
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-strand" aria-hidden="true" />
                  <span>Publicly available emblem codes (already public information)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-strand" aria-hidden="true" />
                  <span>Cached in your browser's localStorage (you control this data)</span>
                </li>
              </ul>
              <p className="leading-relaxed pt-2">
                The website is served over HTTPS to ensure secure communication between your browser and our servers.
              </p>
            </div>
          </section>

          {/* Changes to Privacy Policy */}
          <section className="border-t border-border/40 pt-8">
            <h2 className="font-heading text-xl mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              If we ever make changes to this privacy policy, we will update the "Last updated" date at the top of this page. 
              Since we don't collect contact information, we cannot notify you directly of changes.
            </p>
          </section>

          {/* Contact */}
          <section className="border-t border-border/40 pt-8">
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
      </main>
    </div>
  );
}
