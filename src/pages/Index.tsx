import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { CodeFilters } from '@/components/CodeFilters';
import { CodeGrid } from '@/components/CodeGrid';
import { useCodeScanner } from '@/hooks/useCodeScanner';
import { FilterStatus } from '@/types/code';

const Index = () => {
  const { codes, isLoading, lastUpdateTime, refreshCodes, addManualCode } = useCodeScanner();
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');

  // Calculate counts
  const counts = useMemo(() => ({
    all: codes.length,
    active: codes.filter(c => c.status === 'active').length,
    expired: codes.filter(c => c.status === 'expired').length,
    unknown: codes.filter(c => c.status === 'unknown').length,
  }), [codes]);

  // Filter and sort codes
  const filteredCodes = useMemo(() => {
    let result = [...codes];
    
    // Apply status filter
    if (filter !== 'all') {
      result = result.filter(c => c.status === filter);
    }
    
    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(c =>
        c.code.toLowerCase().includes(searchLower) ||
        c.description?.toLowerCase().includes(searchLower) ||
        c.source.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort: active first, then by date
    result.sort((a, b) => {
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;
      return b.foundAt.getTime() - a.foundAt.getTime();
    });
    
    return result;
  }, [codes, filter, search]);

  return (
    <div className="min-h-screen">
      <Header onAddCode={addManualCode} />
      
      {/* Hero */}
      <HeroSection
        codeCount={codes.length}
        activeCount={counts.active}
        lastUpdate={lastUpdateTime}
        onRefresh={refreshCodes}
        isLoading={isLoading}
      />
      
      {/* Divider */}
      <div className="divider-glow mx-auto max-w-4xl" />
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Section header */}
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold tracking-wider text-foreground">
              All Codes
            </h2>
          </div>
          
          {/* Filters */}
          <CodeFilters
            filter={filter}
            onFilterChange={setFilter}
            search={search}
            onSearchChange={setSearch}
            counts={counts}
          />
          
          {/* Grid */}
          <CodeGrid codes={filteredCodes} isLoading={isLoading} />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/30 py-8 mt-12">
        <div className="container mx-auto px-4 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Not affiliated with Bungie, Inc. Destiny 2 is a trademark of Bungie, Inc.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Codes are gathered from official Bungie channels and community sources.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
