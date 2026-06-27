// ThemeContext — manages light/dark/custom themes with localStorage persistence

"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

// Available theme identifiers
const THEMES = ["sketch", "dark", "midnight", "cream"] as const;
export type Theme = (typeof THEMES)[number];

// Theme config for preview UI
export interface ThemeConfig {
  id: Theme;
  label: string;
  description: string;
  previewBg: string;
  previewAccent: string;
  previewBorder: string;
}

// Theme display configurations
export const THEME_CONFIGS: ThemeConfig[] = [
  { id: "sketch", label: "Sketch", description: "Warm earth tones", previewBg: "#f5f0ea", previewAccent: "#3b82f6", previewBorder: "rgba(44,36,32,0.1)" },
  { id: "dark", label: "Dark", description: "Deep contrast mode", previewBg: "#0a0a0a", previewAccent: "#8b5cf6", previewBorder: "rgba(255,255,255,0.08)" },
  { id: "midnight", label: "Midnight", description: "Deep blue tones", previewBg: "#0c1126", previewAccent: "#6366f1", previewBorder: "rgba(99,102,241,0.15)" },
  { id: "cream", label: "Cream", description: "Clean warm light", previewBg: "#faf6f1", previewAccent: "#d97706", previewBorder: "rgba(30,27,24,0.1)" },
];

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => {},
});

const THEME_CLASSES = THEMES as readonly string[];

// Hook to read current theme
export function useTheme() {
  return useContext(ThemeContext);
}

// ThemeProvider — syncs theme state with localStorage and applies to document
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Restore saved theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored && THEMES.includes(stored)) {
      setThemeState(stored);
    }
    setMounted(true);
  }, []);

  // Apply theme classes to html/body and persist to localStorage
  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    html.classList.remove(...THEME_CLASSES);
    html.classList.add(theme);
    document.body.classList.remove(...THEME_CLASSES);
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
