import { Hexagon, ExternalLink, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AddCodeModal } from './AddCodeModal';

interface HeaderProps {
  onAddCode?: (code: string) => { success: boolean; message: string };
}

export function Header({ onAddCode }: HeaderProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <header className="border-b border-accent/20 bg-background/90 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - VOID themed */}
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Hexagon className="w-10 h-10 text-accent transition-all duration-300 group-hover:text-solar" strokeWidth={1.5} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-heading text-xs font-bold text-accent group-hover:text-solar transition-colors duration-300">D2</span>
                </div>
                {/* VOID glow effect */}
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
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-3">
              {onAddCode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddModal(true)}
                  className="text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Submit Code</span>
                </Button>
              )}
              
              {/* SOLAR styled primary CTA */}
              <Button
                size="sm"
                onClick={() => window.open('https://www.bungie.net/7/en/Codes/Redeem', '_blank')}
                className="btn-solar text-white font-heading tracking-wide"
              >
                <ExternalLink className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Bungie.net</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {onAddCode && (
        <AddCodeModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={onAddCode}
        />
      )}
    </>
  );
}
