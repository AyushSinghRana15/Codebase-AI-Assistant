"use client";

import Link from "next/link";
import { SettingsDropdown } from "@/components/website/SettingsDropdown";

export function Header() {
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
          <SettingsDropdown />
        </div>
      </div>
    </header>
  );
}
