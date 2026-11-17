import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Theme = 'light' | 'dark' | 'oled';

function readStoredTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  try {
    const storedTheme = window.localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'oled') {
      return storedTheme;
    }
  } catch {
    // localStorage unavailable (private browsing)
  }

  return 'dark';
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme());

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove('light-mode', 'oled-mode');

    if (theme === 'light') {
      root.classList.add('light-mode');
    } else if (theme === 'oled') {
      root.classList.add('oled-mode');
    }

    try {
      window.localStorage.setItem('theme', theme);
    } catch {
      // private browsing / storage quota
    }
  }, [theme]);

  const cycleTheme = () => {
    setTheme(current => {
      if (current === 'dark') return 'oled';
      if (current === 'oled') return 'light';
      return 'dark';
    });
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4" />;
      case 'oled':
        return <Moon className="w-4 h-4 fill-current" />;
      default:
        return <Moon className="w-4 h-4" />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'oled':
        return 'OLED';
      default:
        return 'Dark';
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycleTheme}
      className={cn(
        'gap-1.5 h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors btn-haptic',
        theme === 'oled' && 'text-accent',
        theme === 'light' && 'text-solar'
      )}
      title={`Current: ${getLabel()} mode. Click to cycle.`}
    >
      {getIcon()}
      <span className="hidden sm:inline font-medium">{getLabel()}</span>
    </Button>
  );
}
