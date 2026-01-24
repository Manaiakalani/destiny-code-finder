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
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const isActive = code.status === 'active';

  return (
    <div
      className={cn(
        "hover-glow p-5 relative overflow-hidden group",
        isActive ? "glass-card-highlight" : "glass-card",
        code.status === 'expired' && "opacity-60"
      )}
    >
      {/* New badge */}
      {code.isNew && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30">
          <Sparkles className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">New</span>
        </div>
      )}
      
      <div className="space-y-4">
        {/* Code display */}
        <div className="flex items-center justify-between gap-4">
          <span className={cn(
            "code-text text-xl md:text-2xl",
            isActive ? "text-foreground" : "text-muted-foreground"
          )}>
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
          <p className={cn(
            "text-sm",
            isActive ? "text-foreground/80" : "text-muted-foreground"
          )}>
            {code.description}
          </p>
        )}
        
        {/* Meta row */}
        <div className="flex items-center justify-between gap-4 pt-2 border-t border-border/30">
          <div className="flex items-center gap-3">
            {/* Status badge */}
            <span
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                code.status === 'active' && "status-active",
                code.status === 'expired' && "status-expired",
                code.status === 'unknown' && "status-unknown"
              )}
            >
              {code.status}
            </span>
            
            {/* Source */}
            <span className="text-xs text-muted-foreground truncate max-w-[100px]">
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
        {isActive && (
          <Button
            onClick={handleRedeem}
            variant="outline"
            size="sm"
            className="w-full border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 font-heading tracking-wider"
          >
            <ExternalLink className="w-3 h-3 mr-2" />
            Redeem
          </Button>
        )}
      </div>
    </div>
  );
}
