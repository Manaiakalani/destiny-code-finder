import { ExternalLink, Copy, Check, Clock, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { RedemptionCode } from '@/types/code';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CodeCardProps {
  code: RedemptionCode;
}

const REDEEM_URL = 'https://www.bungie.net/7/en/Codes/Redeem';

export function CodeCard({ code }: CodeCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRedeem = () => {
    window.open(`${REDEEM_URL}?token=${code.code}`, '_blank');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  return (
    <div
      className={cn(
        "glass-card hover-lift p-5 relative overflow-hidden group",
        code.isNew && "gradient-border"
      )}
    >
      {/* New badge */}
      {code.isNew && (
        <div className="absolute top-3 right-3 flex items-center gap-1 text-xs text-primary font-medium">
          <Sparkles className="w-3 h-3" />
          NEW
        </div>
      )}
      
      {/* Status indicator glow */}
      <div
        className={cn(
          "absolute inset-0 opacity-5 pointer-events-none transition-opacity group-hover:opacity-10",
          code.status === 'active' && "bg-gradient-to-br from-success to-transparent",
          code.status === 'expired' && "bg-gradient-to-br from-destructive to-transparent",
          code.status === 'unknown' && "bg-gradient-to-br from-muted-foreground to-transparent"
        )}
      />
      
      <div className="relative space-y-4">
        {/* Code display */}
        <div className="flex items-center justify-between gap-4">
          <span className="code-text text-2xl text-foreground tracking-widest">
            {code.code}
          </span>
          <button
            onClick={handleCopy}
            className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            title="Copy code"
          >
            {copied ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
        
        {/* Description */}
        {code.description && (
          <p className="text-sm text-muted-foreground">{code.description}</p>
        )}
        
        {/* Status and meta */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Status badge */}
            <span
              className={cn(
                "px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wide",
                code.status === 'active' && "status-active",
                code.status === 'expired' && "status-expired",
                code.status === 'unknown' && "status-unknown"
              )}
            >
              {code.status}
            </span>
            
            {/* Source */}
            <span className="text-xs text-muted-foreground">
              {code.source}
            </span>
          </div>
          
          {/* Time */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {formatTime(code.foundAt)}
          </div>
        </div>
        
        {/* Redeem button */}
        <Button
          onClick={handleRedeem}
          variant="default"
          className={cn(
            "w-full mt-2 font-heading font-semibold tracking-wide",
            code.status === 'expired' && "opacity-50"
          )}
          disabled={code.status === 'expired'}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Redeem on Bungie.net
        </Button>
      </div>
    </div>
  );
}
