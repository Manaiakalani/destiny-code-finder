import { ExternalLink } from 'lucide-react';
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
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground">
            Your privacy is protected. We don't collect, store, or share any personal information.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: November 17, 2026
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* No Data Collection */}
          <section className="border-b border-border py-6">
            <h2 className="mb-3">No Personal Data Collection</h2>
            <p className="text-muted-foreground leading-relaxed">
              Code Vault does not collect, store, or transmit any personal information. We don't require accounts, 
              emails, passwords, or any form of registration. You can use this service completely anonymously.
            </p>
          </section>

          {/* Local Storage */}
          <section className="border-b border-border py-6">
            <h2 className="mb-3">Local Storage</h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                We use your browser's localStorage to temporarily cache emblem code data. This improves performance 
                and reduces load on external data sources. The cached data includes:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Emblem codes and their metadata (name, status, expiry date)</li>
                <li>Timestamp of last data refresh</li>
              </ul>
              <dl className="space-y-2 border-t border-border pt-4 text-sm">
                <div>
                  <dt className="inline font-medium text-foreground">Storage Key: </dt>
                  <dd className="inline text-foreground">destiny2-codes-cache-v2</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-foreground">Cache Duration: </dt>
                  <dd className="inline">30 minutes</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-foreground">Saved Codes Key: </dt>
                  <dd className="inline text-foreground">destiny2-manual-codes. Codes you add yourself, kept separately so they never expire with the cache</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-foreground">Data Location: </dt>
                  <dd className="inline">Your browser only (never sent to our servers)</dd>
                </div>
              </dl>
              <p className="leading-relaxed pt-2">
                You can clear this cache at any time by clearing your browser's localStorage. Codes you add yourself
                are kept across a refresh and persist until you clear localStorage.
              </p>
            </div>
          </section>

          {/* No Cookies */}
          <section className="border-b border-border py-6">
            <h2 className="mb-3">No Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Code Vault does not use cookies of any kind. We don't create user profiles, follow you across other
              sites, or sell data. See the analytics section below for the one aggregate measurement we do collect.
            </p>
          </section>

          {/* Third-Party Data Sources */}
          <section className="border-b border-border py-6">
            <h2 className="mb-3">Third-Party Data Sources</h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                Emblem codes are curated from publicly available community sources and verified manually.
                Your browser contacts these third parties:
              </p>
              <ul className="space-y-4">
                <li className="border-b border-border pb-4">
                  <div className="mb-1 flex items-baseline justify-between gap-3">
                    <span className="font-medium text-foreground">Bungie CDN</span>
                    <a
                      href="https://www.bungie.net"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline underline-offset-4"
                    >
                      bungie.net
                    </a>
                  </div>
                  <p className="text-sm">Official Destiny 2 emblem images served directly from Bungie's content delivery network.</p>
                </li>
                <li className="border-b border-border pb-4">
                  <div className="mb-1 flex items-baseline justify-between gap-3">
                    <span className="font-medium text-foreground">Destiny Emblem Collector CDN</span>
                    <span className="text-sm">destinyemblemcollector.b-cdn.net</span>
                  </div>
                  <p className="text-sm">Destiny 1 emblem artwork, which Bungie's own CDN no longer serves.</p>
                </li>
                <li className="border-b border-border pb-4">
                  <div className="mb-1 flex items-baseline justify-between gap-3">
                    <span className="font-medium text-foreground">Analytics</span>
                    <span className="text-sm">analytics.manaiakalani.info</span>
                  </div>
                  <p className="text-sm">Cookieless, aggregate page-view counts. Details in the analytics section below.</p>
                </li>
                <li className="border-b border-border pb-4">
                  <div className="mb-1 flex items-baseline justify-between gap-3">
                    <span className="font-medium text-foreground">Google Fonts</span>
                    <span className="text-sm">fonts.googleapis.com</span>
                  </div>
                  <p className="text-sm">The Orbitron and Rajdhani typefaces used across the site.</p>
                </li>
              </ul>
              <p className="leading-relaxed pt-2">
                The code catalogue itself is bundled with the app. No code data is fetched from an external API.
              </p>
            </div>
          </section>

          {/* Privacy-Focused Analytics */}
          <section className="border-b border-border py-6">
            <h2 className="mb-3">Privacy-Focused Analytics</h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                We use a minimal, privacy-focused analytics solution to understand general usage patterns
                (page views, visit counts). This helps us improve the service.
              </p>
              <div className="space-y-2 text-sm">
                <p><strong className="text-foreground">What we collect:</strong> Page views, approximate visitor counts</p>
                <p><strong className="text-foreground">What we don't collect:</strong> Personal data, IP addresses, device fingerprints, or tracking cookies</p>
              </div>
              <p className="leading-relaxed">
                We don't use Google Analytics, Facebook Pixel, or any invasive tracking services.
                No personal data is ever shared with third parties.
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section className="border-b border-border py-6">
            <h2 className="mb-3">Data Security</h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                Since we don't collect any personal data, there's no sensitive information to protect. The only data 
                stored is:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Publicly available emblem codes (already public information)</li>
                <li>Cached in your browser's localStorage (you control this data)</li>
              </ul>
              <p className="leading-relaxed pt-2">
                The website is served over HTTPS to ensure secure communication between your browser and our servers.
              </p>
            </div>
          </section>

          {/* Changes to Privacy Policy */}
          <section className="border-b border-border py-6">
            <h2 className="mb-3">Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              If we ever make changes to this privacy policy, we will update the "Last updated" date at the top of this page. 
              Since we don't collect contact information, we cannot notify you directly of changes.
            </p>
          </section>

          {/* Contact */}
          <section className="border-b border-border py-6">
            <h2 className="mb-3">Questions or Concerns?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about this privacy policy or how Code Vault handles data, feel free to reach out 
              via GitHub or Twitter:
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/Manaiakalani/destiny-code-finder"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 text-sm underline underline-offset-4"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                GitHub
              </a>
              <a
                href="https://twitter.com/manaiakalani"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 text-sm underline underline-offset-4"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Twitter
              </a>
            </div>
          </section>

          {/* Guardian Quote */}
          <p className="py-8 text-sm text-muted-foreground">
            "Your Light is yours alone. So is your privacy." (The Speaker)
          </p>
        </div>
      </div>
    </div>
  );
}
