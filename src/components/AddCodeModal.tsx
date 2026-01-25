import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { RedemptionCode } from '@/types/code';

interface AddCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: RedemptionCode) => void;
}

export function AddCodeModal({ isOpen, onClose, onSubmit }: AddCodeModalProps) {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate code format (XXX-XXX-XXX)
    const codePattern = /^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}$/i;
    if (!codePattern.test(code.trim())) {
      toast.error('Invalid code format. Use XXX-XXX-XXX');
      return;
    }

    // Create redemption code object
    const redemptionCode: RedemptionCode = {
      id: `manual-${Date.now()}`,
      code: code.trim(),
      status: 'unknown',
      source: 'Manual Entry',
      foundAt: new Date(),
      description: 'Manually added code',
      isNew: true
    };

    onSubmit(redemptionCode);
    toast.success('Code added successfully');
    setCode('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-border/50 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl tracking-wider">Submit a Code</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              Enter a Destiny 2 redemption code
            </label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="XXX-XXX-XXX"
              className="font-heading text-lg tracking-widest text-center bg-secondary/50 border-border/50"
              maxLength={11}
            />
            <p className="text-xs text-muted-foreground text-center">
              Format: 3 characters, dash, 3 characters, dash, 3 characters
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 font-heading tracking-wider"
              disabled={code.length !== 11}
            >
              Add Code
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
