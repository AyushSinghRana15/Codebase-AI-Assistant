"use client";

const demos = [
  {
    query: '"Where is file loading implemented?"',
    answer: "File loading is in `ingestion/loader.py` — `walk_repo()` traverses the repo, `read_file()` reads content with encoding error handling.",
    sources: ["ingestion/loader.py :: walk_repo", "ingestion/loader.py :: read_file"],
    scores: ["L2: 0.31", "L2: 0.77"],
  },
  {
    query: '"Explain the ingestion flow step by step"',
    answer: "The pipeline: walk_repo → parse_chunks (AST) → build_embed_text → embed_chunks → build FAISS index. Each chunk carries file_path, language, and line boundaries.",
    sources: ["main.py :: run_ingestion", "ingestion/chunker.py :: parse_chunks", "embeddings/embedder.py :: embed_chunks"],
    scores: ["L2: 0.45", "L2: 0.62", "L2: 0.71"],
  },
  {
    query: '"Where is the payment gateway?"',
    answer: "I could not find this in the provided codebase. No chunks match payment or gateway references.",
    sources: [],
    scores: [],
    notFound: true,
  },
];

export function DemoQueries() {
  return (
    <section id="demos" className="py-24 border-t" style={{ background: "var(--bg-primary)", borderColor: "var(--border-subtle)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 scroll-reveal">
          <p className="text-sm font-mono text-[#8b5cf6] mb-3 tracking-wider uppercase">
            See It In Action
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Demo Queries
          </h2>
          <p className="max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Real queries against this codebase — with grounded answers and precise citations.
          </p>
        </div>

        <div className="space-y-6">
          {demos.map((demo, i) => (
            <div
              key={i}
              className="gradient-border card-glow rounded-xl overflow-hidden"
            >
              <div className={`h-1 ${demo.notFound ? "bg-[#475569]" : "bg-gradient-to-r from-[#3b82f6] to-transparent"}`} />
              <div className="p-6">
                <div className="font-mono text-sm mb-4" style={{ color: "var(--text-primary)" }}>
                  {demo.query}
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                  {demo.answer}
                </p>
                {demo.sources.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {demo.sources.map((src, j) => (
                      <div key={j} className="flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-mono"
                        style={{ background: "var(--bg-secondary)", borderColor: "var(--border-subtle)" }}
                      >
                        <span className="text-[#3b82f6]">{src}</span>
                        <span style={{ color: "var(--text-muted)" }}>{demo.scores[j]}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-mono"
                    style={{ background: "var(--bg-secondary)", borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
                  >
                    No relevant chunks found — correctly returns empty
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
