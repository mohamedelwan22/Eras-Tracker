import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, Direction, Theme } from '@/lib/types';
import { translations, getDirection, defaultLocale } from '@/lib/i18n';

interface AppContextType {
  // Locale
  locale: Locale;
  setLocale: (locale: Locale) => void;
  direction: Direction;
  t: (key: string, params?: Record<string, string | number>) => string;
  
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  
  // Accent Color
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCALE_STORAGE_KEY = 'erastracker-locale';
const THEME_STORAGE_KEY = 'erastracker-theme';
const ACCENT_STORAGE_KEY = 'erastracker-accent';

export function AppProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage or defaults
  const [locale, setLocaleState] = useState<Locale>(() => {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    return (stored as Locale) || defaultLocale;
  });
  
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) return stored as Theme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  
  const [accentColor, setAccentColorState] = useState(() => {
    return localStorage.getItem(ACCENT_STORAGE_KEY) || '38 92% 50%'; // Default amber
  });

  const direction = getDirection(locale);

  // Update document attributes when locale/theme change
  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = locale;
  }, [locale, direction]);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', accentColor);
    document.documentElement.style.setProperty('--accent', accentColor);
    document.documentElement.style.setProperty('--ring', accentColor);
  }, [accentColor]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const setAccentColor = (color: string) => {
    setAccentColorState(color);
    localStorage.setItem(ACCENT_STORAGE_KEY, color);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const localeTranslations = translations[locale] as Record<string, string>;
    const enTranslations = translations.en as Record<string, string>;
    let text = localeTranslations?.[key] || enTranslations[key] || key;
    
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replace(`{${paramKey}}`, String(value));
      });
    }
    
    return text;
  };

  return (
    <AppContext.Provider
      value={{
        locale,
        setLocale,
        direction,
        t,
        theme,
        setTheme,
        toggleTheme,
        accentColor,
        setAccentColor,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export function useTranslation() {
  const { t, locale, direction } = useApp();
  return { t, locale, direction };
}

export function useTheme() {
  const { theme, setTheme, toggleTheme, accentColor, setAccentColor } = useApp();
  return { theme, setTheme, toggleTheme, accentColor, setAccentColor };
}
