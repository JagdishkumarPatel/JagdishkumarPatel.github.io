
"use client"
import Image from "next/image"
import { Github, Linkedin, Mail } from "lucide-react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function Hero() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
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
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight gradient-heading">
            Jag Patel
          </h1>
          <p className="font-mono text-lg md:text-xl text-primary">
            {">"} Principal AI/ML Engineer
          </p>
          <p className="max-w-xl text-muted-foreground text-base md:text-lg leading-relaxed">
            Building production-grade AI systems at scale — from architecture and model design to deployment and platform engineering.
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

        {/* Animated tagline with Framer Motion, client-only */}
        {mounted && (
          <motion.div
            className="mt-4 flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
          >
            <motion.span
              className="font-mono text-xs tracking-widest text-muted-foreground/60 uppercase"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1.2, ease: 'easeOut' }}
            >
              Turning research into real-world, scalable solutions.
            </motion.span>
            <motion.span
              className="font-mono text-xs text-muted-foreground/60"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 1.2, ease: 'easeOut' }}
            >
              18+ years across AI/ML, Cloud, and DevSecOps.
            </motion.span>
            <div className="flex flex-col items-center gap-0.5 animate-bounce text-muted-foreground/40">
              <div className="w-px h-4 bg-current" />
              <div className="w-px h-4 bg-current" />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}