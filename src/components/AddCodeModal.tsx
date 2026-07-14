import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { type AddCodeResult } from '@/hooks/useCodeScanner';
import { verifyCodeFormat } from '@/services/codeCatalogService';

interface AddCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: string) => AddCodeResult;
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
    if (!verifyCodeFormat(trimmedCode)) {
      setValidationError('Use Bungie format XXX-XXX-XXX with supported characters.');
      inputRef.current?.focus();
      return;
    }

    const result = onSubmit(trimmedCode);
    if (!result.success) {
      setValidationError(result.message);
      inputRef.current?.focus();
      return;
    }

    toast.success(result.message);
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

  const isSubmitDisabled = code.trim().length < 11;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="glass-card border-border sm:max-w-md w-[calc(100%-2rem)]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Pin a code</DialogTitle>
          <DialogDescription>
            Save a code in this browser so you can copy or check it on Bungie.net. Pins are not submitted publicly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="code-input" className="text-sm text-muted-foreground">
              Destiny redemption code
            </label>
            <Input
              ref={inputRef}
              id="code-input"
              value={code}
              onChange={handleCodeChange}
              placeholder="XXX-XXX-XXX"
              className="min-h-[44px] font-mono text-lg tracking-widest text-center bg-secondary border-border"
              maxLength={17}
              spellCheck={false}
              autoComplete="off"
              aria-invalid={Boolean(validationError)}
              aria-describedby={validationError ? 'code-validation-error' : 'code-format-help'}
            />
            {validationError ? (
              <p id="code-validation-error" className="text-sm text-destructive" role="alert" aria-live="assertive">
                {validationError}
              </p>
            ) : (
              <p id="code-format-help" className="text-xs text-muted-foreground text-center">
                Format: XXX-XXX-XXX. Format checks do not confirm redemption.
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
              className="flex-1 min-h-[44px] font-semibold"
              disabled={isSubmitDisabled}
            >
              Pin code
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
