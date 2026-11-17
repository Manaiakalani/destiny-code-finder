import { ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  lastUpdate: Date | null;
  onRefresh: () => void;
  isLoading: boolean;
}

export function HeroSection({ lastUpdate, onRefresh, isLoading }: HeroSectionProps) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-7xl px-4 py-5">
        <h1>Destiny 2 codes</h1>
        <p className="lead mt-2 text-muted-foreground">
          Curated emblem codes verified against Destiny Emblem Collector, Blueberries.gg, and the community.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <a
            href="https://www.bungie.net/7/en/Codes/Redeem"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-solar inline-flex h-11 min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 text-sm font-medium"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Redeem on Bungie.net
          </a>
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isLoading}
            className="min-h-11 whitespace-nowrap"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
            Refresh
          </Button>
          {lastUpdate && (
            <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
