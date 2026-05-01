"use client";

const stages = [
  { num: "01", title: "Spell-Check", description: "Correct typos in user queries while preserving technical terms." },
  { num: "02", title: "Classify Intent", description: "Determine query type: location, flow, explanation, debug." },
  { num: "03", title: "Rewrite Query", description: "Transform conversational queries into search-optimized form." },
  { num: "04", title: "Hybrid Retrieve", description: "FAISS semantic + BM25 keyword search fused via RRF." },
  { num: "05", title: "Rerank", description: "CrossEncoder rescores results for precise relevance." },
  { num: "06", title: "Expand Context", description: "Dependency graph pulls in caller/callee context for multi-hop." },
  { num: "07", title: "Generate Answer", description: "LLM produces code-grounded answer with file citations." },
  { num: "08", title: "Self-Reflect", description: "Two-pass LLM verification catches unsupported claims." },
  { num: "09", title: "Validate", description: "Confidence scoring + keyword grounding validation." },
  { num: "10", title: "Shape Response", description: "Format answer with sources, scores, and latency." },
  { num: "11", title: "Cache", description: "LRU cache for repeated queries (200 entries)." },
];

export function Architecture() {
  return (
    <section id="architecture" className="py-24 border-t" style={{ background: "var(--bg-primary)", borderColor: "var(--border-subtle)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 scroll-reveal">
          <p className="text-sm font-mono text-[#3b82f6] mb-3 tracking-wider uppercase">
            From Query to Answer
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            11-Stage Pipeline
          </h2>
          <p className="max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Every query flows through a rigorous pipeline designed for accuracy, not speed.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {stages.map((stage) => (
            <div key={stage.title} className="scroll-reveal">
              <div className="gradient-border card-glow rounded-xl p-4 h-full">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
                >
                  {stage.num}
                </div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                  {stage.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {stage.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
