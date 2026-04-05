
export function Blog() {
  return (
    <section id="blog" className="py-20">
      <div className="container mx-auto px-4">
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">Latest Blog Posts</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Welcome to My Blog</h3>
              <p className="text-muted-foreground mb-4">
                Introducing my new blog where I'll share insights on AI/ML engineering, MLOps best practices, and software development experiences.
              </p>
              <div className="text-sm text-muted-foreground">
                April 5, 2024 • AI, ML, Career
              </div>
            </div>
            <p className="text-center mt-8 text-muted-foreground">
              More posts coming soon with MDX support!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}