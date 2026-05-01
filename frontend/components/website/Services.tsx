"use client";

const services = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "AI/ML Pipeline Development",
    description:
      "End-to-end data ingestion, transformation, training, and serving pipelines built for production.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#grad2)" strokeWidth="2" strokeLinecap="round">
        <defs>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
    title: "RAG Systems",
    description:
      "Production-grade Retrieval-Augmented Generation with hybrid search, re-ranking, and optimized retrieval.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#grad3)" strokeWidth="2" strokeLinecap="round">
        <defs>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </svg>
    ),
    title: "LLM App Development",
    description:
      "Custom LLM-powered applications using GPT-4, Claude, Gemini, and open-source models.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#grad4)" strokeWidth="2" strokeLinecap="round">
        <defs>
          <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: "Model Deployment & MLOps",
    description:
      "Containerized model serving, CI/CD for ML, monitoring, and drift detection at scale.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#grad5)" strokeWidth="2" strokeLinecap="round">
        <defs>
          <linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    title: "Data Engineering",
    description:
      "Scalable data platforms — ETL, feature stores, and real-time streaming architectures.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#grad6)" strokeWidth="2" strokeLinecap="round">
        <defs>
          <linearGradient id="grad6" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <path d="M4.93 4.93l2.83 2.83" />
        <path d="M16.24 16.24l2.83 2.83" />
        <path d="M2 12h4" />
        <path d="M18 12h4" />
        <path d="M4.93 19.07l2.83-2.83" />
        <path d="M16.24 7.76l2.83-2.83" />
      </svg>
    ),
    title: "AI Automation",
    description:
      "Intelligent workflow automation — agents, tools, and multi-step AI chains that execute autonomously.",
  },
];

export function Services() {
  return (
    <section id="solutions" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 scroll-reveal">
          <p className="text-sm font-mono text-[#3b82f6] mb-3 tracking-wider uppercase">
            What We Build
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f8fafc] mb-4">
            AI Solutions
          </h2>
          <p className="text-[#94a3b8] max-w-2xl mx-auto">
            From prototype to production — we build AI systems that scale.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="gradient-border card-glow rounded-xl p-6 bg-[#141414]"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-lg font-semibold text-[#f8fafc] mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-[#94a3b8] leading-relaxed mb-4">
                {service.description}
              </p>
              <a
                href="#contact"
                className="inline-flex items-center text-sm font-medium text-[#3b82f6] hover:text-[#8b5cf6] transition-colors"
              >
                Explore
                <svg
                  className="ml-1 w-4 h-4"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M6 3L11 8L6 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
