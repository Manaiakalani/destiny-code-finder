import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { CodeFilters } from '@/components/CodeFilters';
import { CodeGrid } from '@/components/CodeGrid';
import { CodeGridSkeleton } from '@/components/CodeSkeleton';
import { EmptyState } from '@/components/EmptyState';
import { useCodeScanner } from '@/hooks/useCodeScanner';
import { FilterStatus } from '@/types/code';
import { Link } from 'react-router-dom';
import { Github, Twitter, Shield, ExternalLink } from 'lucide-react';

const Index = () => {
  const { codes, isLoading, lastUpdateTime, refreshCodes, addManualCode } = useCodeScanner();
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');

  // Calculate counts
  const counts = useMemo(() => ({
    all: codes.length,
    active: codes.filter(c => c.status === 'active').length,
    expired: codes.filter(c => c.status === 'expired').length,
    d1: codes.filter(c => c.status === 'd1').length,
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
    
    // Sort: active first, then D1, then expired, then by date
    result.sort((a, b) => {
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
      
      {/* Hero */}
      <HeroSection
        lastUpdate={lastUpdateTime}
        onRefresh={refreshCodes}
        isLoading={isLoading}
      />
      
      {/* Divider - VOID accent with hexagonal theme */}
      <div className="hex-divider mx-auto max-w-4xl" />
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-12">
        <div className="space-y-6">
          {/* Section header with refined styling */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-wider text-foreground">
              <span className="text-accent">Archive</span> Database
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
      <footer className="border-t border-border/15 py-10 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-6">
            {/* Top - Made with love */}
            <p className="text-sm text-muted-foreground/70">
              Made with <span className="text-red-500">♥</span> in Seattle, WA for the Destiny 2 community
            </p>
            
            {/* Middle - Social handles */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground/60">
              <a
                href="https://github.com/Manaiakalani"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                @Manaiakalani
              </a>
              <a
                href="https://twitter.com/manaiakalani"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors flex items-center gap-2"
              >
                <Twitter className="w-4 h-4" />
                @manaiakalani
              </a>
            </div>

            {/* Bottom row - disclaimer left, links right */}
            <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-6 border-t border-border/10">
              {/* Left - Disclaimer */}
              <div className="text-xs text-muted-foreground/50 space-y-0.5">
                <p>Codes aggregated from public sources. Not affiliated with Bungie, Inc.</p>
                <p>Always verify codes at the official redemption site before use.</p>
              </div>

              {/* Right - Links */}
              <div className="flex items-center gap-5 text-sm text-muted-foreground/60">
                <Link
                  to="/privacy"
                  className="hover:text-accent transition-colors flex items-center gap-1.5"
                >
                  <Shield className="w-4 h-4" />
                  Privacy
                </Link>
                <a
                  href="https://www.bungie.net/7/en/Codes/Redeem"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  Official Bungie
                </a>
                <a
                  href="https://twitter.com/DestinyTheGame"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors flex items-center gap-1.5"
                >
                  <Twitter className="w-4 h-4" />
                  @DestinyTheGame
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
