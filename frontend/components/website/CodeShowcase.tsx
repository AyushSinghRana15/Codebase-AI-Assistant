"use client";

import { useState } from "react";

const codeSnippet = `def ask(query: str) -> dict:
    # 1. Spell-check query
    corrected, _ = correct_query(query)

    # 2. Classify intent (location/flow/explanation/debug)
    intent = classify_query(corrected)
    cfg = get_pipeline_config(intent)

    # 3. Rewrite query for retrieval
    rewritten = rewrite_query(corrected, intent)

    # 4. Hybrid retrieval (FAISS + BM25 → RRF fusion)
    results = hybrid_retrieve(rewritten, top_k=cfg["top_k"])

    # 5. CrossEncoder reranking
    results = rerank(corrected, results, top_n=5)

    # 6. Expand context via dependency graph
    results = expand_context(results, graph, max_additions=5)

    # 7. Generate answer
    answer = generate_answer(corrected, results)

    # 8. Self-reflection loop
    final = reflect(corrected, answer, build_context(results))

    # 9. Validate confidence
    validation = validate(final, results)

    return shape_response(final, validation, results)`;

export function CodeShowcase() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 border-t" style={{ background: "var(--bg-primary)", borderColor: "var(--border-subtle)" }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-10 scroll-reveal">
          <p className="text-sm font-mono text-[#3b82f6] mb-3 tracking-wider uppercase">
            Core Pipeline
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            The <span className="gradient-text">ask()</span> Function
          </h2>
        </div>

        <div
          className="rounded-xl overflow-hidden border"
          style={{ background: "var(--bg-secondary)", borderColor: "var(--border-subtle)", boxShadow: "0 0 60px rgba(59,130,246,0.06)" }}
        >
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                pipeline/ask.py
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="text-xs font-mono transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <pre className="p-6 overflow-x-auto text-sm font-mono leading-relaxed">
            <code>
              <span className="text-[#c678dd]">def</span>{" "}
              <span className="text-[#61afef]">ask</span>
              <span className="text-[#56b6c2]">(</span>
              <span className="text-[#e5c07b]">query</span>
              <span className="text-[#56b6c2]">:</span>{" "}
              <span className="text-[#e5c07b]">str</span>
              <span className="text-[#56b6c2]">)</span>{" "}
              <span className="text-[#56b6c2]">-&gt;</span>{" "}
              <span className="text-[#e5c07b]">dict</span>
              <span className="text-[#56b6c2]">:</span>
              {"\n"}
              {"\n"}
              <span style={{ color: "#5c6370" }}>    # 1. Spell-check query</span>
              {"\n"}
              {"    "}<span className="text-[#e5c07b]">corrected</span>, <span className="text-[#e5c07b]">_</span>{" "}
              <span className="text-[#56b6c2]">=</span>{" "}
              <span className="text-[#61afef]">correct_query</span>
              <span className="text-[#56b6c2]">(</span>
              <span className="text-[#e5c07b]">query</span>
              <span className="text-[#56b6c2]">)</span>
              {"\n\n"}
              <span style={{ color: "#5c6370" }}>    # 2. Classify intent</span>
              {"\n"}
              {"    "}<span className="text-[#e5c07b]">intent</span>{" "}
              <span className="text-[#56b6c2]">=</span>{" "}
              <span className="text-[#61afef]">classify_query</span>
              <span className="text-[#56b6c2]">(</span>
              <span className="text-[#e5c07b]">corrected</span>
              <span className="text-[#56b6c2]">)</span>
              {"\n"}
              {"    "}<span className="text-[#e5c07b]">cfg</span>{" "}
              <span className="text-[#56b6c2]">=</span>{" "}
              <span className="text-[#61afef]">get_pipeline_config</span>
              <span className="text-[#56b6c2]">(</span>
              <span className="text-[#e5c07b]">intent</span>
              <span className="text-[#56b6c2]">)</span>
              {"\n\n"}
              <span style={{ color: "#5c6370" }}>    # 3. Rewrite query for retrieval</span>
              {"\n"}
              {"    "}<span className="text-[#e5c07b]">rewritten</span>{" "}
              <span className="text-[#56b6c2]">=</span>{" "}
              <span className="text-[#61afef]">rewrite_query</span>
              <span className="text-[#56b6c2]">(</span>
              <span className="text-[#e5c07b]">corrected</span>, <span className="text-[#e5c07b]">intent</span>
              <span className="text-[#56b6c2]">)</span>
              {"\n\n"}
              <span style={{ color: "#5c6370" }}>    # 4. Hybrid retrieval (FAISS + BM25)</span>
              {"\n"}
              {"    "}<span className="text-[#e5c07b]">results</span>{" "}
              <span className="text-[#56b6c2]">=</span>{" "}
              <span className="text-[#61afef]">hybrid_retrieve</span>
              <span className="text-[#56b6c2]">(</span>
              <span className="text-[#e5c07b]">rewritten</span>, <span className="text-[#e5c07b]">top_k</span>
              <span className="text-[#56b6c2]">=</span>
              <span className="text-[#e5c07b]">cfg</span>
              <span className="text-[#56b6c2]">[</span>
              <span className="text-[#98c379]">&quot;top_k&quot;</span>
              <span className="text-[#56b6c2]">])</span>
              {"\n\n"}
              <span style={{ color: "#5c6370" }}>    # 5. CrossEncoder reranking</span>
              {"\n"}
              {"    "}<span className="text-[#e5c07b]">results</span>{" "}
              <span className="text-[#56b6c2]">=</span>{" "}
              <span className="text-[#61afef]">rerank</span>
              <span className="text-[#56b6c2]">(</span>
              <span className="text-[#e5c07b]">corrected</span>, <span className="text-[#e5c07b]">results</span>, <span className="text-[#e5c07b]">top_n</span>
              <span className="text-[#56b6c2]">=</span>
              <span className="text-[#d19a66]">5</span>
              <span className="text-[#56b6c2]">)</span>
              {"\n\n"}
              <span style={{ color: "#5c6370" }}>    # 6. Expand context via dependency graph</span>
              {"\n"}
              {"    "}<span className="text-[#e5c07b]">results</span>{" "}
              <span className="text-[#56b6c2]">=</span>{" "}
              <span className="text-[#61afef]">expand_context</span>
              <span className="text-[#56b6c2]">(</span>
              <span className="text-[#e5c07b]">results</span>, <span className="text-[#e5c07b]">graph</span>, <span className="text-[#e5c07b]">max_additions</span>
              <span className="text-[#56b6c2]">=</span>
              <span className="text-[#d19a66]">5</span>
              <span className="text-[#56b6c2]">)</span>
              {"\n\n"}
              <span style={{ color: "#5c6370" }}>    # 7. Generate answer</span>
              {"\n"}
              {"    "}<span className="text-[#e5c07b]">answer</span>{" "}
              <span className="text-[#56b6c2]">=</span>{" "}
              <span className="text-[#61afef]">generate_answer</span>
              <span className="text-[#56b6c2]">(</span>
              <span className="text-[#e5c07b]">corrected</span>, <span className="text-[#e5c07b]">results</span>
              <span className="text-[#56b6c2]">)</span>
              {"\n\n"}
              <span style={{ color: "#5c6370" }}>    # 8. Self-reflection loop</span>
              {"\n"}
              {"    "}<span className="text-[#e5c07b]">final</span>{" "}
              <span className="text-[#56b6c2]">=</span>{" "}
              <span className="text-[#61afef]">reflect</span>
              <span className="text-[#56b6c2]">(</span>
              <span className="text-[#e5c07b]">corrected</span>, <span className="text-[#e5c07b]">answer</span>, <span className="text-[#61afef]">build_context</span>
              <span className="text-[#56b6c2]">(</span>
              <span className="text-[#e5c07b]">results</span>
              <span className="text-[#56b6c2]">))</span>
              {"\n\n"}
              <span style={{ color: "#5c6370" }}>    # 9. Validate confidence</span>
              {"\n"}
              {"    "}<span className="text-[#e5c07b]">validation</span>{" "}
              <span className="text-[#56b6c2]">=</span>{" "}
              <span className="text-[#61afef]">validate</span>
              <span className="text-[#56b6c2]">(</span>
              <span className="text-[#e5c07b]">final</span>, <span className="text-[#e5c07b]">results</span>
              <span className="text-[#56b6c2]">)</span>
              {"\n\n"}
              {"    "}<span className="text-[#c678dd]">return</span>{" "}
              <span className="text-[#61afef]">shape_response</span>
              <span className="text-[#56b6c2]">(</span>
              <span className="text-[#e5c07b]">final</span>, <span className="text-[#e5c07b]">validation</span>, <span className="text-[#e5c07b]">results</span>
              <span className="text-[#56b6c2]">)</span>
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}
