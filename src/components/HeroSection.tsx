import { ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';

interface HeroSectionProps {
  lastUpdate: Date | null;
  onRefresh: () => void;
  isLoading: boolean;
}

interface SkyStar {
  id: number;
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
  tier: 'bright' | 'mid' | 'dim';
}

function generateStars(count: number): SkyStar[] {
  const stars: SkyStar[] = [];
  let guard = 0;
  while (stars.length < count && guard < 900) {
    guard += 1;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    // The lockup sits in the middle. The planet and the sphere own the lower left.
    if (top > 78) continue;
    if (left < 24 && top > 46) continue;
    if (left > 16 && left < 84 && top > 16 && top < 74) continue;
    const roll = Math.random();
    const tier = roll > 0.94 ? 'bright' : roll > 0.72 ? 'mid' : 'dim';
    const size = tier === 'bright' ? 2 : tier === 'mid' ? 1.5 : 1;
    stars.push({
      id: stars.length,
      left: `${left}%`,
      top: `${top}%`,
      size,
      duration: (tier === 'dim' ? 4.5 : 3) + Math.random() * 4,
      delay: Math.random() * 8,
      tier,
    });
  }
  return stars;
}

export function HeroSection({ lastUpdate, onRefresh, isLoading }: HeroSectionProps) {
  const stars = useMemo(() => generateStars(72), []);
  const shootingStars = useMemo(() => [
    { id: 1, top: '4%', left: '-10%', delay: '2.2s', duration: '13s', angle: '7deg', travel: '78vw', drop: '5vh', width: '16rem', tone: 'arc' as const },
    { id: 2, top: '1%', left: '28%', delay: '8.4s', duration: '16s', angle: '12deg', travel: '48vw', drop: '7vh', width: '11rem' },
    { id: 3, top: '86%', left: '22%', delay: '5s', duration: '14s', angle: '2deg', travel: '58vw', drop: '2vh', width: '16rem', tone: 'warm' as const },
  ], []);

  return (
    <section className="hero-sky relative py-16 md:py-20 overflow-hidden">
      <div className="hero-traveler" aria-hidden="true" />
      <svg className="hero-earth" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path className="earth-haze earth-haze-wide" d="M-20 96 Q 720 34 1460 96" fill="none" stroke="hsl(198 100% 78%)" strokeOpacity="0.7" strokeWidth="22" />
        <path className="earth-haze" d="M-20 96 Q 720 34 1460 96" fill="none" stroke="hsl(190 100% 86%)" strokeOpacity="0.9" strokeWidth="8" />
        <path className="earth-fill" d="M-20 96 Q 720 34 1460 96 L 1460 160 L -20 160 Z" />
        <path d="M-20 96 Q 720 34 1460 96" fill="none" stroke="hsl(186 100% 94%)" strokeOpacity="0.92" strokeWidth="1.5" />
      </svg>
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
            className={`shooting-star${star.tone ? ` shooting-star-${star.tone}` : ''}`}
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

      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />

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
          <p className="hero-loaded mt-6 text-xs text-muted-foreground/80" role="status" aria-live="polite">
            Loaded at {lastUpdate.toLocaleTimeString()}
          </p>
        )}
      </div>
    </section>
  );
}
