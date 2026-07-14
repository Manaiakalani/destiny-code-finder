import { ArrowLeft, ExternalLink, HardDrive, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
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
            Privacy
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Code Vault does not use accounts, cookies, advertising trackers, or analytics scripts.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Policy reviewed July 14, 2026.</p>
        </div>

        <div className="mt-8 space-y-4">
          <section className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-start gap-3">
              <HardDrive className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">Data stored in your browser</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Your selected theme is stored under <code className="text-foreground">theme</code>.
                  Codes you choose to pin are stored under{' '}
                  <code className="text-foreground">destiny2-pinned-codes-v1</code>. Pins remain on
                  this device until you remove them or clear site storage.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-start gap-3">
              <ExternalLink className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">External requests</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  The site is served by GitHub Pages. Reward images may load from Bungie or Destiny
                  Emblem Collector CDNs, and the Orbitron wordmark font loads from Google Fonts.
                  Those providers receive normal web-request information such as your IP address and
                  browser headers under their own policies. Code Vault does not send pinned codes to them.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">What is not collected</h2>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>No account, email address, profile, or authentication data.</li>
                  <li>No analytics events, advertising identifiers, or tracking cookies.</li>
                  <li>No server-side copy of your pinned codes or theme choice.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground">Questions</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Review the source or report a privacy concern on GitHub.
            </p>
            <a
              href="https://github.com/Manaiakalani/destiny-code-finder"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent hover:underline"
            >
              Open the project
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </section>
        </div>
      </main>
    </div>
  );
}
