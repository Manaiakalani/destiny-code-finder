import { Search, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  hasSearched: boolean;
}

export function EmptyState({ hasSearched }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="p-4 rounded-full bg-secondary/50 mb-4">
        {hasSearched ? (
          <Search className="w-8 h-8 text-muted-foreground" />
        ) : (
          <Sparkles className="w-8 h-8 text-primary" />
        )}
      </div>
      
      <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
        {hasSearched ? 'No codes found' : 'Ready to scan'}
      </h3>
      
      <p className="text-sm text-muted-foreground max-w-md">
        {hasSearched
          ? "Try adjusting your filters or search for different sources."
          : "Enter Twitter usernames, URLs, or paste codes directly above to start finding Destiny 2 redemption codes."}
      </p>
      
      {!hasSearched && (
        <div className="mt-6 space-y-2 text-xs text-muted-foreground">
          <p>Try these examples:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['@DestinyTheGame', '@Bungie', 'YRC-C3D-YNC'].map((example) => (
              <code
                key={example}
                className="px-2 py-1 bg-secondary rounded text-foreground/80"
              >
                {example}
              </code>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
