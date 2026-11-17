import { Hexagon, Menu, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { AddCodeModal } from './AddCodeModal';
import { ThemeToggle } from './ThemeToggle';
import { RedemptionCode } from '@/types/code';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onAddCode: (code: string) => { success: boolean; message: string; persisted?: boolean };
  activeCount?: number;
  totalCount?: number;
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'relative inline-flex h-11 items-center px-3 font-heading text-sm tracking-wider transition-colors',
    isActive
      ? 'text-foreground after:absolute after:bottom-1.5 after:left-3 after:right-3 after:h-px after:bg-accent'
      : 'text-muted-foreground hover:text-foreground'
  );

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex h-11 items-center border-t border-border/50 font-heading text-sm tracking-wider',
    isActive ? 'text-foreground' : 'text-muted-foreground'
  );

function VaultCount({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: 'strand' | 'accent';
}) {
  return (
    <p className="flex items-baseline gap-1.5">
      <span className={cn('font-heading text-base tabular-nums', tone === 'strand' ? 'text-strand' : 'text-accent')}>
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
    </p>
  );
}

export function Header({ onAddCode, activeCount = 0, totalCount = 0 }: HeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
    };
    const onResize = () => {
      if (window.matchMedia('(min-width: 768px)').matches) setIsMobileMenuOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, [isMobileMenuOpen]);

  const handleAddCode = (code: RedemptionCode) => {
    const result = onAddCode(code.code);
    if (result.success) setIsModalOpen(false);
    return result;
  };

  const openAddCode = () => {
    setIsModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="site-header sticky top-0 z-40 w-full">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center gap-4">
            <NavLink
              to="/"
              end
              className="flex min-w-0 items-center gap-3 rounded-md group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="relative shrink-0">
                <Hexagon className="h-10 w-10 text-accent transition-colors duration-300 group-hover:text-solar" strokeWidth={1.5} />
                <span className="absolute inset-0 flex items-center justify-center font-heading text-xs font-bold text-accent transition-colors duration-300 group-hover:text-solar">
                  D2
                </span>
              </span>
              <span className="min-w-0">
                <span className="block font-heading text-base font-bold tracking-wider text-foreground sm:text-lg">
                  CODE VAULT
                </span>
                <span className="block text-[10px] uppercase tracking-[0.18em] text-accent/80">
                  Guardian Archives
                </span>
              </span>
            </NavLink>

            <div className="ml-auto hidden items-center gap-2 md:flex">
              <div className="mr-3 hidden items-center gap-4 lg:flex" aria-label="Catalogue size">
                <VaultCount value={activeCount} label="D2 Active" tone="strand" />
                <span className="h-3 w-px bg-border" aria-hidden="true" />
                <VaultCount value={totalCount} label="Total" tone="accent" />
              </div>

              <nav className="flex items-center gap-1" aria-label="Primary">
                <NavLink to="/about" className={navLinkClass}>
                  About
                </NavLink>
                <NavLink to="/privacy" className={navLinkClass}>
                  Privacy
                </NavLink>
                <ThemeToggle />
                <Button
                  type="button"
                  onClick={openAddCode}
                  variant="solar"
                  className="ml-2 h-11 px-4 font-heading tracking-wider"
                >
                  <Plus className="h-4 w-4" />
                  Add Code
                </Button>
              </nav>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground hover:bg-secondary md:hidden"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div id="mobile-menu" className="md:hidden pb-4">
              <div className="flex items-center justify-between gap-4 py-3">
                <VaultCount value={activeCount} label="D2 Active" tone="strand" />
                <VaultCount value={totalCount} label="Total" tone="accent" />
              </div>
              <nav className="flex flex-col" aria-label="Primary">
                <NavLink to="/about" className={mobileLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
                  About
                </NavLink>
                <NavLink to="/privacy" className={mobileLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
                  Privacy
                </NavLink>
              </nav>
              <div className="flex h-12 items-center justify-between border-t border-border/50">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Appearance</span>
                <ThemeToggle showLabel />
              </div>
              <Button
                type="button"
                onClick={openAddCode}
                variant="solar"
                className="mt-2 h-11 w-full font-heading tracking-wider"
              >
                <Plus className="h-4 w-4" />
                Add Code
              </Button>
            </div>
          )}
        </div>
      </header>

      <AddCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCode}
      />
    </>
  );
}
