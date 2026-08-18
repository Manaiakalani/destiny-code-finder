import { memo } from 'react';
import { RedemptionCode } from '@/types/code';
import { CodeCard } from './CodeCard';

interface CodeGridProps {
  codes: RedemptionCode[];
  isLoading: boolean;
}

export const CodeGrid = memo(function CodeGrid({ codes, isLoading }: CodeGridProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20" role="status" aria-live="polite">
        <div className="orbit-loader mb-4" aria-hidden="true" />
        <p className="text-sm text-muted-foreground font-heading tracking-wider">
          SCANNING THE VAULT...
        </p>
      </div>
    );
  }

  if (codes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
          <span className="text-2xl">🔍</span>
        </div>
        <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
          No codes found
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Try adjusting your filters or search query.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Destiny redemption codes">
      {codes.map((code, index) => (
        <div
          key={code.id}
          role="listitem"
          className="animate-fade-in [content-visibility:auto] [contain-intrinsic-size:auto_28rem]"
          style={{ animationDelay: `${Math.min(index, 12) * 50}ms`, animationFillMode: 'backwards' }}
        >
          <CodeCard code={code} />
        </div>
      ))}
    </div>
  );
});
