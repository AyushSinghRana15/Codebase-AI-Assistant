// Header — top navigation bar with logo, sign-in link, and settings dropdown

"use client";

import Link from "next/link";
import { SettingsDropdown } from "@/components/website/SettingsDropdown";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="w-full border-b backdrop-blur-md" style={{ background: "color-mix(in srgb, var(--bg-secondary) 85%, transparent)", borderColor: "var(--border-subtle)" }}>
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Logo and app name */}
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <span className="text-base font-bold gradient-text">&lt;/&gt;</span>
          <span className="truncate text-base font-bold" style={{ color: "var(--text-primary)" }}>
            CodeBase<span className="text-[#3b82f6]">AI</span>
            <span className="ml-2 hidden text-xs font-normal sm:inline" style={{ color: "var(--text-muted)" }}>Assistant</span>
          </span>
        </Link>

        {/* Right nav: back link, sign-in, settings */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Link
            href="/"
            className="hidden text-xs transition-colors hover:opacity-80 sm:inline"
            style={{ color: "var(--text-muted)" }}
          >
            ← Back to site
          </Link>

          {/* Sign-in button for unauthenticated users */}
          {!loading && !user && (
            <Link
              href="/login"
              className="flex h-9 w-9 items-center justify-center gap-2 rounded-xl text-xs font-medium transition-all hover:opacity-80 sm:w-auto sm:px-3 sm:py-1.5"
              style={{
                color: "var(--text-primary)",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-card)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span className="hidden whitespace-nowrap sm:inline">
                Sign In
              </span>
            </Link>
          )}

          <SettingsDropdown />
        </div>
      </div>
    </header>
  );
}
