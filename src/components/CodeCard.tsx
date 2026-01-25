import { ExternalLink, Copy, Check, Clock, Sparkles } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { RedemptionCode } from '@/types/code';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getEmblemIcon, initEmblemDatabase, isDatabaseReady, getEmblemNameByCode } from '@/services/emblemDatabase';

interface CodeCardProps {
  code: RedemptionCode;
}

const REDEEM_URL = 'https://www.bungie.net/7/en/Codes/Redeem';

// Confetti celebration for copy success
function createConfetti(x: number, y: number) {
  const colors = ['#FFD700', '#7C3AED', '#22D3EE', '#F97316', '#10B981'];
  const confettiCount = 12;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = `${x}px`;
    confetti.style.top = `${y}px`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.animation = `confetti-fall ${1 + Math.random()}s ease-out forwards`;
    confetti.style.setProperty('--x', `${(Math.random() - 0.5) * 200}px`);
    
    document.body.appendChild(confetti);
    
    // Clean up after animation
    setTimeout(() => confetti.remove(), 1500);
  }
}

export function CodeCard({ code }: CodeCardProps) {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [emblemImageUrl, setEmblemImageUrl] = useState<string | null>(null);
  const [resolvedEmblemName, setResolvedEmblemName] = useState<string | null>(null);

  // Load emblem image URL when database is ready - try by CODE first, then by name
  useEffect(() => {
    let mounted = true;
    
    async function loadEmblemImage() {
      // Ensure database is loaded
      if (!isDatabaseReady()) {
        await initEmblemDatabase();
      }
      
      if (!mounted) return;
      
      // Try to get emblem by code first (most reliable)
      const url = getEmblemIcon(code.code, code.emblemName);
      setEmblemImageUrl(url);
      
      // Also resolve the proper emblem name from code
      const nameFromCode = getEmblemNameByCode(code.code);
      setResolvedEmblemName(nameFromCode || code.emblemName || null);
    }
    
    loadEmblemImage();
    
    return () => { mounted = false; };
  }, [code.code, code.emblemName]);

  const handleCopy = useCallback(async (e: React.MouseEvent) => {
    await navigator.clipboard.writeText(code.code);
    setCopied(true);
    
    // Create confetti at click position
    createConfetti(e.clientX, e.clientY);
    
    // Haptic feedback for supported devices
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    setTimeout(() => setCopied(false), 2000);
  }, [code.code]);

  const handleRedeem = () => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([30, 50, 30]);
    }
    window.open(`${REDEEM_URL}?token=${code.code}`, '_blank');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isActive = code.status === 'active';

  // Determine rarity class based on emblem name keywords
  const getRarityClass = () => {
    const name = (resolvedEmblemName || code.emblemName || '').toLowerCase();
    if (name.includes('exotic') || name.includes('gilded') || name.includes('flawless')) {
      return 'rarity-exotic';
    }
    if (name.includes('raid') || name.includes('triumph') || name.includes('seal')) {
      return 'rarity-legendary';
    }
    return '';
  };

  return (
    <div
      className={cn(
        "group relative rounded-xl overflow-hidden transition-all duration-300 border h-full flex flex-col destiny-border",
        isActive 
          ? "bg-gradient-to-b from-[#1c1f26] to-[#14171c] border-[#2d323b] hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10" 
          : "bg-[#1a1d24]/50 border-[#2a2f3a]/40 opacity-60",
        "hover:-translate-y-1"
      )}
    >
      {/* Top accent glow */}
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
      )}
      
      <div className="relative p-4 space-y-3 flex-1 flex flex-col">
        {/* Header: Active badge only */}
        <div className="flex items-center justify-end">
          {/* Active badge - enhanced with pulse */}
          {isActive && (
            <div className="badge-pulse-active flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-strand/15 border border-strand/25">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-strand opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-strand"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-strand">Active</span>
            </div>
          )}
        </div>

        {/* Code display with emblem */}
        <div className="text-center py-2 flex flex-col items-center">
          {/* Emblem image with rarity glow */}
          <div className={cn(
            "relative w-16 h-16 mb-3 rounded-lg overflow-hidden bg-gradient-to-br from-[#252a35] to-[#1a1e25] border border-[#3a4050]/50 shadow-lg transition-all duration-300",
            getRarityClass()
          )}>
            {emblemImageUrl && !imageError ? (
              <img 
                src={emblemImageUrl} 
                alt={code.emblemName || 'Emblem'}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-accent/5">
                <Sparkles className="w-7 h-7 text-accent/60" />
              </div>
            )}
            {/* Enhanced shine effect on hover */}
            <div className="emblem-shine" />
          </div>
          
          <h3 
            className="code-display glitch-text text-2xl md:text-3xl font-bold text-foreground mb-1.5 select-all cursor-pointer hover:text-accent transition-colors"
            data-text={code.code}
          >
            {code.code}
          </h3>
          {(resolvedEmblemName || code.emblemName) && (
            <p className="text-sm text-muted-foreground/70 font-medium">
              {resolvedEmblemName || code.emblemName}
            </p>
          )}
        </div>

        {/* Info section */}
        <div className="space-y-1.5 pt-2 border-t border-[#2a2f3a]/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground/50">Source</span>
            <span className="text-muted-foreground font-medium">{code.source}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground/50">Found</span>
            <span className="text-muted-foreground font-medium">{formatDate(code.foundAt)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground/50 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Expires
            </span>
            <span className="text-strand font-medium">No expiration</span>
          </div>
        </div>

        {/* Action buttons with haptic feedback */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className={cn(
              "flex-1 font-semibold transition-all duration-200 h-10 text-sm btn-haptic",
              copied 
                ? "border-strand/40 text-strand bg-strand/10 copy-success" 
                : "border-[#3a4050] text-muted-foreground hover:border-accent/50 hover:text-foreground hover:bg-accent/10"
            )}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </>
            )}
          </Button>
          
          {isActive && (
            <Button
              onClick={handleRedeem}
              size="sm"
              className="flex-1 h-10 text-sm bg-gradient-to-r from-solar via-solar-accent to-solar hover:brightness-110 text-white font-bold shadow-lg shadow-solar/30 transition-all duration-200 btn-haptic"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Redeem
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
