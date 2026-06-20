"use client";

import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          opacity: 0.03,
        }}
      />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.25) 0%, rgba(139,92,246,0.08) 50%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border mb-6" style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span style={{ color: "var(--text-secondary)" }}>RAG-powered · AST-aware · Citation-backed</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-6" style={{ color: "var(--text-primary)" }}>
              Ask your codebase{" "}
              <span className="gradient-text">anything.</span>
              <br />
              Get answers you can trust.
            </h1>

            <p className="text-lg max-w-xl mb-8 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              CodeBaseAI ingests any GitHub repo, parses it with AST-aware chunking, and answers
              natural-language questions with precise file citations — zero hallucination.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/agent"
                className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white rounded-xl transition-all duration-300 hover:shadow-[0_0_32px_rgba(59,130,246,0.35)]"
                style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
              >
                Try the Assistant
                <svg className="ml-2 w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </Link>
              <a
                href="https://github.com/AyushSinghRana15/Codebase-AI-Assistant"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300"
                style={{ border: "1.5px solid var(--border-subtle)", background: "var(--bg-card)", color: "var(--text-primary)" }}
              >
                View on GitHub
                <svg className="ml-2 w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3l3 3-3 3M13 6H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M13 10v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </a>
            </div>

            <div className="flex items-center gap-3 mt-10 text-sm" style={{ color: "var(--text-muted)" }}>
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M8 1C4.14 1 1 4.14 1 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5.5 8.5L7 10l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>80%+ RAGAS eval score · sub-2s answers · 0 hallucinations on test set</span>
            </div>
          </div>

          <div className="hidden lg:block scroll-reveal">
            <div
              className="rounded-2xl overflow-hidden border"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border-subtle)",
                boxShadow: "0 0 60px rgba(59,130,246,0.08)",
              }}
            >
              <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                <span className="ml-2 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                  codebaseai — Assistant
                </span>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                    U
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>You</div>
                    <div className="text-sm px-3.5 py-2.5 rounded-xl" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}>
                      Where is file loading implemented?
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}>
                    AI
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Assistant</div>
                    <div className="text-sm leading-relaxed px-3.5 py-2.5 rounded-xl" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}>
                      File loading is implemented in{" "}
                      <span className="font-mono text-[#3b82f6]">ingestion/loader.py</span>.
                      The <span className="font-mono">walk_repo()</span> function traverses the
                      repository tree, and <span className="font-mono">read_file()</span> reads
                      each file with encoding error handling.
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono" style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)" }}>
                        <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                          <path d="M14 8.5V12a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2h3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                          <path d="M11 2l3 3-6 6H8l.5-3L11 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        loader.py :: walk_repo
                        <span className="opacity-60">0.77</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono" style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)" }}>
                        <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                          <path d="M14 8.5V12a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2h3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                          <path d="M11 2l3 3-6 6H8l.5-3L11 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        loader.py :: read_file
                        <span className="opacity-60">0.84</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
                        Grounded ✓
                      </span>
                      <span className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
                        Generated in 1.4s
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "var(--bg-secondary)" }}>
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" style={{ color: "var(--text-muted)" }}>
                    <path d="M14 8.5V12a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2h3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M11 2l3 3-6 6H8l.5-3L11 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>Ask anything about any repository...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
