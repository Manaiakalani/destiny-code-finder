import { Check, Copy, ExternalLink, Pin, PinOff, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { RedemptionCode } from '@/types/code';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  getEmblemIcon,
  getEmblemNameByCode,
  initEmblemDatabase,
  isDatabaseReady,
} from '@/services/emblemDatabase';
import { type AddCodeResult } from '@/hooks/useCodeScanner';

interface CodeCardProps {
  code: RedemptionCode;
  onRemovePin: (code: string) => AddCodeResult;
}

const REDEEM_URL = 'https://www.bungie.net/7/en/Codes/Redeem';

const STATUS_DETAILS: Record<RedemptionCode['status'], { label: string; className: string }> = {
  redeemable: {
    label: 'Redeemable',
    className: 'border-strand/40 bg-strand/10 text-strand',
  },
  d1: {
    label: 'Destiny 1',
    className: 'border-solar/40 bg-solar/10 text-solar',
  },
  restricted: {
    label: 'Restricted',
    className: 'border-border bg-secondary text-muted-foreground',
  },
  pinned: {
    label: 'Unverified pin',
    className: 'border-accent/40 bg-accent/10 text-accent',
  },
};

export function CodeCard({ code, onRemovePin }: CodeCardProps) {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [emblemImageUrl, setEmblemImageUrl] = useState<string | null>(null);
  const [resolvedEmblemName, setResolvedEmblemName] = useState<string | null>(null);
  const status = STATUS_DETAILS[code.status];

  useEffect(() => {
    let mounted = true;

    async function loadEmblemImage() {
      if (!isDatabaseReady()) await initEmblemDatabase();
      if (!mounted) return;
      setEmblemImageUrl(getEmblemIcon(code.code, code.emblemName));
      setResolvedEmblemName(getEmblemNameByCode(code.code) || code.emblemName || null);
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
      const codeElement = sourceElement
        ?.closest('[data-code-card]')
        ?.querySelector('[data-code-display]');
      if (selection && codeElement) {
        const range = document.createRange();
        range.selectNodeContents(codeElement);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      return false;
    }
  }, [code.code]);

  const handleCopy = useCallback(async (sourceElement?: HTMLElement | null) => {
    const success = await copyCodeToClipboard(sourceElement);
    if (!success) {
      toast.warning('Clipboard unavailable', {
        description: 'The code is selected so you can copy it manually.',
      });
      return;
    }

    setCopied(true);
    toast.success('Code copied');
    window.setTimeout(() => setCopied(false), 1600);
  }, [copyCodeToClipboard]);

  const handleRedeemClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    void copyCodeToClipboard(event.currentTarget).then(success => {
      if (success) toast.success('Code copied - paste it on Bungie.net');
    });
  }, [copyCodeToClipboard]);

  const handleRemovePin = () => {
    const result = onRemovePin(code.code);
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
  };

  const displayName = resolvedEmblemName || code.emblemName || 'Pinned code';

  return (
    <article
      data-code-card
      className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent/50"
    >
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-border bg-secondary">
          {emblemImageUrl && !imageError ? (
            <img
              src={emblemImageUrl}
              alt={`${displayName} reward icon`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-accent">
              <Sparkles className="h-6 w-6" aria-hidden="true" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-foreground">{displayName}</h3>
              {code.description && code.description !== displayName && (
                <p className="mt-0.5 text-sm text-muted-foreground">{code.description}</p>
              )}
            </div>
            <span className={cn(
              'inline-flex min-h-7 shrink-0 items-center rounded-full border px-2.5 text-xs font-semibold',
              status.className,
            )}>
              {status.label}
            </span>
          </div>

          <button
            type="button"
            data-code-display
            onClick={(event) => void handleCopy(event.currentTarget)}
            className="mt-3 inline-flex min-h-11 max-w-full items-center rounded-md font-mono text-xl font-semibold tracking-[0.08em] text-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Copy code ${code.code}`}
          >
            {code.code}
          </button>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span>{code.source}</span>
            {code.isPinned && (
              <span className="inline-flex items-center gap-1">
                <Pin className="h-3.5 w-3.5" aria-hidden="true" />
                Pinned on this device
              </span>
            )}
          </div>

          {code.note && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{code.note}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3">
        <Button
          type="button"
          variant="outline"
          onClick={(event) => void handleCopy(event.currentTarget)}
          className="min-h-11 flex-1"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy code'}
        </Button>
        <a
          href={REDEEM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleRedeemClick}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-solar px-4 text-sm font-semibold text-solar-foreground transition-colors hover:bg-solar/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Redeem
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
        {code.isPinned && (
          <button
            type="button"
            onClick={handleRemovePin}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label={`Remove pin for ${code.code}`}
          >
            <PinOff className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </article>
  );
}
