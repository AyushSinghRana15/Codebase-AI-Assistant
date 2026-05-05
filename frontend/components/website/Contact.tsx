"use client";

import { useState } from "react";

const projectTypes = [
  "RAG System",
  "ML Pipeline",
  "LLM App",
  "MLOps",
  "Data Engineering",
  "Other",
];

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (submitted) {
    return (
      <section id="contact" className="py-24 border-t" style={{ background: "var(--bg-primary)", borderColor: "var(--border-subtle)" }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="p-12 rounded-xl border" style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
            >
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Message Sent</h3>
            <p style={{ color: "var(--text-secondary)" }}>We&apos;ll get back to you within 24 hours.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 text-sm font-medium text-[#3b82f6] hover:text-[#8b5cf6] transition-colors"
            >
              Send another message
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-24 border-t" style={{ background: "var(--bg-primary)", borderColor: "var(--border-subtle)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 scroll-reveal">
          <p className="text-sm font-mono text-[#3b82f6] mb-3 tracking-wider uppercase">
            Start Building
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Let&apos;s build your{" "}
            <span className="gradient-text">AI system.</span>
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Tell us about your project and we&apos;ll get back to you within 24
            hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <form onSubmit={handleSubmit} className="space-y-5 scroll-reveal">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[#3b82f6]/50 transition-colors border"
                  style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[#3b82f6]/50 transition-colors border"
                  style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[#3b82f6]/50 transition-colors border"
                  style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
                  placeholder="Company name"
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>Project Type</label>
                <select
                  name="projectType"
                  required
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[#3b82f6]/50 transition-colors appearance-none border"
                  style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
                >
                  <option value="" disabled style={{ background: "var(--bg-card)" }}>Select type</option>
                  {projectTypes.map((type) => (
                    <option key={type} value={type} style={{ background: "var(--bg-card)" }}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>Message</label>
              <textarea
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[#3b82f6]/50 transition-colors resize-none border"
                style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
                placeholder="Describe your project, goals, and timeline..."
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center px-8 py-3 text-sm font-semibold text-white rounded-lg transition-all duration-300 hover:shadow-[0_0_24px_rgba(59,130,246,0.3)]"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
            >
              Send Message
              <svg className="ml-2 w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>

          <div className="scroll-reveal space-y-6">
            <div className="p-6 rounded-xl border" style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
              <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                Prefer to talk?
              </h3>
              <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                Schedule a 30-minute call to discuss your AI project.
              </p>
              <a
                href="mailto:hello@codebaseai.dev"
                className="inline-flex items-center text-sm font-medium text-[#3b82f6] hover:text-[#8b5cf6] transition-colors"
              >
                hello@codebaseai.dev
                <svg className="ml-1 w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </a>
            </div>

            <div className="p-6 rounded-xl border" style={{ background: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                What happens next
              </h3>
              <div className="space-y-3">
                {[
                  "We review your project requirements",
                  "Schedule a technical discovery call",
                  "Propose architecture and timeline",
                  "Kick off development within 1 week",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
