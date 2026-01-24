import { Gamepad2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="border-b border-border/50 bg-card/30 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Gamepad2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold tracking-wide text-foreground">
                D2 Code Finder
              </h1>
              <p className="text-xs text-muted-foreground">
                Destiny 2 Redemption Codes
              </p>
            </div>
          </div>
          
          {/* Redeem link */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://www.bungie.net/7/en/Codes/Redeem', '_blank')}
            className="border-primary/30 text-primary hover:bg-primary/10 font-heading"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Bungie.net
          </Button>
        </div>
      </div>
    </header>
  );
}
