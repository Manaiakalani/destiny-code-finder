import { Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  filter?: string;
  onReset?: () => void;
}

export function EmptyState({ filter, onReset }: EmptyStateProps) {
  const messages = [
    "No codes found in the archives, Guardian.",
    "The Traveler hasn't blessed us with codes yet.",
    "Even Rasputin can't find matching codes.",
    "Your Ghost is still scanning for codes...",
    "The Cryptarch has nothing for you... yet."
  ];
  
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  
  return (
    <div className="glass-card p-12 text-center space-y-6">
      {/* Ghost companion animation */}
      <div className="flex justify-center mb-6">
        <div className="ghost-loader relative">
          {/* Ghost shell effect */}
          <div className="w-20 h-20 relative">
            {/* Core */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent via-accent/50 to-accent/30 rounded-lg transform rotate-45 opacity-80" />
            {/* Inner glow */}
            <div className="absolute inset-2 bg-gradient-to-br from-white/40 to-transparent rounded-lg transform rotate-45" />
            {/* Eye */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full shadow-lg shadow-accent/50 animate-pulse" />
            </div>
          </div>
          
          {/* Scan lines */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-50 animate-pulse" />
        </div>
      </div>
      
      {/* Message */}
      <div className="space-y-3">
        <h3 className="font-heading text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          <Search className="w-6 h-6 text-accent" />
          No Codes Found
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto text-lg">
          {randomMessage}
        </p>
        {filter && (
          <p className="text-sm text-muted-foreground/70">
            Try adjusting your filters or search terms.
          </p>
        )}
      </div>
      
      {/* Action */}
      {onReset && (
        <Button
          onClick={onReset}
          variant="outline"
          className="border-accent/40 text-accent hover:bg-accent/10"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      )}
      
      {/* Lore flavor text */}
      <div className="pt-6 border-t border-border/30">
        <p className="text-xs text-muted-foreground/50 italic">
          "The Light provides... eventually." — Unknown Guardian
        </p>
      </div>
    </div>
  );
}