import { createContext, useContext } from 'react';

export type Theme = 'light' | 'dark' | 'oled';

export interface ThemeContextValue {
  theme: Theme;
  cycleTheme: () => void;
  sonnerTheme: 'light' | 'dark';
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
