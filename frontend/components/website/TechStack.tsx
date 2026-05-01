"use client";

const row1 = [
  "Python", "AST Parser", "sentence-transformers", "FAISS", "BM25",
  "CrossEncoder", "RAGAS", "pyspellchecker",
];

const row2 = [
  "FastAPI", "Next.js 16", "TypeScript", "Tailwind CSS", "shadcn/ui",
  "OpenRouter", "Pydantic", "uvicorn", "Redis",
];

function MarqueeRow({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items, ...items, ...items];
  return (
    <div className="overflow-hidden">
      <div
        className="flex gap-4 w-max"
        style={{
          animation: reverse
            ? "marquee-reverse 30s linear infinite"
            : "marquee 30s linear infinite",
        }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-mono whitespace-nowrap transition-colors"
            style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TechStack() {
  return (
    <section id="stack" className="py-24 border-t" style={{ background: "var(--bg-primary)", borderColor: "var(--border-subtle)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 scroll-reveal">
          <p className="text-sm font-mono text-[#8b5cf6] mb-3 tracking-wider uppercase">
            Built With
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
            Full Stack
          </h2>
        </div>

        <div className="space-y-4">
          <MarqueeRow items={row1} />
          <MarqueeRow items={row2} reverse />
        </div>
      </div>
    </section>
  );
}
