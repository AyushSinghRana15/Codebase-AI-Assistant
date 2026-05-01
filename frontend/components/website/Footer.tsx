import Link from "next/link";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Architecture", href: "#architecture" },
  { label: "Demos", href: "#demos" },
  { label: "Docs", href: "#docs" },
];

const socials = [
  { label: "GitHub", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Twitter/X", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t py-12" style={{ background: "var(--bg-primary)", borderColor: "var(--border-subtle)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <span className="text-lg font-bold gradient-text">&lt;/&gt;</span>
              <span className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                CodeBase<span className="text-[#3b82f6]">AI</span>
              </span>
            </Link>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Ask natural language questions about any codebase.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Product</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm transition-colors hover:opacity-80" style={{ color: "var(--text-muted)" }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm transition-colors hover:opacity-80" style={{ color: "var(--text-muted)" }}>Documentation</a></li>
              <li><a href="#" className="text-sm transition-colors hover:opacity-80" style={{ color: "var(--text-muted)" }}>API Reference</a></li>
              <li><a href="#" className="text-sm transition-colors hover:opacity-80" style={{ color: "var(--text-muted)" }}>GitHub Repo</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Social</h4>
            <ul className="space-y-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="text-sm transition-colors hover:opacity-80" style={{ color: "var(--text-muted)" }}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: "var(--border-subtle)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            &copy; 2026 CodeBaseAI. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Production-ready RAG for code understanding.
          </p>
        </div>
      </div>
    </footer>
  );
}
