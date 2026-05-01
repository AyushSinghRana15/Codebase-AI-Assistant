"use client";

import Link from "next/link";

const posts = [
  {
    title: "Building AST-Aware Code Chunking for RAG",
    tag: "AST",
    readTime: "8 min read",
  },
  {
    title: "Hybrid Retrieval: FAISS + BM25 via RRF Fusion",
    tag: "Retrieval",
    readTime: "10 min read",
  },
  {
    title: "Anti-Hallucination Techniques in Code RAG",
    tag: "Validation",
    readTime: "6 min read",
  },
  {
    title: "Evaluating RAG Systems with RAGAS Metrics",
    tag: "Evaluation",
    readTime: "7 min read",
  },
];

export function Blog() {
  return (
    <section className="py-24 border-t" style={{ background: "var(--bg-primary)", borderColor: "var(--border-subtle)" }}>
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
            <div
              key={post.title}
              className="gradient-border card-glow rounded-xl overflow-hidden"
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
                <a
                  href="#"
                  className="inline-flex items-center text-xs font-medium text-[#3b82f6] hover:text-[#8b5cf6] transition-colors"
                >
                  Read
                  <svg className="ml-1 w-3 h-3" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
