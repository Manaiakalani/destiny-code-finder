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
      <header className="border-b border-border/30 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Hexagon className="w-10 h-10 text-primary" strokeWidth={1.5} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-heading text-xs font-bold text-primary">D2</span>
                </div>
              </div>
              <div>
                <h1 className="font-heading text-lg font-bold tracking-wider text-foreground">
                  CODE VAULT
                </h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                  Destiny 2 Redemptions
                </p>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              {onAddCode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddModal(true)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Add Code</span>
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://www.bungie.net/7/en/Codes/Redeem', '_blank')}
                className="border-primary/30 text-primary hover:bg-primary/10 font-heading tracking-wide"
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
