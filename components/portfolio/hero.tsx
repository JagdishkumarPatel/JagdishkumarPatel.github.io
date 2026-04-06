import Image from "next/image"
import { Github, Linkedin, Mail } from "lucide-react"

export function Hero() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden">
      {/* Dot-grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Glow orb */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/8 blur-[120px] rounded-full" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 pt-28 pb-12 flex flex-col items-center text-center gap-8">
        {/* Avatar */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl scale-110" />
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-2 ring-primary/30 ring-offset-4 ring-offset-background">
            <Image
              src="/avatar/headshot.jpg"
              alt="Jag Patel"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>

        {/* Name + role */}
        <div className="space-y-3">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Jag Patel
          </h1>
          <p className="font-mono text-lg md:text-xl text-primary">
            {">"} Principal AI/ML Engineer
          </p>
          <p className="max-w-xl text-muted-foreground text-base md:text-lg leading-relaxed">
            Designing intelligent, scalable systems at the intersection of AI, cloud-native
            architecture, and platform engineering. Turning research into production.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Mail className="h-4 w-4" /> Contact
          </a>
          <a
            href="https://www.linkedin.com/in/jagjpatel/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 text-foreground px-5 py-2.5 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
          >
            <Linkedin className="h-4 w-4" /> LinkedIn
          </a>
          <a
            href="https://github.com/JagdishkumarPatel"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 text-foreground px-5 py-2.5 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
          >
            <Github className="h-4 w-4" /> GitHub
          </a>
        </div>

        {/* Scroll hint */}
        <div className="mt-4 flex flex-col items-center gap-1 text-muted-foreground/50 text-xs">
          <span>scroll</span>
          <div className="w-px h-8 bg-muted-foreground/20" />
        </div>
      </div>
    </section>
  )
}