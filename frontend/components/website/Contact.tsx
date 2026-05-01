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
      <section id="contact" className="py-24 border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="p-12 rounded-xl bg-[#141414] border border-white/[0.06]">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
            >
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#f8fafc] mb-2">Message Sent</h3>
            <p className="text-[#94a3b8]">We&apos;ll get back to you within 24 hours.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-24 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 scroll-reveal">
          <p className="text-sm font-mono text-[#3b82f6] mb-3 tracking-wider uppercase">
            Start Building
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f8fafc] mb-4">
            Let&apos;s build your{" "}
            <span className="gradient-text">AI system.</span>
          </h2>
          <p className="text-[#94a3b8] max-w-xl mx-auto">
            Tell us about your project and we&apos;ll get back to you within 24
            hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <form onSubmit={handleSubmit} className="space-y-5 scroll-reveal">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-[#94a3b8] mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-[#141414] border border-white/[0.06] text-[#f8fafc] text-sm focus:outline-none focus:border-[#3b82f6]/50 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm text-[#94a3b8] mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-[#141414] border border-white/[0.06] text-[#f8fafc] text-sm focus:outline-none focus:border-[#3b82f6]/50 transition-colors"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-[#94a3b8] mb-2">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-[#141414] border border-white/[0.06] text-[#f8fafc] text-sm focus:outline-none focus:border-[#3b82f6]/50 transition-colors"
                  placeholder="Company name"
                />
              </div>
              <div>
                <label className="block text-sm text-[#94a3b8] mb-2">Project Type</label>
                <select
                  name="projectType"
                  required
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-[#141414] border border-white/[0.06] text-[#f8fafc] text-sm focus:outline-none focus:border-[#3b82f6]/50 transition-colors appearance-none"
                >
                  <option value="" disabled>Select type</option>
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#94a3b8] mb-2">Message</label>
              <textarea
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-[#141414] border border-white/[0.06] text-[#f8fafc] text-sm focus:outline-none focus:border-[#3b82f6]/50 transition-colors resize-none"
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
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>

          <div className="scroll-reveal space-y-6">
            <div className="p-6 rounded-xl bg-[#141414] border border-white/[0.06]">
              <h3 className="text-lg font-semibold text-[#f8fafc] mb-2">
                Prefer to talk?
              </h3>
              <p className="text-sm text-[#94a3b8] mb-4">
                Schedule a 30-minute call to discuss your AI project.
              </p>
              <a
                href="mailto:hello@codebaseai.dev"
                className="inline-flex items-center text-sm font-medium text-[#3b82f6] hover:text-[#8b5cf6] transition-colors"
              >
                hello@codebaseai.dev
                <svg className="ml-1 w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 3L11 8L6 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </a>
            </div>

            <div className="p-6 rounded-xl bg-[#141414] border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-[#f8fafc] mb-4">
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
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm text-[#94a3b8]">{step}</span>
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
