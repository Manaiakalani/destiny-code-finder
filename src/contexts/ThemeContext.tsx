import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ThemeContext, type Theme, type ThemeContextValue } from './theme';

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark' || stored === 'oled') return stored;
  } catch {
    // Storage may be unavailable in private browsing.
  }
  return 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light-mode', 'oled-mode');
    if (theme === 'light') root.classList.add('light-mode');
    if (theme === 'oled') root.classList.add('oled-mode');
    root.style.colorScheme = theme === 'light' ? 'light' : 'dark';

    try {
      localStorage.setItem('theme', theme);
    } catch {
      // The selected theme still applies for this session.
    }
  }, [theme]);

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    sonnerTheme: theme === 'light' ? 'light' : 'dark',
    cycleTheme: () => setTheme(current => {
      if (current === 'dark') return 'oled';
      if (current === 'oled') return 'light';
      return 'dark';
    }),
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
