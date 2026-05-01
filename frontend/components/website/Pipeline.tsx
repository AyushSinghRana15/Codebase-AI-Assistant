"use client";

const steps = [
  {
    num: "01",
    title: "Discovery",
    description: "Understand your data, goals, and technical constraints.",
  },
  {
    num: "02",
    title: "Architecture",
    description: "Design the AI system blueprint and data flow.",
  },
  {
    num: "03",
    title: "Development",
    description: "Build, test, and iterate on the pipeline with real data.",
  },
  {
    num: "04",
    title: "Deployment",
    description: "Ship to production with monitoring and alerting.",
  },
  {
    num: "05",
    title: "Optimize",
    description: "Continuous improvement via feedback loops and A/B testing.",
  },
];

export function Pipeline() {
  return (
    <section id="process" className="py-24 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 scroll-reveal">
          <p className="text-sm font-mono text-[#3b82f6] mb-3 tracking-wider uppercase">
            From Idea to Production
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f8fafc] mb-4">
            The Pipeline
          </h2>
          <p className="text-[#94a3b8] max-w-2xl mx-auto">
            A proven process that takes your AI project from concept to
            production-ready system.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-10 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3b82f6]/20 to-transparent" />

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, i) => (
              <div key={step.title} className="relative scroll-reveal">
                <div className="flex flex-col items-center text-center">
                  <div
                    className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center mb-4"
                    style={{
                      background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    }}
                  >
                    <span className="text-lg font-bold text-white">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[#f8fafc] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#94a3b8] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
