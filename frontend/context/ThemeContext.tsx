"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const THEMES = ["sketch", "dark", "midnight", "cream"] as const;
export type Theme = (typeof THEMES)[number];

export interface ThemeConfig {
  id: Theme;
  label: string;
  description: string;
  previewBg: string;
  previewAccent: string;
  previewBorder: string;
}

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

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored && THEMES.includes(stored)) {
      setThemeState(stored);
    }
    setMounted(true);
  }, []);

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
