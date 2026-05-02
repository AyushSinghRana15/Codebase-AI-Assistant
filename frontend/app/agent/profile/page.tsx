"use client";

import { useState } from "react";
import Link from "next/link";
import { SettingsDropdown } from "@/components/website/SettingsDropdown";

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("CodeBaseAI User");
  const [email, setEmail] = useState("user@codebaseai.com");
  const [bio, setBio] = useState("AI Engineer working on code understanding");

  return (
    <main className="min-h-screen flex flex-col items-center" style={{ background: "var(--bg-primary)" }}>
      <header className="w-full border-b backdrop-blur-md" style={{ background: "color-mix(in srgb, var(--bg-secondary) 85%, transparent)", borderColor: "var(--border-subtle)" }}>
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-base font-bold gradient-text">&lt;/&gt;</span>
            <span className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
              CodeBase<span className="text-[#3b82f6]">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/agent"
              className="text-xs transition-colors hover:opacity-80"
              style={{ color: "var(--text-muted)" }}
            >
              ← Back to Assistant
            </Link>
            <SettingsDropdown />
          </div>
        </div>
      </header>

      <div className="w-full max-w-2xl px-6 py-12">
        <div className="flex items-center gap-6 mb-10">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
          >
            CB
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              {name}
            </h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {bio}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div
            className="rounded-xl p-6 border"
            style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Profile Details
              </h2>
              <button
                onClick={() => setEditing(!editing)}
                className="text-xs font-medium transition-colors hover:opacity-80"
                style={{ color: editing ? "#3b82f6" : "var(--text-secondary)" }}
              >
                {editing ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Display Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border transition-all focus:outline-none"
                    style={{
                      background: "var(--bg-secondary)",
                      borderColor: "var(--border-subtle)",
                      color: "var(--text-primary)",
                    }}
                  />
                ) : (
                  <p className="text-sm" style={{ color: "var(--text-primary)" }}>{name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Email
                </label>
                {editing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border transition-all focus:outline-none"
                    style={{
                      background: "var(--bg-secondary)",
                      borderColor: "var(--border-subtle)",
                      color: "var(--text-primary)",
                    }}
                  />
                ) : (
                  <p className="text-sm" style={{ color: "var(--text-primary)" }}>{email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Bio
                </label>
                {editing ? (
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 text-sm rounded-xl border transition-all focus:outline-none resize-none"
                    style={{
                      background: "var(--bg-secondary)",
                      borderColor: "var(--border-subtle)",
                      color: "var(--text-primary)",
                    }}
                  />
                ) : (
                  <p className="text-sm" style={{ color: "var(--text-primary)" }}>{bio}</p>
                )}
              </div>
            </div>

            {editing && (
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 text-sm font-medium rounded-xl transition-all"
                  style={{
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-secondary)",
                    background: "transparent",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <div
            className="rounded-xl p-6 border"
            style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
          >
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
              Usage Stats
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Queries", value: "1,247" },
                { label: "Repos", value: "12" },
                { label: "Tokens", value: "8.4M" },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-3 rounded-xl" style={{ background: "var(--bg-secondary)" }}>
                  <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{stat.value}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-xl p-6 border"
            style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
          >
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
              Connected Repositories
            </h2>
            <div className="space-y-3">
              {["github.com/pallets/flask", "github.com/expressjs/express", "github.com/django/django"].map((repo) => (
                <div
                  key={repo}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg"
                  style={{ background: "var(--bg-secondary)" }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--bg-card)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}>
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                  </div>
                  <span className="text-sm" style={{ color: "var(--text-primary)" }}>{repo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
