"use client";

import Link from "next/link";
import { useState } from "react";

const steps = [
  { num: 1, text: "Clone the repo and install dependencies" },
  { num: 2, text: "Ingest any repository (local or GitHub URL)" },
  { num: 3, text: "Start the FastAPI backend + Next.js frontend" },
  { num: 4, text: "Ask questions and get code-grounded answers" },
];

const commands = [
  "$ source venv/bin/activate",
  "$ uvicorn api.app:app --reload --port 8000",
  "$ cd frontend && npm run dev",
];

export function CTA() {
  const [copied, setCopied] = useState(false);

  const copyAll = () => {
    navigator.clipboard.writeText(commands.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyOne = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="docs" className="py-24 border-t" style={{ background: "var(--bg-primary)", borderColor: "var(--border-subtle)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 scroll-reveal">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Try it{" "}
            <span className="gradient-text">right now.</span>
          </h2>
          <p className="max-w-xl mx-auto mb-10" style={{ color: "var(--text-secondary)" }}>
            The assistant is running. Ask it anything about a codebase.
          </p>

          <Link
            href="/agent"
            className="inline-flex items-center px-8 py-4 text-base font-semibold text-white rounded-lg transition-all duration-300 hover:shadow-[0_0_32px_rgba(59,130,246,0.4)]"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
          >
            Open the Assistant
            <svg className="ml-2 w-5 h-5" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="max-w-2xl mx-auto scroll-reveal">
          <div className="grid sm:grid-cols-2 gap-4">
            {steps.map((step) => (
              <div
                key={step.num}
                className="flex items-start gap-3 p-4 rounded-xl border"
                style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
              >
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
                >
                  {step.num}
                </span>
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{step.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto mt-10 text-center scroll-reveal">
          <div className="p-6 rounded-xl border" style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-mono" style={{ color: "var(--text-secondary)" }}>Quick start</h3>
              <button
                onClick={copyAll}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-lg transition-all"
                style={{
                  background: copied ? "rgba(40,200,64,0.15)" : "transparent",
                  border: "1px solid var(--border-subtle)",
                  color: copied ? "#28c840" : "var(--text-muted)",
                }}
              >
                {copied ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy all
                  </>
                )}
              </button>
            </div>
            <div className="space-y-1 text-left">
              {commands.map((cmd, i) => (
                <button
                  key={i}
                  onClick={() => copyOne(cmd)}
                  className="w-full font-mono text-sm transition-colors rounded px-1 py-0.5 text-left"
                  style={{ color: "var(--text-primary)" }}
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
