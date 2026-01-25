import { useState, useEffect } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Theme = 'light' | 'dark' | 'oled';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light-mode', 'oled-mode');
    
    // Apply the appropriate class
    if (theme === 'light') {
      root.classList.add('light-mode');
    } else if (theme === 'oled') {
      root.classList.add('oled-mode');
    }
    // 'dark' is the default, no class needed
    
    localStorage.setItem('theme', theme);
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
        "gap-1.5 h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors btn-haptic",
        theme === 'oled' && "text-accent",
        theme === 'light' && "text-solar"
      )}
      title={`Current: ${getLabel()} mode. Click to cycle.`}
    >
      {getIcon()}
      <span className="hidden sm:inline font-medium">{getLabel()}</span>
    </Button>
  );
}
