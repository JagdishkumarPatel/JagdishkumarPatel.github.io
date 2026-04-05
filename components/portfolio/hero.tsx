export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
      <div className="container mx-auto px-4 text-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Hi, I&apos;m Jag Patel
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Principal AI/ML Engineer
          </p>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Designing and delivering intelligent, scalable systems at the convergence of AI/ML, cloud-native architecture, and full-stack engineering. Focused on translating complex problems into robust, production-grade solutions through modern technologies and disciplined engineering practices.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="#projects"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              View Projects
            </a>
            <a
              href="#blog"
              className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors"
            >
              Read Blog
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}