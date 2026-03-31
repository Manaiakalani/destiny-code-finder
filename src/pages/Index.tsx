import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { CodeFilters } from '@/components/CodeFilters';
import { CodeGrid } from '@/components/CodeGrid';
import { useCodeScanner } from '@/hooks/useCodeScanner';
import { FilterStatus } from '@/types/code';
import { Link } from 'react-router-dom';
import { Shield, ExternalLink } from 'lucide-react';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

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
                <GithubIcon className="w-4 h-4" />
                @Manaiakalani
              </a>
              <a
                href="https://twitter.com/manaiakalani"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors flex items-center gap-2"
              >
                <TwitterIcon className="w-4 h-4" />
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
                  <TwitterIcon className="w-4 h-4" />
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
