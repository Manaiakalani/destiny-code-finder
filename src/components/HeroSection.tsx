import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  counts: {
    redeemable: number;
    d1: number;
    restricted: number;
  };
  catalogReviewedAt: Date;
}

export function HeroSection({ counts, catalogReviewedAt }: HeroSectionProps) {
  const reviewedDate = catalogReviewedAt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/Los_Angeles',
  });

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="catalog-halo" aria-hidden="true" />
      <div className="container relative mx-auto max-w-6xl px-4 py-9 sm:py-11">
        <div className="max-w-3xl">
          <h1 className="text-balance font-heading text-3xl font-bold tracking-[0.04em] text-foreground sm:text-4xl">
            Destiny redemption codes
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
            A curated catalogue of universal rewards, Destiny 1 codes, and restricted offers.
            Copy a code, then confirm it on Bungie.net.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span>
              <strong className="font-semibold text-foreground">{counts.redeemable}</strong> redeemable
            </span>
            <span aria-hidden="true">/</span>
            <span>
              <strong className="font-semibold text-foreground">{counts.d1}</strong> Destiny 1
            </span>
            <span aria-hidden="true">/</span>
            <span>
              <strong className="font-semibold text-foreground">{counts.restricted}</strong> restricted
            </span>
          </div>
          <Link
            to="/about"
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Catalogue reviewed {reviewedDate} - see verification method
          </Link>
        </div>
      </div>
    </section>
  );
}
