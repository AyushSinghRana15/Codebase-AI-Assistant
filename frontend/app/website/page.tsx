import type { Metadata } from "next";
import {
  Navbar,
  Hero,
  MetricsBar,
  Features,
  TechStack,
  Architecture,
  DemoQueries,
  CodeShowcase,
  About,
  Blog,
  CTA,
  Footer,
  ScrollReveal,
} from "@/components/website";

export const metadata: Metadata = {
  title: "CodeBaseAI — Ask Natural Language Questions About Any Codebase",
  description:
    "Production-ready RAG system for code understanding. AST-aware chunking, hybrid retrieval, anti-hallucination checks. Get code-grounded answers with file citations.",
};

export default function WebsitePage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <ScrollReveal />
      <Navbar />
      <main>
        <Hero />
        <MetricsBar />
        <Features />
        <Architecture />
        <TechStack />
        <DemoQueries />
        <CodeShowcase />
        <About />
        <Blog />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
