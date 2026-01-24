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
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* VOID background elements */}
      <div className="absolute inset-0 triangle-pattern opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent/8 rounded-full blur-3xl animate-float" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-solar/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-[200px] h-[200px] bg-strand/5 rounded-full blur-3xl" />
      
      <div className="relative container mx-auto px-4 text-center">
        {/* Title with VOID styling */}
        <div className="space-y-4 mb-10 animate-void-materialize">
          <p className="text-sm font-semibold text-accent uppercase tracking-[0.4em] text-glow">
            Guardian Archives
          </p>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-foreground">
            <span className="text-glow">Destiny 2</span>{' '}
            <span className="text-glow-solar bg-gradient-to-r from-solar via-solar-accent to-solar bg-clip-text text-transparent">
              Codes
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Curated redemption codes for emblems, shaders, and exclusive rewards. 
            Gathered from official Bungie sources across the system.
          </p>
        </div>

        {/* Stats with subclass colors */}
        <div className="flex items-center justify-center gap-8 md:gap-16 mb-10">
          {/* Active - STRAND themed */}
          <div className="text-center group">
            <p className="font-heading text-4xl md:text-5xl font-bold text-strand text-glow-strand transition-all duration-300 group-hover:scale-110">
              {isLoading ? '—' : activeCount}
            </p>
            <p className="text-xs text-strand/70 uppercase tracking-[0.15em] font-semibold mt-1">Active Codes</p>
          </div>
          
          {/* Divider with VOID glow */}
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-accent/50 to-transparent" />
          
          {/* Total - VOID accent */}
          <div className="text-center group">
            <p className="font-heading text-4xl md:text-5xl font-bold text-accent transition-all duration-300 group-hover:scale-110">
              {isLoading ? '—' : codeCount}
            </p>
            <p className="text-xs text-accent/70 uppercase tracking-[0.15em] font-semibold mt-1">Total Tracked</p>
          </div>
        </div>

        {/* Actions with SOLAR primary CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={() => window.open('https://www.bungie.net/7/en/Codes/Redeem', '_blank')}
            className="btn-solar min-w-[220px] font-heading font-bold tracking-wider text-base text-white animate-solar-flare"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Redeem on Bungie.net
          </Button>
          
          {/* ARC styled refresh button */}
          <Button
            variant="outline"
            size="lg"
            onClick={onRefresh}
            disabled={isLoading}
            className="min-w-[160px] border-arc/40 text-arc hover:bg-arc/10 hover:border-arc/60 font-heading transition-all duration-150"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Scanning...' : 'Refresh'}
          </Button>
        </div>

        {/* Last update with subtle styling */}
        {lastUpdate && !isLoading && (
          <p className="mt-8 text-xs text-muted-foreground/80 tracking-wide">
            Last transmission: {lastUpdate.toLocaleString()}
          </p>
        )}
      </div>
    </section>
  );
}
