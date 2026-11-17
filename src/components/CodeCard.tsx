import { ExternalLink, Copy, Check } from 'lucide-react';
import { useState, useEffect, useCallback, useRef, memo, type MouseEvent } from 'react';
import { toast } from 'sonner';
import { RedemptionCode } from '@/types/code';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getEmblemIcon, initEmblemDatabase, isDatabaseReady, getEmblemNameByCode } from '@/services/emblemDatabase';

interface CodeCardProps {
  code: RedemptionCode;
  eagerImage?: boolean;
}

const REDEEM_URL = 'https://www.bungie.net/7/en/Codes/Redeem';

const STATUS_LABEL: Record<RedemptionCode['status'], string> = {
  active: 'Active',
  d1: 'Destiny 1',
  expired: 'Expired',
  unknown: 'Unknown',
};

export const CodeCard = memo(function CodeCard({ code, eagerImage = false }: CodeCardProps) {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [emblemImageUrl, setEmblemImageUrl] = useState<string | null>(null);
  const [resolvedEmblemName, setResolvedEmblemName] = useState<string | null>(null);
  const copyResetTimeoutRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    setImageError(false);
    setEmblemImageUrl(null);
    setResolvedEmblemName(null);
  }, [code.code, code.emblemName]);

  useEffect(() => {
    mountedRef.current = true;
    let mounted = true;

    async function loadEmblemImage() {
      if (!isDatabaseReady()) {
        await initEmblemDatabase();
      }

      if (!mounted || !mountedRef.current) return;

      const url = getEmblemIcon(code.code, code.emblemName);
      setEmblemImageUrl(url);

      const nameFromCode = getEmblemNameByCode(code.code);
      setResolvedEmblemName(nameFromCode || code.emblemName || null);
    }

    void loadEmblemImage();

    return () => {
      mounted = false;
      mountedRef.current = false;
      if (copyResetTimeoutRef.current !== null) {
        window.clearTimeout(copyResetTimeoutRef.current);
        copyResetTimeoutRef.current = null;
      }
    };
  }, [code.code, code.emblemName]);

  const copyCodeToClipboard = useCallback(async (sourceElement?: HTMLElement | null) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(code.code);
        return true;
      } catch {
        // Fall through to a browser-compatible fallback.
      }
    }

    const selection = window.getSelection();
    const range = document.createRange();
    const codeEl = sourceElement?.closest('[data-code-card]')?.querySelector('[data-code-display]') as HTMLElement | null;
    if (selection && codeEl) {
      range.selectNodeContents(codeEl);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    try {
      if (document.execCommand('copy')) {
        return true;
      }
    } catch {
      // Ignore and fall through to the textarea fallback.
    }

    const temporaryInput = document.createElement('textarea');
    temporaryInput.value = code.code;
    temporaryInput.setAttribute('readonly', '');
    temporaryInput.style.position = 'fixed';
    temporaryInput.style.left = '-9999px';
    temporaryInput.style.top = '-9999px';
    document.body.appendChild(temporaryInput);
    temporaryInput.select();

    try {
      return document.execCommand('copy');
    } catch {
      return false;
    } finally {
      temporaryInput.remove();
    }
  }, [code.code]);

  const clearCopyResetTimer = useCallback(() => {
    if (copyResetTimeoutRef.current !== null) {
      window.clearTimeout(copyResetTimeoutRef.current);
      copyResetTimeoutRef.current = null;
    }
  }, []);

  const markCopied = useCallback(() => {
    setCopied(true);
    clearCopyResetTimer();
    copyResetTimeoutRef.current = window.setTimeout(() => {
      copyResetTimeoutRef.current = null;
      if (mountedRef.current) {
        setCopied(false);
      }
    }, 1800);
  }, [clearCopyResetTimer]);

  const handleCopy = useCallback(async (e: MouseEvent<HTMLButtonElement>) => {
    const success = await copyCodeToClipboard(e.currentTarget);

    if (success) {
      toast.success('Code copied and ready to redeem');
      markCopied();

      if (typeof navigator !== 'undefined' && 'vibrate' in navigator && navigator.vibrate) {
        navigator.vibrate(50);
      }
      return;
    }

    toast.warning('Clipboard unavailable', {
      description: 'The code is highlighted for manual copying.',
    });
  }, [copyCodeToClipboard, markCopied]);

  const handleRedeemClick = useCallback(async (e: MouseEvent<HTMLAnchorElement>) => {
    // Leave the native <a> navigation alone (middle-click / Ctrl-click / Cmd-click).
    if (e.button === 0 && typeof navigator !== 'undefined' && 'vibrate' in navigator && navigator.vibrate) {
      navigator.vibrate([30, 50, 30]);
    }

    const success = await copyCodeToClipboard(e.currentTarget);

    if (!success) {
      toast.info('Bungie opened. Paste the code manually if needed.');
      return;
    }

    toast.success('Code copied. Bungie opened');
    markCopied();
  }, [copyCodeToClipboard, markCopied]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isExpired = code.status === 'expired';
  const isManual = code.id.startsWith('manual-');
  const canRedeem = !isExpired;
  const name = resolvedEmblemName || code.emblemName;
  const expiresLabel = isExpired ? 'Not available' : code.status === 'unknown' ? 'Not checked' : 'No expiration';

  return (
    <div
      data-code-card
      className="flex flex-col gap-3 bg-background px-4 py-3 sm:flex-row sm:items-center"
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-border bg-secondary">
          {emblemImageUrl && !imageError ? (
            <img
              src={emblemImageUrl}
              alt={code.emblemName || 'Emblem'}
              loading={eagerImage ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={eagerImage ? 'high' : 'auto'}
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">No art</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            {name && <p className="text-base text-foreground">{name}</p>}
            <p className={cn(
              'text-sm',
              code.status === 'active' && 'text-strand',
              code.status === 'd1' && 'text-solar',
              code.status === 'expired' && 'text-stasis',
              code.status === 'unknown' && 'text-muted-foreground'
            )}>
              {STATUS_LABEL[code.status]}
            </p>
          </div>

          <button
            type="button"
            className="code-display mt-1 inline-flex min-h-11 max-w-full items-center whitespace-nowrap text-left text-lg text-foreground"
            data-code-display
            aria-label={`Copy ${code.code}`}
            onClick={handleCopy}
          >
            {code.code}
          </button>

          {code.description && code.description !== name && (
            <p className="mt-1 text-sm text-muted-foreground">{code.description}</p>
          )}
          {code.note && (
            <p className="mt-1 text-sm text-muted-foreground">{code.note}</p>
          )}

          <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <div>
              <dt className="sr-only">Source</dt>
              <dd>{code.source}</dd>
            </div>
            {isManual && (
              <div>
                <dt className="inline">Added </dt>
                <dd className="inline">{formatDate(code.foundAt)}</dd>
              </div>
            )}
            <div>
              <dt className="sr-only">Expires</dt>
              <dd className={isExpired ? 'text-stasis' : 'text-foreground'}>{expiresLabel}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="flex shrink-0 gap-2 sm:flex-col">
        <Button
          type="button"
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className={cn(
            'min-h-11 flex-1 whitespace-nowrap sm:flex-none',
            copied && 'border-strand text-strand'
          )}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" aria-hidden="true" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" aria-hidden="true" />
              Copy
            </>
          )}
        </Button>

        {canRedeem && (
          <Button
            asChild
            variant="solar"
            className="min-h-11 flex-1 whitespace-nowrap text-sm sm:flex-none"
          >
            <a
              href={`${REDEEM_URL}?token=${encodeURIComponent(code.code)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleRedeemClick}
              aria-label={`Copy ${code.code} and redeem on Bungie.net`}
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Copy & Redeem
            </a>
          </Button>
        )}
      </div>
    </div>
  );
});
