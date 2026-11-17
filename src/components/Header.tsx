import { Menu, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { AddCodeModal } from './AddCodeModal';
import { ThemeToggle } from './ThemeToggle';
import { RedemptionCode } from '@/types/code';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onAddCode: (code: string) => { success: boolean; message: string; persisted?: boolean };
  activeCount?: number;
  totalCount?: number;
}

export function Header({ onAddCode, activeCount = 0, totalCount = 0 }: HeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      <a href="#codes" className="skip-link">
        Skip to codes
      </a>
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4">
          <Link to="/" className="wordmark rounded-md text-base text-foreground">
            Code Vault
          </Link>

          <nav className="hidden items-center gap-4 md:flex">
            <p className="text-sm text-muted-foreground">
              <span className="num text-foreground">{activeCount}</span> D2 active
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="num text-foreground">{totalCount}</span> total
            </p>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <ThemeToggle />
            <Button
              type="button"
              onClick={() => setIsModalOpen(true)}
              size="sm"
              variant="solar"
              className="min-h-11"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              Add Code
            </Button>
          </nav>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md hover:bg-secondary md:hidden"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div id="mobile-menu" className="space-y-3 border-t border-border px-4 py-4 md:hidden">
            <p className="text-sm text-muted-foreground">
              <span className="num text-foreground">{activeCount}</span> D2 active
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="num text-foreground">{totalCount}</span> total
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-muted-foreground hover:text-foreground">
                About
              </Link>
              <Link to="/privacy" onClick={() => setIsMobileMenuOpen(false)} className="text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <ThemeToggle />
            </div>
            <Button
              type="button"
              onClick={() => {
                setIsModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              variant="solar"
              className="min-h-11 w-full"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              Add Code
            </Button>
          </div>
        )}
      </header>

      <AddCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCode}
      />
    </>
  );
}
