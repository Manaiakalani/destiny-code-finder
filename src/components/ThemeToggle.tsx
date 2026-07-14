import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/theme';

const LABELS = {
  light: 'Light',
  dark: 'Dark',
  oled: 'OLED',
} as const;

const NEXT_LABELS = {
  light: 'Dark',
  dark: 'OLED',
  oled: 'Light',
} as const;

export function ThemeToggle() {
  const { theme, cycleTheme } = useTheme();
  const label = LABELS[theme];

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={cycleTheme}
      className={cn(
        'min-h-11 min-w-11 gap-2 px-3 text-sm text-muted-foreground hover:text-foreground',
        theme === 'oled' && 'text-accent',
      )}
      aria-label={`${label} theme active. Switch to ${NEXT_LABELS[theme]} theme.`}
      title={`${label} theme`}
    >
      {theme === 'light' ? (
        <Sun className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Moon className={cn('h-4 w-4', theme === 'oled' && 'fill-current')} aria-hidden="true" />
      )}
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}
