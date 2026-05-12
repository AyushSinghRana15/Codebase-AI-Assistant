"use client";

import Link from "next/link";
import { SettingsDropdown } from "@/components/website/SettingsDropdown";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export function Header() {
  const { user, profile, signIn, loading } = useAuth();
  const [signingIn, setSigningIn] = useState(false);

  const handleSignIn = async () => {
    setSigningIn(true);
    try {
      await signIn();
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <header className="w-full border-b backdrop-blur-md" style={{ background: "color-mix(in srgb, var(--bg-secondary) 85%, transparent)", borderColor: "var(--border-subtle)" }}>
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-base font-bold gradient-text">&lt;/&gt;</span>
          <span className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
            CodeBase<span className="text-[#3b82f6]">AI</span>
            <span className="text-xs font-normal ml-2" style={{ color: "var(--text-muted)" }}>Assistant</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-xs transition-colors hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
          >
            ← Back to site
          </Link>

          {!loading && !user && (
            <button
              onClick={handleSignIn}
              disabled={signingIn}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-xl transition-all"
              style={{
                color: "var(--text-primary)",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-card)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {signingIn ? "Signing in..." : "Sign in with Google"}
            </button>
          )}

          <SettingsDropdown />
        </div>
      </div>
    </header>
  );
}
