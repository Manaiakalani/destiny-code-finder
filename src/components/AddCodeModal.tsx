import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { RedemptionCode } from '@/types/code';

interface AddCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: RedemptionCode) => { success: boolean; message: string } | void;
}

export function AddCodeModal({ isOpen, onClose, onSubmit }: AddCodeModalProps) {
  const [code, setCode] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      const resetTimer = window.setTimeout(() => {
        setCode('');
        setValidationError(null);
      }, 0);
      return () => window.clearTimeout(resetTimer);
    }

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(focusTimer);
  }, [isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const trimmedCode = code.trim();
    const codePattern = /^[ACDFGHJKLMNPRTVXY34679]{3}-[ACDFGHJKLMNPRTVXY34679]{3}-[ACDFGHJKLMNPRTVXY34679]{3}$/i;

    if (!codePattern.test(trimmedCode)) {
      setValidationError('Use format XXX-XXX-XXX (Bungie charset only)');
      return;
    }

    const redemptionCode: RedemptionCode = {
      id: `manual-${Date.now()}`,
      code: trimmedCode.toUpperCase(),
      status: 'unknown',
      source: 'Manual Entry',
      foundAt: new Date(),
      description: 'Manually added code',
      isNew: true
    };

    const result = onSubmit(redemptionCode);
    if (result && !result.success) {
      setValidationError(result.message);
      return;
    }
    toast.success('Code added and pinned to the top');
    setCode('');
    setValidationError(null);
    onClose();
  };

  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value.toUpperCase();
    setCode(nextValue);
    if (validationError) {
      setValidationError(null);
    }
  };

  const isSubmitDisabled = code.trim().length !== 11;

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="glass-card border-border/50 sm:max-w-md w-[calc(100%-1rem)]">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl tracking-wider">Submit a Code</DialogTitle>
          <DialogDescription>
            Share a code you found in-game, in a community post, or from a friend.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="code-input" className="text-sm text-muted-foreground">
              Enter a Destiny 2 redemption code
            </label>
            <Input
              ref={inputRef}
              id="code-input"
              value={code}
              onChange={handleCodeChange}
              placeholder="XXX-XXX-XXX"
              className="min-h-[44px] font-heading text-lg tracking-widest text-center bg-secondary/50 border-border/50"
              maxLength={11}
              spellCheck={false}
              autoComplete="off"
              aria-invalid={Boolean(validationError)}
              aria-describedby={validationError ? 'code-validation-error' : 'code-format-help'}
            />
            {validationError ? (
              <p id="code-validation-error" className="text-sm text-destructive">
                {validationError}
              </p>
            ) : (
              <p id="code-format-help" className="text-xs text-muted-foreground text-center">
                Format: XXX-XXX-XXX (Bungie charset)
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1 min-h-[44px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 min-h-[44px] font-heading tracking-wider"
              disabled={isSubmitDisabled}
            >
              Add Code
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
