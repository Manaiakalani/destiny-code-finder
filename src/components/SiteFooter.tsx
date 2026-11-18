import { Link } from 'react-router-dom';
import { ExternalLink, Heart, Shield } from 'lucide-react';

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border/15 py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6">
          <p className="text-sm text-muted-foreground">
            Made with <Heart className="inline h-3.5 w-3.5 fill-solar text-solar" aria-hidden="true" /> in Seattle, WA for the Destiny 2 community
          </p>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a
              href="https://github.com/Manaiakalani"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-accent"
            >
              <GithubIcon className="h-4 w-4" />
              @Manaiakalani
            </a>
            <a
              href="https://twitter.com/manaiakalani"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-accent"
            >
              <TwitterIcon className="h-4 w-4" />
              @manaiakalani
            </a>
          </div>

          <div className="flex w-full flex-col items-start justify-between gap-4 border-t border-border/10 pt-6 md:flex-row md:items-center">
            <div className="space-y-0.5 text-xs text-muted-foreground/80">
              <p>Codes aggregated from public sources. Not affiliated with Bungie, Inc.</p>
              <p>Always verify codes at the official redemption site before use.</p>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-foreground/85">
              <Link to="/about" className="transition-colors hover:text-accent">
                About
              </Link>
              <Link to="/privacy" className="flex items-center gap-1.5 transition-colors hover:text-accent">
                <Shield className="h-4 w-4" />
                Privacy
              </Link>
              <a
                href="https://www.bungie.net/7/en/Codes/Redeem"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-colors hover:text-accent"
              >
                <ExternalLink className="h-4 w-4" />
                Official Bungie
              </a>
              <a
                href="https://twitter.com/DestinyTheGame"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-colors hover:text-accent"
              >
                <TwitterIcon className="h-4 w-4" />
                @DestinyTheGame
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
