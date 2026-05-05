"use client";

import { useState } from "react";

const posts = [
  {
    title: "Building AST-Aware Code Chunking for RAG",
    tag: "AST",
    readTime: "8 min read",
    content: "Standard text chunking (e.g., splitting every 512 tokens) destroys code structure — a class gets split mid-method, a function's body lands in a different chunk from its docstring.\n\nWe built a Python AST parser that walks the syntax tree and splits at natural boundaries: class definitions, function definitions, and module-level blocks. Each chunk carries file_path, language, start_line, end_line, and extracted docstrings.\n\nThe result: chunks that preserve semantic context, dramatically improving retrieval quality for code-related queries.",
  },
  {
    title: "Hybrid Retrieval: FAISS + BM25 via RRF Fusion",
    tag: "Retrieval",
    readTime: "10 min read",
    content: "Vector search alone misses exact-match queries ('add_url_rule function'). BM25 alone misses semantic queries ('how does routing work').\n\nOur solution: run both FAISS (semantic) and BM25 (keyword) in parallel, then fuse results via Reciprocal Rank Fusion (RRF):\n\n  score(name) = Σ 1 / (k + rank + 1)\n\nWith k=60, this balances the two retrieval streams. The fused ranking consistently outperforms either method alone — we see 80%+ RAGAS faithfulness scores.",
  },
  {
    title: "Anti-Hallucination Techniques in Code RAG",
    tag: "Validation",
    readTime: "6 min read",
    content: "When a RAG system can't find relevant context, it must NOT fabricate an answer. We implement multiple guardrails:\n\n1. Score threshold — if the best chunk's L2 distance exceeds a cutoff, return 'not found'\n2. Self-reflection loop — LLM evaluates its own answer against provided context\n3. Keyword grounding — verify that key terms from the answer appear in retrieved chunks\n4. Empty context detection — explicitly reject answering when no relevant chunks exist\n\nThese checks catch ~90% of potential hallucinations before they reach the user.",
  },
  {
    title: "Evaluating RAG Systems with RAGAS Metrics",
    tag: "Evaluation",
    readTime: "7 min read",
    content: "RAG evaluation requires measuring both retrieval quality and generation quality. We use RAGAS to compute:\n\n- Faithfulness: Does the answer stay grounded in retrieved context?\n- Answer Relevance: Does the answer actually address the query?\n- Context Precision: Are the retrieved chunks actually useful?\n- Context Recall: Did we retrieve all the relevant chunks?\n\nOur pipeline scores 80%+ on faithfulness and answer relevance. The key insight: good evaluation data (query + ground truth + expected answer) is as important as the metrics themselves.",
  },
];

export function Blog() {
  const [selectedPost, setSelectedPost] = useState<typeof posts[0] | null>(null);

  return (
    <section id="blog" className="py-24 border-t" style={{ background: "var(--bg-primary)", borderColor: "var(--border-subtle)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 scroll-reveal">
          <p className="text-sm font-mono text-[#8b5cf6] mb-3 tracking-wider uppercase">
            Engineering Notes
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Deep Dives
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <button
              key={post.title}
              onClick={() => setSelectedPost(post)}
              className="gradient-border card-glow rounded-xl overflow-hidden text-left w-full"
            >
              <div className="h-32 bg-gradient-to-br from-[#3b82f6]/20 to-[#8b5cf6]/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-[#3b82f6]/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 text-xs font-mono rounded bg-[#3b82f6]/10 text-[#3b82f6]">
                    {post.tag}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{post.readTime}</span>
                </div>
                <h3 className="text-sm font-semibold mb-3 leading-snug" style={{ color: "var(--text-primary)" }}>
                  {post.title}
                </h3>
                <span
                  className="inline-flex items-center text-xs font-medium text-[#3b82f6] hover:text-[#8b5cf6] transition-colors"
                >
                  Read
                  <svg className="ml-1 w-3 h-3" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 fade-in"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl overflow-hidden"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "var(--border-subtle)" }}>
              <div>
                <span className="px-2 py-0.5 text-xs font-mono rounded bg-[#3b82f6]/10 text-[#3b82f6]">
                  {selectedPost.tag}
                </span>
                <span className="ml-2 text-xs" style={{ color: "var(--text-muted)" }}>{selectedPost.readTime}</span>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-1 rounded-lg transition-colors hover:opacity-80"
                style={{ color: "var(--text-muted)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                {selectedPost.title}
              </h2>
              <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--text-secondary)" }}>
                {selectedPost.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
