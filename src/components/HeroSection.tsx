import { ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';

interface HeroSectionProps {
  lastUpdate: Date | null;
  onRefresh: () => void;
  isLoading: boolean;
}

// Generate random star positions
function generateStars(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 5,
  }));
}

export function HeroSection({ lastUpdate, onRefresh, isLoading }: HeroSectionProps) {
  // Memoize stars so they don't regenerate on every render
  const stars = useMemo(() => generateStars(50), []);
  // 5 shooting stars with unique animations
  const shootingStars = useMemo(() => [
    { id: 1, className: 'shooting-star-1' },
    { id: 2, className: 'shooting-star-2' },
    { id: 3, className: 'shooting-star-3' },
    { id: 4, className: 'shooting-star-4' },
    { id: 5, className: 'shooting-star-5' },
  ], []);

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      {/* Animated star particles */}
      <div className="stars-container">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              '--duration': `${star.duration}s`,
              '--delay': `${star.delay}s`,
            } as React.CSSProperties}
          />
        ))}
        {/* Shooting stars */}
        {shootingStars.map((star) => (
          <div
            key={`shooting-${star.id}`}
            className={`shooting-star ${star.className}`}
          />
        ))}
      </div>

      {/* Traveler silhouette watermark */}
      <div className="traveler-bg" aria-hidden="true" />

      {/* Aurora background effect */}
      <div className="absolute inset-0 aurora-bg" />
      
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
      
      {/* Soft glow accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
      
      <div className="relative container mx-auto px-4 text-center">
        {/* Title */}
        <div className="space-y-5 mb-10">
          <p className="text-xs font-semibold text-accent/80 uppercase tracking-[0.25em]">
            Guardian Archives
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground title-shadow">
            Destiny 2{' '}
            <span className="bg-gradient-to-r from-solar via-solar-accent to-solar bg-clip-text text-transparent">
              Codes
            </span>
          </h1>
          <p className="text-sm text-muted-foreground/80 max-w-xl mx-auto">
            Real-time redemption codes from Blueberries.gg, Destiny Emblem Collector, Reddit, and the community.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://www.bungie.net/7/en/Codes/Redeem"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-solar min-w-[200px] font-heading font-semibold tracking-wide text-white btn-haptic gaming-glow inline-flex items-center justify-center h-11 rounded-md px-8"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Redeem on Bungie.net
          </a>
          
          <Button
            variant="outline"
            size="lg"
            onClick={onRefresh}
            disabled={isLoading}
            className="min-w-[140px] border-accent/25 text-accent hover:bg-accent/10 hover:border-accent/40 font-heading btn-haptic"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        {/* Last update */}
        {lastUpdate && (
          <p className="mt-6 text-xs text-muted-foreground/50">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        )}
      </div>
    </section>
  );
}
