const capabilities = [
  {
    title: 'AI/ML Platforms',
    description:
      'Designing and delivering end-to-end AI/ML systems that move seamlessly from experimentation to production. Focused on building scalable, reliable, and production-grade solutions — from model development to deployment, monitoring, and continuous improvement.',
    icon: '🧠',
  },
  {
    title: 'Data & Intelligent Pipelines',
    description:
      'Architecting robust data pipelines across batch and real-time systems, enabling high-quality data flow, feature engineering, and reproducible machine learning workflows at scale.',
    icon: '⚡',
  },
  {
    title: 'Cloud Architecture',
    description:
      'Building cloud-native platforms across Azure, AWS, and GCP, leveraging containerisation, serverless patterns, and distributed systems to ensure scalability, resilience, and cost efficiency.',
    icon: '☁️',
  },
  {
    title: 'MLOps & DevOps',
    description:
      'Establishing production-ready MLOps practices, including CI/CD for machine learning, model versioning, automated testing, and end-to-end observability for reliable and maintainable systems.',
    icon: '🔁',
  },
  {
    title: 'Security & Governance',
    description:
      'Embedding security and compliance into AI/ML systems by design — implementing access control, data protection, and governance frameworks aligned with enterprise-grade standards.',
    icon: '🔐',
  },
  {
    title: 'Automation & Platform Engineering',
    description:
      'Developing reusable frameworks, APIs, and platform components that accelerate delivery, standardise engineering practices, and enable teams to build and scale AI solutions efficiently.',
    icon: '⚙️',
  },
]

export function Capabilities() {
  return (
    <section id="capabilities" className="py-14 mx-auto max-w-4xl px-6">
      <div className="mb-10">
        <p className="font-mono text-sm text-primary mb-1">{'>'} expertise</p>
        <h2 className="text-3xl font-extrabold tracking-tight gradient-heading">Capabilities</h2>
      </div>
      <hr className="border-border mb-10" />
      <div className="grid sm:grid-cols-2 gap-6">
        {capabilities.map((cap) => (
          <div
            key={cap.title}
            className="rounded-xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{cap.icon}</span>
              <h3 className="font-semibold text-base leading-snug">{cap.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{cap.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
