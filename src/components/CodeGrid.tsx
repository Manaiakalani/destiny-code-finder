import { memo } from 'react';
import { RedemptionCode } from '@/types/code';
import { CodeCard } from './CodeCard';

interface CodeGridProps {
  codes: RedemptionCode[];
  isLoading: boolean;
}

export const CodeGrid = memo(function CodeGrid({ codes, isLoading }: CodeGridProps) {
  if (isLoading && codes.length === 0) {
    return (
      <div className="flex flex-col items-start py-10" role="status" aria-live="polite">
        <p className="text-sm text-muted-foreground">Loading codes</p>
      </div>
    );
  }

  if (codes.length === 0) {
    return (
      <div className="py-10">
        <h3 className="text-lg text-foreground">No codes found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try another filter or search.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border border-y border-border" role="list" aria-label="Destiny redemption codes">
      {codes.map((code, index) => (
        <div key={code.id} role="listitem">
          <CodeCard code={code} eagerImage={index === 0} />
        </div>
      ))}
    </div>
  );
});
