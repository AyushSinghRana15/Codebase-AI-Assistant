"use client";

const ethosBullets = [
  "AST-based chunking that respects code structure, not arbitrary text splits",
  "Hybrid retrieval combining semantic + keyword matching for complete coverage",
  "Anti-hallucination: score thresholds, self-reflection, and keyword grounding",
  "Dependency graph for multi-hop reasoning — understands function call chains",
  "Eval-driven: RAGAS metrics, automated scoring, 80%+ target",
  "Open-source friendly: works with free models, offline-capable",
];

const projectMetrics = [
  { value: "11", label: "Pipeline Stages" },
  { value: "5", label: "Core Modules" },
  { value: "80%+", label: "Eval Score" },
  { value: "0", label: "Hallucinations (on test set)" },
];

export function About() {
  return (
    <section id="docs" className="py-24 border-t" style={{ background: "var(--bg-primary)", borderColor: "var(--border-subtle)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="scroll-reveal">
            <p className="text-sm font-mono text-[#3b82f6] mb-3 tracking-wider uppercase">
              About This Project
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
              Code-grounded answers,{" "}
              <span className="gradient-text">zero hallucination.</span>
            </h2>
            <p className="leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
              CodeBaseAI is a production-ready RAG system for code understanding.
              It ingests any Python repository, parses it with AST-aware chunking,
              builds a hybrid search index (FAISS + BM25), and answers natural
              language questions with precise file citations. Every answer is
              validated against the source code before being returned.
            </p>

            <ul className="space-y-3">
              {ethosBullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="#3b82f6" strokeWidth="1.5" />
                    <path d="M6 10l3 3 5-5" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4 scroll-reveal">
            {projectMetrics.map((metric) => (
              <div
                key={metric.label}
                className="p-6 rounded-xl border text-center"
                style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
              >
                <div className="text-2xl font-bold gradient-text mb-1">
                  {metric.value}
                </div>
                <div className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
