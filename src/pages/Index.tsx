import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Shield } from 'lucide-react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { CodeFilters, type SortOption } from '@/components/CodeFilters';
import { CodeGrid } from '@/components/CodeGrid';
import { Button } from '@/components/ui/button';
import { useCodeScanner } from '@/hooks/useCodeScanner';
import { FilterStatus } from '@/types/code';

const PAGE_SIZE = 18;

const Index = () => {
  const { codes, catalogReviewedAt, addManualCode, removePinnedCode } = useCodeScanner();
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('featured');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const counts = useMemo<Record<FilterStatus, number>>(() => ({
    all: codes.length,
    redeemable: codes.filter(code => code.status === 'redeemable').length,
    restricted: codes.filter(code => code.status === 'restricted').length,
    d1: codes.filter(code => code.status === 'd1').length,
    pinned: codes.filter(code => code.isPinned).length,
  }), [codes]);

  const filteredCodes = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const result = codes.filter(code => {
      const matchesFilter = filter === 'all'
        || (filter === 'pinned' ? code.isPinned : code.status === filter);
      const matchesSearch = !normalizedSearch
        || code.code.toLowerCase().includes(normalizedSearch)
        || code.emblemName?.toLowerCase().includes(normalizedSearch)
        || code.description?.toLowerCase().includes(normalizedSearch)
        || code.source.toLowerCase().includes(normalizedSearch);
      return matchesFilter && matchesSearch;
    });

    return result.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      if (sort === 'name') {
        return (a.emblemName || a.description || a.code).localeCompare(
          b.emblemName || b.description || b.code,
        );
      }
      if (sort === 'code') return a.code.localeCompare(b.code);

      const statusOrder = { redeemable: 0, d1: 1, restricted: 2, pinned: 3 };
      return statusOrder[a.status] - statusOrder[b.status];
    });
  }, [codes, filter, search, sort]);

  const handleFilterChange = (nextFilter: FilterStatus) => {
    setFilter(nextFilter);
    setVisibleCount(PAGE_SIZE);
  };

  const handleSearchChange = (nextSearch: string) => {
    setSearch(nextSearch);
    setVisibleCount(PAGE_SIZE);
  };

  const handleSortChange = (nextSort: SortOption) => {
    setSort(nextSort);
    setVisibleCount(PAGE_SIZE);
  };

  const visibleCodes = filteredCodes.slice(0, visibleCount);
  const hasMore = visibleCodes.length < filteredCodes.length;
  const resetFilters = () => {
    setSearch('');
    setFilter('all');
    setSort('featured');
  };

  const handlePinCode = (code: string) => {
    const result = addManualCode(code);
    if (result.success) {
      setSearch('');
      setFilter('pinned');
      setVisibleCount(PAGE_SIZE);
    }
    return result;
  };

  return (
    <div className="min-h-screen">
      <Header onPinCode={handlePinCode} />
      <HeroSection counts={counts} catalogReviewedAt={catalogReviewedAt} />

      <main id="catalog" className="container mx-auto max-w-6xl px-4 py-8">
        <section aria-labelledby="catalog-heading">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="catalog-heading" className="text-2xl font-semibold text-foreground">
                Code catalogue
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Universal codes are community-checked; final availability is confirmed by Bungie.
              </p>
            </div>
            <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
              Showing {Math.min(visibleCodes.length, filteredCodes.length)} of {filteredCodes.length}
            </p>
          </div>

          <div className="sticky top-16 z-30 -mx-2 mb-5 border-y border-border bg-background/95 px-2 py-3 backdrop-blur">
            <CodeFilters
              filter={filter}
              onFilterChange={handleFilterChange}
              search={search}
              onSearchChange={handleSearchChange}
              sort={sort}
              onSortChange={handleSortChange}
              counts={counts}
            />
          </div>

          <CodeGrid
            codes={visibleCodes}
            onReset={resetFilters}
            onRemovePin={removePinnedCode}
          />

          {hasMore && (
            <div className="mt-6 flex justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => setVisibleCount(count => count + PAGE_SIZE)}
                className="min-h-11 min-w-40"
              >
                Load {Math.min(PAGE_SIZE, filteredCodes.length - visibleCodes.length)} more
              </Button>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-10 border-t border-border py-8">
        <div className="container mx-auto flex max-w-6xl flex-col gap-5 px-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-medium text-foreground">Built for the Destiny community.</p>
            <p className="mt-1">Not affiliated with or endorsed by Bungie, Inc.</p>
          </div>
          <nav className="flex flex-wrap items-center gap-4" aria-label="Footer navigation">
            <Link to="/about" className="inline-flex min-h-11 items-center gap-2 hover:text-foreground">
              <Shield className="h-4 w-4" aria-hidden="true" />
              Verification
            </Link>
            <Link to="/privacy" className="inline-flex min-h-11 min-w-11 items-center justify-center hover:text-foreground">
              Privacy
            </Link>
            <a
              href="https://www.bungie.net/7/en/Codes/Redeem"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 hover:text-foreground"
            >
              Bungie redemption
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Index;
