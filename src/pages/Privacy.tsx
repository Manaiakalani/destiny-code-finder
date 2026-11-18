import { Shield, Database, Cookie, ExternalLink, Lock, Eye } from 'lucide-react';
import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { SiteFooter } from '@/components/SiteFooter';
import { Button } from '@/components/ui/button';
import { DocBullet, DocBullets, DocClose, DocHeading, DocProse, DocRows, DocSection, DocSections, DocTitle } from '@/components/DocPage';
import { useCodeScanner } from '@/hooks/useCodeScanner';

const PARTIES = [
  {
    name: 'Bungie CDN',
    detail: "Official Destiny 2 emblem images served directly from Bungie's content delivery network.",
    aside: { label: 'bungie.net', href: 'https://www.bungie.net' },
  },
  {
    name: 'Destiny Emblem Collector CDN',
    detail: "Destiny 1 emblem artwork, which Bungie's own CDN no longer serves.",
    aside: { label: 'destinyemblemcollector.b-cdn.net' },
  },
  {
    name: 'Analytics',
    detail: 'Cookieless, aggregate page-view counts. Details in the analytics section below.',
    aside: { label: 'analytics.invalid' },
  },
  {
    name: 'Google Fonts',
    detail: 'The Orbitron and Rajdhani typefaces used across the site.',
    aside: { label: 'fonts.googleapis.com' },
  },
];

export default function Privacy() {
  const { codes, addManualCode } = useCodeScanner();
  const activeCount = codes.filter((code) => code.status === 'active').length;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Header onAddCode={addManualCode} activeCount={activeCount} totalCount={codes.length} />

      <main className="container mx-auto max-w-3xl px-4 pt-14">
        <DocTitle
          title="Privacy Policy"
          lede="Your privacy is protected. We don't collect, store, or share any personal information."
          meta="Last updated: November 17, 2026"
        />

        <DocSections>
          <DocSection>
            <DocHeading icon={Shield} tone="text-strand">No Personal Data Collection</DocHeading>
            <p className="leading-relaxed text-muted-foreground">
              Code Vault does not collect, store, or transmit any personal information. We don't require accounts,
              emails, passwords, or any form of registration. You can use this service completely anonymously.
            </p>
          </DocSection>

          <DocSection>
            <DocHeading icon={Database} tone="text-accent">Local Storage</DocHeading>
            <DocProse>
              <p className="leading-relaxed">
                We use your browser's localStorage to temporarily cache emblem code data. This improves performance
                and reduces load on external data sources. The cached data includes:
              </p>
              <DocBullets>
                <DocBullet>Emblem codes and their metadata (name, status, expiry date)</DocBullet>
                <DocBullet>Timestamp of last data refresh</DocBullet>
              </DocBullets>
              <DocRows>
                <li className="py-3">
                  <span className="block font-medium text-foreground">Storage Key</span>
                  <code className="text-sm text-accent">destiny2-codes-cache-v2</code>
                </li>
                <li className="py-3">
                  <span className="block font-medium text-foreground">Cache Duration</span>
                  <span className="text-sm text-muted-foreground">30 minutes</span>
                </li>
                <li className="py-3">
                  <span className="block font-medium text-foreground">Saved Codes Key</span>
                  <span className="text-sm text-muted-foreground">
                    <code className="text-accent">destiny2-manual-codes</code>
                    {' '}— codes you add yourself, kept separately so they never expire with the cache
                  </span>
                </li>
                <li className="py-3">
                  <span className="block font-medium text-foreground">Data Location</span>
                  <span className="text-sm text-muted-foreground">Your browser only (never sent to our servers)</span>
                </li>
              </DocRows>
              <p className="leading-relaxed">
                You can clear this cache at any time by clearing your browser's localStorage. Codes you add yourself
                are kept across a refresh and persist until you clear localStorage.
              </p>
            </DocProse>
          </DocSection>

          <DocSection>
            <DocHeading icon={Cookie} tone="text-solar">No Cookies</DocHeading>
            <p className="leading-relaxed text-muted-foreground">
              Code Vault does not use cookies of any kind. We don't create user profiles, follow you across other
              sites, or sell data. See the analytics section below for the one aggregate measurement we do collect.
            </p>
          </DocSection>

          <DocSection>
            <DocHeading icon={ExternalLink} tone="text-stasis">Third-Party Data Sources</DocHeading>
            <DocProse>
              <p className="leading-relaxed">
                Emblem codes are curated from publicly available community sources and verified manually.
                Your browser contacts these third parties:
              </p>
              <DocRows>
                {PARTIES.map((party) => (
                  <li key={party.name} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <span className="min-w-0">
                      <span className="block font-medium text-foreground">{party.name}</span>
                      <span className="text-sm text-muted-foreground">{party.detail}</span>
                    </span>
                    {party.aside.href ? (
                      <a
                        href={party.aside.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-sm text-accent hover:text-accent/80 sm:pt-0.5 sm:text-right"
                      >
                        {party.aside.label}
                      </a>
                    ) : (
                      <span className="shrink-0 text-sm text-muted-foreground sm:pt-0.5 sm:text-right">{party.aside.label}</span>
                    )}
                  </li>
                ))}
              </DocRows>
              <p className="leading-relaxed">
                The code catalogue itself is bundled with the app — no code data is fetched from an external API.
              </p>
            </DocProse>
          </DocSection>

          <DocSection>
            <DocHeading icon={Eye} tone="text-accent">Privacy-Focused Analytics</DocHeading>
            <DocProse>
              <p className="leading-relaxed">
                We use a minimal, privacy-focused analytics solution to understand general usage patterns
                (page views, visit counts). This helps us improve the service.
              </p>
              <DocRows>
                <li className="py-3">
                  <span className="block font-medium text-foreground">What we collect</span>
                  <span className="text-sm text-muted-foreground">Page views, approximate visitor counts</span>
                </li>
                <li className="py-3">
                  <span className="block font-medium text-foreground">What we don&apos;t collect</span>
                  <span className="text-sm text-muted-foreground">Personal data, IP addresses, device fingerprints, or tracking cookies</span>
                </li>
              </DocRows>
              <p className="leading-relaxed">
                We don't use Google Analytics, Facebook Pixel, or any invasive tracking services.
                No personal data is ever shared with third parties.
              </p>
            </DocProse>
          </DocSection>

          <DocSection>
            <DocHeading icon={Lock} tone="text-solar">Data Security</DocHeading>
            <DocProse>
              <p className="leading-relaxed">
                Since we don't collect any personal data, there's no sensitive information to protect. The only data
                stored is:
              </p>
              <DocBullets>
                <DocBullet>Publicly available emblem codes (already public information)</DocBullet>
                <DocBullet>Cached in your browser's localStorage (you control this data)</DocBullet>
              </DocBullets>
              <p className="leading-relaxed">
                The website is served over HTTPS to ensure secure communication between your browser and our servers.
              </p>
            </DocProse>
          </DocSection>

          <DocSection>
            <DocHeading>Changes to This Policy</DocHeading>
            <p className="leading-relaxed text-muted-foreground">
              If we ever make changes to this privacy policy, we will update the &quot;Last updated&quot; date at the top of this page.
              Since we don't collect contact information, we cannot notify you directly of changes.
            </p>
          </DocSection>

          <DocSection>
            <DocHeading>Questions or Concerns?</DocHeading>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              If you have any questions about this privacy policy or how Code Vault handles data, feel free to reach out
              via GitHub or Twitter:
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="solar" className="h-11 font-heading">
                <a
                  href="https://github.com/Manaiakalani/destiny-code-finder"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                  GitHub
                </a>
              </Button>
              <Button asChild variant="outline" className="h-11 font-heading">
                <a
                  href="https://twitter.com/manaiakalani"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                  Twitter
                </a>
              </Button>
            </div>
          </DocSection>

          <DocClose>
            &quot;Your Light is yours alone. So is your privacy.&quot; — The Speaker
          </DocClose>
        </DocSections>
      </main>
      <SiteFooter />
    </div>
  );
}
