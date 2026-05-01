"use client";

import Link from "next/link";

const steps = [
  { num: 1, text: "Clone the repo and install dependencies" },
  { num: 2, text: "Ingest any repository (local or GitHub URL)" },
  { num: 3, text: "Start the FastAPI backend + Next.js frontend" },
  { num: 4, text: "Ask questions and get code-grounded answers" },
];

export function CTA() {
  return (
    <section className="py-24 border-t" style={{ background: "var(--bg-primary)", borderColor: "var(--border-subtle)" }}>
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
            href="/"
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
            <h3 className="text-sm font-mono mb-3" style={{ color: "var(--text-secondary)" }}>Quick start</h3>
            <div className="font-mono text-sm text-[#3b82f6] space-y-1 text-left">
              <p>$ source venv/bin/activate</p>
              <p>$ uvicorn api.app:app --reload --port 8000</p>
              <p>$ cd frontend && npm run dev</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
