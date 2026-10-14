import React, { createContext, useContext, useState, useEffect } from 'react';

type ColorTheme = 'blue' | 'emerald' | 'violet' | 'rose';
type Mode = 'light' | 'dark';

interface ThemeContextType {
  colorTheme: ColorTheme;
  mode: Mode;
  setColorTheme: (theme: ColorTheme) => void;
  setMode: (mode: Mode) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    return (localStorage.getItem('colorTheme') as ColorTheme) || 'blue';
  });
  
  const [mode, setMode] = useState<Mode>(() => {
    return (localStorage.getItem('mode') as Mode) || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove old themes
    root.classList.remove('theme-blue', 'theme-emerald', 'theme-violet', 'theme-rose');
    // Add new theme
    root.classList.add(`theme-${colorTheme}`);
    localStorage.setItem('colorTheme', colorTheme);

    // Toggle dark mode
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('mode', mode);
  }, [colorTheme, mode]);

  return (
    <ThemeContext.Provider value={{ colorTheme, mode, setColorTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
