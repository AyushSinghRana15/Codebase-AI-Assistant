// WebsitePage — landing page for CodeBaseAI marketing site

import type { Metadata } from "next";
import {
  Navbar,
  Hero,
  TrustStrip,
  Features,
  DemoQueries,
  CodeShowcase,
  Blog,
  CTA,
  Footer,
  ScrollReveal,
} from "@/components/website";

// Page metadata
export const metadata: Metadata = {
  title: "CodeBaseAI — Ask Your Codebase Anything. Get Answers You Can Trust.",
  description:
    "RAG-powered code assistant that ingests GitHub repos, parses with AST-aware chunking, and answers natural-language questions with precise file citations and zero hallucination.",
};

// Landing page composing all marketing sections
export default function WebsitePage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <ScrollReveal />
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <Features />
        <DemoQueries />
        <CodeShowcase />
        <Blog />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
