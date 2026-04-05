import { Mail, Github, Linkedin } from 'lucide-react'

export function Contact() {
  return (
    <section id="contact" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">Get In Touch</h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-center text-lg mb-8">
              I&apos;m always interested in discussing new opportunities, collaborations, or sharing knowledge about AI/ML and software engineering.
            </p>
            <div className="flex justify-center gap-6">
              <a
                href="mailto:hello@jagpatel.dev"
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Mail size={20} />
                Email Me
              </a>
              <a
                href="https://github.com/jagdishkumarpatel"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <Github size={20} />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/jagjpatel/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <Linkedin size={20} />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}