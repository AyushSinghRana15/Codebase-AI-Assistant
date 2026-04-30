"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export function Header() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="w-full border-b border-border">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">AI</span>
          </div>
          <h1 className="text-sm font-semibold">CodeBase AI Assistant</h1>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleTheme}
          className="h-8 w-8"
        >
          {isDark ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  );
}
