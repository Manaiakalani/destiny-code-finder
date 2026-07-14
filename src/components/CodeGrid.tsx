import { RedemptionCode } from '@/types/code';
import { type AddCodeResult } from '@/hooks/useCodeScanner';
import { CodeCard } from './CodeCard';
import { EmptyState } from './EmptyState';

interface CodeGridProps {
  codes: RedemptionCode[];
  onReset: () => void;
  onRemovePin: (code: string) => AddCodeResult;
}

export function CodeGrid({ codes, onReset, onRemovePin }: CodeGridProps) {
  if (codes.length === 0) return <EmptyState onReset={onReset} />;

  return (
    <div className="grid min-h-[22rem] gap-3 xl:grid-cols-2">
      {codes.map(code => (
        <CodeCard key={code.id} code={code} onRemovePin={onRemovePin} />
      ))}
    </div>
  );
}
