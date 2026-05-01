"use client";

import { useEffect, useState } from "react";

const terminalLines = [
  { text: '$ codebaseai --repo github.com/pallets/flask', delay: 800 },
  { text: "→ Cloning repository...", delay: 1200 },
  { text: "→ AST parsing: 142 files, 387 chunks", delay: 1500 },
  { text: "→ Generating embeddings (384-dim)...", delay: 1000 },
  { text: "→ Building FAISS index + BM25...", delay: 800 },
  { text: "Ready. 387 chunks indexed in 12.4s ✓", delay: 600 },
  { text: "", delay: 400 },
  { text: '> "Where is the routing logic?"', delay: 1000 },
  { text: "  flask/app.py :: register_blueprint [L2: 0.42]", delay: 800 },
  { text: "  flask/app.py :: add_url_rule     [L2: 0.58]", delay: 600 },
  { text: "  Answer generated in 1.2s ✓", delay: 400 },
];

export function Terminal() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    if (currentLine >= terminalLines.length) {
      setTimeout(() => {
        setDisplayedLines([]);
        setCurrentLine(0);
        setCurrentChar(0);
      }, 4000);
      return;
    }

    const line = terminalLines[currentLine];

    if (currentChar < line.text.length) {
      const timeout = setTimeout(() => {
        setCurrentChar((c) => c + 1);
      }, 20 + Math.random() * 15);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setDisplayedLines((prev) => [...prev, line.text]);
      setCurrentLine((l) => l + 1);
      setCurrentChar(0);
    }, line.delay);
    return () => clearTimeout(timeout);
  }, [currentLine, currentChar]);

  const currentText =
    currentLine < terminalLines.length
      ? terminalLines[currentLine].text.slice(0, currentChar)
      : "";

  return (
    <div
      className="sketch-card rounded-2xl overflow-hidden border"
      style={{ boxShadow: "0 0 40px rgba(59,130,246,0.08)" }}
    >
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          codebaseai
        </span>
      </div>
      <div className="p-5 font-mono text-sm leading-relaxed min-h-[280px]">
        {displayedLines.map((line, i) => {
          const isCmd = line.startsWith("$") || line.startsWith(">");
          const isSuccess = line.includes("✓");
          const isSource = line.includes("[L2:");
          const isAnswer = line.includes("Answer generated");
          let colorStyle = { color: "var(--text-secondary)" };
          if (isCmd) colorStyle = { color: "var(--text-primary)" };
          if (isSuccess) colorStyle = { color: "#28c840" };
          if (isSource) colorStyle = { color: "#3b82f6" };
          if (isAnswer) colorStyle = { color: "#8b5cf6" };
          return (
            <div key={i} style={colorStyle}>
              {line}
            </div>
          );
        })}
        {currentLine < terminalLines.length && (
          <div style={{ color: "var(--text-primary)" }}>
            {currentText}
            <span className="terminal-cursor" />
          </div>
        )}
      </div>
    </div>
  );
}
