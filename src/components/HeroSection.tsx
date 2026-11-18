import { ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';

interface HeroSectionProps {
  lastUpdate: Date | null;
  onRefresh: () => void;
  isLoading: boolean;
}

function generateStars(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const roll = Math.random();
    const tier = roll > 0.94 ? 'bright' : roll > 0.72 ? 'mid' : 'dim';
    const size = tier === 'bright' ? 2 : tier === 'mid' ? 1.5 : 1;
    return {
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size,
      duration: (tier === 'dim' ? 4.5 : 3) + Math.random() * 4,
      delay: Math.random() * 8,
      tier,
    };
  });
}

export function HeroSection({ lastUpdate, onRefresh, isLoading }: HeroSectionProps) {
  const stars = useMemo(() => generateStars(72), []);
  const shootingStars = useMemo(() => [
    { id: 1, top: '18%', left: '-12%', delay: '1s', duration: '13s', angle: '26deg', travel: '78vw', drop: '42vh', width: '8.5rem' },
    { id: 2, top: '8%', left: '6%', delay: '6.5s', duration: '16s', angle: '34deg', travel: '62vw', drop: '36vh', width: '6.5rem' },
    { id: 3, top: '28%', left: '-6%', delay: '11s', duration: '15s', angle: '18deg', travel: '84vw', drop: '28vh', width: '10rem', warm: true },
    { id: 4, top: '4%', left: '38%', delay: '3.2s', duration: '18s', angle: '42deg', travel: '48vw', drop: '46vh', width: '5.5rem' },
  ], []);

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      <div className="stars-container">
        {stars.map((star) => (
          <div
            key={star.id}
            className={`star star-${star.tier}`}
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
        {shootingStars.map((star) => (
          <div
            key={`shooting-${star.id}`}
            className={`shooting-star${star.warm ? ' shooting-star-warm' : ''}`}
            style={{
              top: star.top,
              left: star.left,
              width: star.width,
              '--delay': star.delay,
              '--duration': star.duration,
              '--angle': star.angle,
              '--travel': star.travel,
              '--drop': star.drop,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="traveler-bg" aria-hidden="true" />
      <div className="absolute inset-0 aurora-bg" />
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/5 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4 text-center">
        <div className="space-y-5 mb-10">
          <h1 className="hero-title font-heading text-5xl font-bold leading-[0.92] text-foreground md:text-6xl lg:text-7xl">
            <span className="hero-word block md:inline">Destiny 2</span>{' '}
            <span className="hero-word-solar mt-1 block md:mt-0 md:inline">Codes</span>
          </h1>
          <p className="text-sm text-muted-foreground/80 max-w-xl mx-auto">
            Curated emblem codes verified against Destiny Emblem Collector, Blueberries.gg, and the community.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://www.bungie.net/7/en/Codes/Redeem"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-solar min-h-[44px] min-w-[200px] font-heading font-semibold tracking-wide btn-haptic gaming-glow inline-flex items-center justify-center h-11 rounded-md px-8"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Redeem on Bungie.net
          </a>

          <Button
            variant="outline"
            size="lg"
            onClick={onRefresh}
            disabled={isLoading}
            className="min-h-[44px] min-w-[140px] border-accent/25 text-accent hover:bg-accent/10 hover:border-accent/40 font-heading btn-haptic"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {lastUpdate && (
          <p className="mt-6 text-xs text-muted-foreground/50" role="status" aria-live="polite">
            Loaded at {lastUpdate.toLocaleTimeString()}
          </p>
        )}
      </div>
    </section>
  );
}
