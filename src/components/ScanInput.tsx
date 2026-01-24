import { useState } from 'react';
import { Search, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ScanInputProps {
  onScan: (input: string) => Promise<number>;
  isScanning: boolean;
}

export function ScanInput({ onScan, isScanning }: ScanInputProps) {
  const [input, setInput] = useState('');
  const [lastResult, setLastResult] = useState<number | null>(null);

  const handleScan = async () => {
    if (!input.trim() || isScanning) return;
    const found = await onScan(input);
    setLastResult(found);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleScan();
    }
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Paste Twitter usernames, URLs, or enter codes directly
        </label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="@DestinyTheGame&#10;@Bungie&#10;https://twitter.com/DestinyTheGame&#10;YRC-C3D-YNC"
          className="min-h-[120px] bg-secondary/50 border-border/50 resize-none font-body text-foreground placeholder:text-muted-foreground/50"
          disabled={isScanning}
        />
      </div>
      
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          Tip: Press <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px] font-mono">⌘ Enter</kbd> to scan
        </p>
        
        <div className="flex items-center gap-3">
          {lastResult !== null && !isScanning && (
            <span className="text-sm text-muted-foreground animate-fade-in">
              Found {lastResult} new {lastResult === 1 ? 'code' : 'codes'}
            </span>
          )}
          
          <Button
            onClick={handleScan}
            disabled={!input.trim() || isScanning}
            className={cn(
              "min-w-[140px] font-heading font-semibold tracking-wide",
              isScanning && "scan-pulse"
            )}
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Scan Sources
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
