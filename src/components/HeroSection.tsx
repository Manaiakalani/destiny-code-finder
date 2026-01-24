import { ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  codeCount: number;
  activeCount: number;
  lastUpdate: Date | null;
  onRefresh: () => void;
  isLoading: boolean;
}

export function HeroSection({ codeCount, activeCount, lastUpdate, onRefresh, isLoading }: HeroSectionProps) {
  return (
    <section className="relative py-12 md:py-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 triangle-pattern opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative container mx-auto px-4 text-center">
        {/* Title */}
        <div className="space-y-4 mb-8">
          <p className="text-sm font-medium text-primary uppercase tracking-[0.3em]">
            Guardian Resource
          </p>
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground text-glow">
            Destiny 2 Codes
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Curated redemption codes for emblems, shaders, and rewards. 
            Updated regularly from official Bungie sources.
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 md:gap-12 mb-8">
          <div className="text-center">
            <p className="font-heading text-3xl md:text-4xl font-bold text-primary text-glow">
              {isLoading ? '—' : activeCount}
            </p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Active Codes</p>
          </div>
          <div className="w-px h-12 bg-border/50" />
          <div className="text-center">
            <p className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              {isLoading ? '—' : codeCount}
            </p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Tracked</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={() => window.open('https://www.bungie.net/7/en/Codes/Redeem', '_blank')}
            className="min-w-[200px] font-heading font-semibold tracking-wider text-base"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Redeem on Bungie.net
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={onRefresh}
            disabled={isLoading}
            className="min-w-[160px] border-border/50 hover:border-primary/50 hover:bg-primary/5 font-heading"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Updating...' : 'Refresh'}
          </Button>
        </div>

        {/* Last update */}
        {lastUpdate && !isLoading && (
          <p className="mt-6 text-xs text-muted-foreground">
            Last updated: {lastUpdate.toLocaleString()}
          </p>
        )}
      </div>
    </section>
  );
}
