import { ExternalLink, Copy, Check, Clock, Sparkles } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { RedemptionCode } from '@/types/code';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getEmblemIcon, initEmblemDatabase, isDatabaseReady, getEmblemNameByCode } from '@/services/emblemDatabase';

interface CodeCardProps {
  code: RedemptionCode;
}

const REDEEM_URL = 'https://www.bungie.net/7/en/Codes/Redeem';

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
    setTimeout(() => confetti.remove(), 1500);
  }
}

export function CodeCard({ code }: CodeCardProps) {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [emblemImageUrl, setEmblemImageUrl] = useState<string | null>(null);
  const [resolvedEmblemName, setResolvedEmblemName] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadEmblemImage() {
      if (!isDatabaseReady()) {
        await initEmblemDatabase();
      }

      if (!mounted) return;

      const url = getEmblemIcon(code.code, code.emblemName);
      setEmblemImageUrl(url);

      const nameFromCode = getEmblemNameByCode(code.code);
      setResolvedEmblemName(nameFromCode || code.emblemName || null);
    }

    void loadEmblemImage();

    return () => { mounted = false; };
  }, [code.code, code.emblemName]);

  const copyCodeToClipboard = useCallback(async (sourceElement?: HTMLElement | null) => {
    try {
      await navigator.clipboard.writeText(code.code);
      return true;
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      const codeEl = sourceElement?.closest('[data-code-card]')?.querySelector('[data-code-display]') as HTMLElement | null;
      if (selection && codeEl) {
        range.selectNodeContents(codeEl);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      return false;
    }
  }, [code.code]);

  const handleCopy = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    const success = await copyCodeToClipboard(e.currentTarget);

    if (success) {
      toast.success('Code copied and ready to redeem');
    } else {
      toast.warning('Clipboard unavailable', {
        description: 'The code is highlighted for manual copying.'
      });
    }

    setCopied(true);
    createConfetti(e.clientX, e.clientY);

    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    window.setTimeout(() => setCopied(false), 1800);
  }, [copyCodeToClipboard]);

  const handleRedeemClick = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (e.button === 0 && navigator.vibrate) {
      navigator.vibrate([30, 50, 30]);
    }

    const success = await copyCodeToClipboard(e.currentTarget);
    window.open(`${REDEEM_URL}?token=${code.code}`, '_blank', 'noopener,noreferrer');

    setCopied(true);
    if (success) {
      toast.success('Code copied — Bungie opened');
    } else {
      toast.info('Bungie opened — paste the code manually if needed.');
    }

    window.setTimeout(() => setCopied(false), 2000);
  }, [code.code, copyCodeToClipboard]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isActive = code.status === 'active';
  const isD1 = code.status === 'd1';
  const isExpired = code.status === 'expired';

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
      data-code-card
      className={cn(
        'group relative rounded-xl overflow-hidden transition-[transform,box-shadow,border-color,background-color,opacity] duration-200 ease-out border h-full flex flex-col destiny-border destiny-item-card',
        isActive
          ? 'bg-card border-border hover:border-accent/50 hover:drop-shadow-[0_8px_24px_hsl(var(--accent)/0.15)] shadow-sm'
          : isD1
            ? 'bg-card border-solar/30 hover:border-solar/50 hover:drop-shadow-[0_8px_24px_hsl(var(--solar)/0.15)] shadow-sm'
            : 'bg-muted/50 border-border/40 opacity-60',
        'hover:-translate-y-1'
      )}
    >
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
      )}
      {isD1 && (
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-solar/5 to-transparent pointer-events-none" />
      )}

      <div className="relative p-4 space-y-3 flex-1 flex flex-col">
        <div className="flex items-center justify-end">
          {isActive && (
            <div className="badge-pulse-active flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-strand/15 border border-strand/25">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-strand opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-strand"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-strand">Active</span>
            </div>
          )}
          {isD1 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-solar/15 border border-solar/25">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-solar"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-solar">Destiny 1</span>
            </div>
          )}
          {isExpired && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stasis/15 border border-stasis/25">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-stasis"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stasis">Expired</span>
            </div>
          )}
        </div>

        <div className="text-center py-2 flex flex-col items-center">
          <div className={cn(
            'relative w-16 h-16 mb-3 rounded-lg overflow-hidden bg-secondary border border-border/50 shadow-md transition-transform duration-300',
            getRarityClass()
          )}>
            {emblemImageUrl && !imageError ? (
              <img
                src={emblemImageUrl}
                alt={code.emblemName || 'Emblem'}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-accent/5">
                <Sparkles className="w-7 h-7 text-accent/60" />
              </div>
            )}
            <div className="emblem-shine" />
          </div>

          <button
            type="button"
            className="code-display glitch-text text-2xl md:text-3xl font-bold text-foreground mb-1.5 select-all cursor-pointer hover:text-accent transition-colors"
            data-code-display
            data-text={code.code}
            aria-label={`Copy ${code.code}`}
            onClick={handleCopy}
          >
            {code.code}
          </button>
          {(resolvedEmblemName || code.emblemName) && (
            <p className="text-sm text-muted-foreground/70 font-medium">
              {resolvedEmblemName || code.emblemName}
            </p>
          )}
          {code.note && (
            <p className="text-xs text-stasis/70 italic mt-1 px-2">
              {code.note}
            </p>
          )}
        </div>

        <div className="space-y-1.5 pt-2 border-t border-border/50">
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
            <span className={cn(
              'font-medium',
              isExpired ? 'text-stasis' : 'text-strand'
            )}>
              {isExpired ? 'Not available' : 'No expiration'}
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className={cn(
              'flex-1 min-h-[44px] h-11 font-semibold transition-[transform,background-color,color,border-color,box-shadow] duration-200 ease-out text-sm btn-haptic',
              copied
                ? 'border-strand/40 text-strand bg-strand/10 copy-success'
                : 'border-border text-muted-foreground hover:border-accent/50 hover:text-foreground hover:bg-accent/10'
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

          {(isActive || isD1) && (
            <Button
              type="button"
              onClick={handleRedeemClick}
              className="flex-1 min-h-[44px] h-11 text-sm bg-gradient-to-r from-solar via-solar-accent to-solar hover:brightness-110 text-white font-bold shadow-lg shadow-solar/30 transition-[transform,filter,box-shadow,background-color] duration-200 ease-out btn-haptic"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Copy & Redeem
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
