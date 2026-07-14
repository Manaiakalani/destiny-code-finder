import { Hexagon, Menu, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { AddCodeModal } from './AddCodeModal';
import { ThemeToggle } from './ThemeToggle';
import { RedemptionCode } from '@/types/code';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  onAddCode: (code: string) => { success: boolean; message: string };
  activeCount?: number;
  totalCount?: number;
}

export function Header({ onAddCode, activeCount = 0, totalCount = 0 }: HeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMobileMenuOpen]);

  const handleAddCode = (code: RedemptionCode) => {
    const result = onAddCode(code.code);
    if (result.success) {
      setIsModalOpen(false);
    }
    return result;
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/40 glass-card backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md">
              <div className="relative">
                <Hexagon className="w-10 h-10 text-accent transition-all duration-300 group-hover:text-solar" strokeWidth={1.5} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-heading text-xs font-bold text-accent group-hover:text-solar transition-colors duration-300">D2</span>
                </div>
                <div className="absolute inset-0 w-10 h-10 bg-accent/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div>
                <h1 className="font-heading text-lg font-bold tracking-wider text-foreground">
                  CODE VAULT
                </h1>
                <p className="text-[10px] text-accent/70 uppercase tracking-[0.2em]">
                  Guardian Archives
                </p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-6 px-4 py-2 rounded-lg glass-card">
                <div className="text-center">
                  <p className="font-heading text-2xl font-bold text-strand">{activeCount}</p>
                  <p className="text-[10px] text-strand/70 uppercase tracking-wider">Active</p>
                </div>
                <div className="w-px h-10 bg-accent/20" />
                <div className="text-center">
                  <p className="font-heading text-2xl font-bold text-accent">{totalCount}</p>
                  <p className="text-[10px] text-accent/70 uppercase tracking-wider">Total</p>
                </div>
              </div>

              <ThemeToggle />

              <Button
                type="button"
                onClick={() => setIsModalOpen(true)}
                size="sm"
                className="min-h-[44px] btn-solar text-white font-heading tracking-wider"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Code
              </Button>
            </nav>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden min-h-[44px] min-w-[44px] p-2 rounded-md hover:bg-secondary transition-colors touch-manipulation"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div id="mobile-menu" className="md:hidden py-4 border-t border-border/40 space-y-4">
              <div className="flex items-center justify-center gap-8 py-3">
                <div className="text-center">
                  <p className="font-heading text-xl font-bold text-strand">{activeCount}</p>
                  <p className="text-[10px] text-strand/70 uppercase tracking-wider">Active</p>
                </div>
                <div className="w-px h-10 bg-accent/20" />
                <div className="text-center">
                  <p className="font-heading text-xl font-bold text-accent">{totalCount}</p>
                  <p className="text-[10px] text-accent/70 uppercase tracking-wider">Total</p>
                </div>
                <div className="w-px h-10 bg-accent/20" />
                <ThemeToggle />
              </div>

              <Button
                type="button"
                onClick={() => {
                  setIsModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full min-h-[44px] btn-solar text-white font-heading tracking-wider"
              >
                <Plus className="w-4 h-4 mr-2" />
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
