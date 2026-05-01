"use client";

import { useEffect, useState, useRef } from "react";

interface MetricDef {
  value: number;
  suffix: string;
  label: string;
  decimal?: boolean;
  prefix?: string;
}

const metrics: MetricDef[] = [
  { value: 387, suffix: "", label: "Code Chunks Indexed" },
  { value: 142, suffix: "", label: "Files Parsed (AST)" },
  { value: 80, suffix: "%", label: "Eval Score (RAGAS)" },
  { value: 1.2, suffix: "s", label: "Avg Answer Latency", decimal: true },
  { value: 11, suffix: "", label: "Pipeline Stages" },
];

function AnimatedCounter({
  target,
  suffix,
  prefix = "",
  decimal,
}: {
  target: number;
  suffix: string;
  prefix?: string;
  decimal?: boolean;
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(decimal ? parseFloat(current.toFixed(1)) : Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [hasAnimated, target, decimal]);

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

export function MetricsBar() {
  return (
    <section className="border-y" style={{ background: "var(--bg-secondary)", borderColor: "var(--border-subtle)" }}>
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-5 gap-6">
        {metrics.map((m) => (
          <div key={m.label} className="text-center">
            <div className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
              <AnimatedCounter
                target={m.value}
                suffix={m.suffix}
                decimal={m.decimal}
              />
            </div>
            <div className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
