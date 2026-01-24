import { Sparkles, ChevronRight } from 'lucide-react';
import { RedemptionCode } from '@/types/code';
import { CodeCard } from './CodeCard';

interface NewTodaySectionProps {
  codes: RedemptionCode[];
}

export function NewTodaySection({ codes }: NewTodaySectionProps) {
  if (codes.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="w-5 h-5" />
          <h2 className="font-heading text-lg font-semibold">New Today</h2>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {codes.length} {codes.length === 1 ? 'code' : 'codes'}
        </span>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {codes.map((code) => (
          <CodeCard key={code.id} code={code} />
        ))}
      </div>
    </section>
  );
}
