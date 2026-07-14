import { Hexagon, Info, Menu, Pin, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AddCodeModal } from './AddCodeModal';
import { ThemeToggle } from './ThemeToggle';
import { type AddCodeResult } from '@/hooks/useCodeScanner';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onPinCode: (code: string) => AddCodeResult;
}

export function Header({ onPinCode }: HeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMobileMenuOpen]);

  const navLinkClass = (path: string) => cn(
    'inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground',
    location.pathname === path && 'bg-secondary text-foreground',
  );

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link
              to="/"
              className="flex min-h-11 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Code Vault home"
            >
              <span className="relative inline-flex h-10 w-10 items-center justify-center" aria-hidden="true">
                <Hexagon className="h-10 w-10 text-accent" strokeWidth={1.5} />
                <span className="absolute font-heading text-xs font-bold text-accent">D2</span>
              </span>
              <span>
                <span className="block font-heading text-base font-bold tracking-[0.12em] text-foreground">
                  CODE VAULT
                </span>
                <span className="block text-xs text-muted-foreground">
                  Community code catalogue
                </span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
              <Link to="/about" className={navLinkClass('/about')}>
                <Info className="h-4 w-4" aria-hidden="true" />
                How codes are checked
              </Link>
              <ThemeToggle />
              <Button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="min-h-11 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Pin className="h-4 w-4" aria-hidden="true" />
                Pin a code
              </Button>
            </nav>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(open => !open)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary md:hidden"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {isMobileMenuOpen && (
            <nav id="mobile-menu" className="space-y-2 border-t border-border py-3 md:hidden" aria-label="Mobile navigation">
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(navLinkClass('/about'), 'flex w-full')}
              >
                <Info className="h-4 w-4" aria-hidden="true" />
                How codes are checked
              </Link>
              <Link
                to="/privacy"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(navLinkClass('/privacy'), 'flex w-full')}
              >
                Privacy
              </Link>
              <div className="flex items-center justify-between gap-3 pt-1">
                <ThemeToggle />
                <Button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="min-h-11 flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <Pin className="h-4 w-4" aria-hidden="true" />
                  Pin a code
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>

      <AddCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onPinCode}
      />
    </>
  );
}
