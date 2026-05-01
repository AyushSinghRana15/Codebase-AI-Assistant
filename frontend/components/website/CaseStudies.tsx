"use client";

const projects = [
  {
    title: "Enterprise RAG System",
    stack: ["LangChain", "Pinecone", "GPT-4"],
    metrics: [
      { value: "87%", label: "Reduction in query time" },
      { value: "12K", label: "Documents indexed" },
      { value: "<100ms", label: "Retrieval latency" },
    ],
    gradient: "from-[#3b82f6]",
  },
  {
    title: "ML Pipeline Automation",
    stack: ["Airflow", "PyTorch", "FastAPI", "AWS"],
    metrics: [
      { value: "10x", label: "Faster training cycles" },
      { value: "94.2%", label: "Model accuracy" },
      { value: "60%", label: "Cost reduction" },
    ],
    gradient: "from-[#8b5cf6]",
  },
  {
    title: "LLM Customer Intelligence",
    stack: ["Llama 3", "LangGraph", "Redis"],
    metrics: [
      { value: "2M+", label: "Interactions automated" },
      { value: "98%", label: "CSAT score" },
      { value: "3x", label: "Faster resolution" },
    ],
    gradient: "from-[#3b82f6]",
  },
];

export function CaseStudies() {
  return (
    <section id="projects" className="py-24 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 scroll-reveal">
          <p className="text-sm font-mono text-[#8b5cf6] mb-3 tracking-wider uppercase">
            What We&apos;ve Shipped
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f8fafc] mb-4">
            AI Projects
          </h2>
          <p className="text-[#94a3b8] max-w-2xl mx-auto">
            Real results from production AI systems we&apos;ve built and
            deployed.
          </p>
        </div>

        <div className="space-y-6">
          {projects.map((project) => (
            <div
              key={project.title}
              className="gradient-border card-glow rounded-xl overflow-hidden bg-[#141414]"
            >
              <div
                className={`h-1 bg-gradient-to-r ${project.gradient} to-transparent`}
              />
              <div className="p-6 lg:p-8 grid lg:grid-cols-3 gap-6 items-center">
                <div>
                  <h3 className="text-xl font-bold text-[#f8fafc] mb-3">
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 text-xs font-mono rounded-md bg-[#0f0f0f] text-[#94a3b8] border border-white/[0.06]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2 grid grid-cols-3 gap-4">
                  {project.metrics.map((metric) => (
                    <div key={metric.label} className="text-center lg:text-left">
                      <div className="text-lg font-bold text-[#3b82f6]">
                        {metric.value}
                      </div>
                      <div className="text-xs text-[#475569]">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
