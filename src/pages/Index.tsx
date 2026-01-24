import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { ScanInput } from '@/components/ScanInput';
import { CodeFilters } from '@/components/CodeFilters';
import { CodeCard } from '@/components/CodeCard';
import { EmptyState } from '@/components/EmptyState';
import { NewTodaySection } from '@/components/NewTodaySection';
import { useCodeScanner } from '@/hooks/useCodeScanner';
import { FilterStatus, SortOrder } from '@/types/code';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { codes, isScanning, lastScanTime, scan, clearCodes } = useCodeScanner();
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

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
    
    // Sort
    result.sort((a, b) => {
      const diff = b.foundAt.getTime() - a.foundAt.getTime();
      return sortOrder === 'newest' ? diff : -diff;
    });
    
    return result;
  }, [codes, filter, search, sortOrder]);

  // Get codes added today
  const todayCodes = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return codes.filter(c => c.foundAt >= today && c.isNew);
  }, [codes]);

  // Codes not in today section
  const otherCodes = useMemo(() => {
    const todayIds = new Set(todayCodes.map(c => c.id));
    return filteredCodes.filter(c => !todayIds.has(c.id));
  }, [filteredCodes, todayCodes]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Scan input */}
        <section>
          <ScanInput onScan={scan} isScanning={isScanning} />
        </section>
        
        {/* Content */}
        {codes.length > 0 ? (
          <>
            {/* New today section */}
            {todayCodes.length > 0 && filter === 'all' && !search && (
              <NewTodaySection codes={todayCodes} />
            )}
            
            {/* All codes section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  All Codes
                </h2>
                
                <div className="flex items-center gap-4">
                  {lastScanTime && (
                    <span className="text-xs text-muted-foreground">
                      Last scan: {lastScanTime.toLocaleTimeString()}
                    </span>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCodes}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
              
              <CodeFilters
                filter={filter}
                onFilterChange={setFilter}
                search={search}
                onSearchChange={setSearch}
                sortOrder={sortOrder}
                onSortChange={setSortOrder}
                counts={counts}
              />
              
              {otherCodes.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {otherCodes.map((code) => (
                    <CodeCard key={code.id} code={code} />
                  ))}
                </div>
              ) : (
                <EmptyState hasSearched={true} />
              )}
            </section>
          </>
        ) : (
          <EmptyState hasSearched={false} />
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Not affiliated with Bungie. Codes are scraped from public sources.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
