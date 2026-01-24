import { RedemptionCode } from '@/types/code';
import { CodeCard } from './CodeCard';
import { Loader2 } from 'lucide-react';

interface CodeGridProps {
  codes: RedemptionCode[];
  isLoading: boolean;
}

export function CodeGrid({ codes, isLoading }: CodeGridProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-sm text-muted-foreground font-heading tracking-wider">
          LOADING CODES...
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {codes.map((code, index) => (
        <div
          key={code.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <CodeCard code={code} />
        </div>
      ))}
    </div>
  );
}
