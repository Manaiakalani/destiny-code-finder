import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { CodeFilters } from '@/components/CodeFilters';
import { CodeGrid } from '@/components/CodeGrid';
import { SiteFooter } from '@/components/SiteFooter';
import { useCodeScanner } from '@/hooks/useCodeScanner';
import { FilterStatus } from '@/types/code';
import { buildSearchableText, normalizeSearchText } from '@/services/codeScraperService';

const Index = () => {
  const { codes, isLoading, errorMessage, lastUpdateTime, refreshCodes, addManualCode } = useCodeScanner();
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');

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

      <div className="hex-divider mx-auto max-w-4xl" />

      <main className="catalogue-main container mx-auto px-4 py-8 md:py-12">
        <div className="space-y-6">
          <h2 className="font-heading text-2xl font-bold tracking-wider text-foreground md:text-3xl">
            Archive Database
          </h2>

          <CodeFilters
            filter={filter}
            onFilterChange={setFilter}
            search={search}
            onSearchChange={setSearch}
            counts={counts}
          />

          {errorMessage && (
            <p role="alert" className="text-sm text-stasis text-center">
              {errorMessage}
            </p>
          )}

          <CodeGrid codes={filteredCodes} isLoading={isLoading} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Index;
