import { ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from 'react';

const HeroCanvas = lazy(() => import('@/components/hero-sky/HeroCanvas'));

function wantsLessData() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData === true) return true;
  return window.matchMedia('(prefers-reduced-data: reduce)').matches;
}

function useShowSky() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (wantsLessData()) return;
    const lite = window.matchMedia('(max-width: 719px), (pointer: coarse) and (max-width: 1180px)').matches;
    const start = () => setShow(true);
    if (!lite) {
      start();
      return;
    }
    const id = window.setTimeout(start, 600);
    return () => window.clearTimeout(id);
  }, []);
  return show;
}

class SkyBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

interface HeroSectionProps {
  lastUpdate: Date | null;
  onRefresh: () => void;
  isLoading: boolean;
}

export function HeroSection({ lastUpdate, onRefresh, isLoading }: HeroSectionProps) {
  const showSky = useShowSky();
  return (
    <section className="hero-sky relative overflow-hidden pt-8 pb-12 md:py-20">
      {showSky ? (
        <SkyBoundary>
          <Suspense fallback={null}>
            <HeroCanvas />
          </Suspense>
        </SkyBoundary>
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />

      <div className="relative container mx-auto px-4 text-center">
        <div className="hero-copy mb-6 space-y-4 md:mb-10 md:space-y-5">
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
            className="hero-refresh min-h-[44px] min-w-[140px] border-accent/50 bg-background/50 text-accent font-heading btn-haptic"
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
