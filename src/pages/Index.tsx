import { useMemo } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { CodeFilters } from '@/components/CodeFilters';
import { CodeGrid } from '@/components/CodeGrid';
import { useCodeScanner } from '@/hooks/useCodeScanner';
import { FilterStatus } from '@/types/code';
import { Link, useSearchParams } from 'react-router-dom';
import { buildSearchableText, normalizeSearchText } from '@/services/codeScraperService';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

function readFilter(value: string | null): FilterStatus {
  if (value === 'active' || value === 'expired' || value === 'd1' || value === 'unknown') {
    return value;
  }
  return 'all';
}

const Index = () => {
  const { codes, isLoading, errorMessage, lastUpdateTime, refreshCodes, addManualCode } = useCodeScanner();
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = readFilter(searchParams.get('status'));
  const search = searchParams.get('q') ?? '';

  const setFilter = (next: FilterStatus) => {
    const params = new URLSearchParams(searchParams);
    if (next === 'all') params.delete('status');
    else params.set('status', next);
    setSearchParams(params, { replace: true });
  };

  const setSearch = (next: string) => {
    const params = new URLSearchParams(searchParams);
    if (next) params.set('q', next);
    else params.delete('q');
    setSearchParams(params, { replace: true });
  };

  const counts = useMemo(() => ({
    all: codes.length,
    active: codes.filter(c => c.status === 'active').length,
    expired: codes.filter(c => c.status === 'expired').length,
    d1: codes.filter(c => c.status === 'd1').length,
    unknown: codes.filter(c => c.status === 'unknown').length,
  }), [codes]);

  const filteredCodes = useMemo(() => {
    let result = [...codes];

    if (filter !== 'all') {
      result = result.filter(c => c.status === filter);
    }

    const searchLower = normalizeSearchText(search);
    if (searchLower) {
      result = result.filter(c => buildSearchableText(c).includes(searchLower));
    }

    result.sort((a, b) => {
      // User-submitted codes pin to the top, as the add-code toast promises.
      const aManual = a.id.startsWith('manual-');
      const bManual = b.id.startsWith('manual-');
      if (aManual !== bManual) return aManual ? -1 : 1;

      const statusOrder = { active: 0, d1: 1, unknown: 2, expired: 3 };
      const aOrder = statusOrder[a.status] ?? 2;
      const bOrder = statusOrder[b.status] ?? 2;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return b.foundAt.getTime() - a.foundAt.getTime();
    });

    return result;
  }, [codes, filter, search]);

  return (
    <div className="min-h-screen">
      <Header onAddCode={addManualCode} activeCount={counts.active} totalCount={codes.length} />

      <HeroSection
        lastUpdate={lastUpdateTime}
        onRefresh={refreshCodes}
        isLoading={isLoading}
      />

      <main id="codes" className="mx-auto w-full max-w-7xl px-4 py-6">
        <h2 className="mb-4">Codes</h2>

        {errorMessage && (
          <p className="mb-4 text-sm text-destructive" role="alert">
            {errorMessage}
          </p>
        )}

        <div className="space-y-4">
          <CodeFilters
            filter={filter}
            onFilterChange={setFilter}
            search={search}
            onSearchChange={setSearch}
            counts={counts}
          />

          <CodeGrid codes={filteredCodes} isLoading={isLoading} />
        </div>
      </main>

      <footer className="mt-8 border-t border-border py-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4">
          <p className="text-sm text-muted-foreground">
            Made in Seattle, WA for the Destiny 2 community
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <a
              href="https://github.com/Manaiakalani"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-foreground"
            >
              <GithubIcon className="h-4 w-4" />
              @Manaiakalani
            </a>
            <a
              href="https://twitter.com/manaiakalani"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-foreground"
            >
              <TwitterIcon className="h-4 w-4" />
              @manaiakalani
            </a>
          </div>

          <div className="flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row md:items-end md:justify-between">
            <div className="space-y-1">
              <p>Codes aggregated from public sources. Not affiliated with Bungie, Inc.</p>
              <p>Always verify codes at the official redemption site before use.</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link to="/about" className="hover:text-foreground">
                About
              </Link>
              <Link to="/privacy" className="hover:text-foreground">
                Privacy
              </Link>
              <a
                href="https://www.bungie.net/7/en/Codes/Redeem"
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap hover:text-foreground"
              >
                Official Bungie
              </a>
              <a
                href="https://twitter.com/DestinyTheGame"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 whitespace-nowrap hover:text-foreground"
              >
                <TwitterIcon className="h-4 w-4" />
                @DestinyTheGame
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
