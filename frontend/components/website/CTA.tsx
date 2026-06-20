"use client";

import Link from "next/link";

export function CTA() {
  return (
    <section id="docs" className="py-24 border-t" style={{ background: "var(--bg-primary)", borderColor: "var(--border-subtle)" }}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="scroll-reveal">
          <p className="text-sm font-mono text-[#8b5cf6] mb-3 tracking-wider uppercase">
            Get Started
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Ready to understand your codebase?
          </h2>
          <p className="max-w-xl mx-auto mb-10" style={{ color: "var(--text-secondary)" }}>
            The assistant is live. Ask it anything about any repository — no setup, no configuration, no credit card.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/agent"
              className="inline-flex items-center px-8 py-4 text-base font-semibold text-white rounded-xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.35)]"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
            >
              Try the Assistant
              <svg className="ml-2 w-5 h-5" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <a
              href="https://github.com/AyushSinghRana15/Codebase-AI-Assistant"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 text-base font-semibold rounded-xl transition-all duration-300"
              style={{ border: "1.5px solid var(--border-subtle)", background: "var(--bg-card)", color: "var(--text-primary)" }}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 16 16" fill="none">
                <path d="M10 3l3 3-3 3M13 6H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M13 10v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
