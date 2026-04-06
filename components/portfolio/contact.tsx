"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Mail, Github, Linkedin, ArrowLeft } from 'lucide-react'

function EmailButton() {
  const [email, setEmail] = useState('')

  useEffect(() => {
    // Assembled client-side only — not visible to crawlers/bots
    const parts = ['patel.jag.j', '@', 'gmail', '.', 'com']
    setEmail(parts.join(''))
  }, [])

  if (!email) {
    return (
      <span className="inline-flex items-center gap-2 bg-primary/30 text-primary-foreground px-6 py-3 rounded-lg text-sm">
        <Mail size={20} /> Loading…
      </span>
    )
  }

  return (
    <a
      href={`mailto:${email}`}
      className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
    >
      <Mail size={20} /> Email Me
    </a>
  )
}

function ContactContent({ standalone = false }: { standalone?: boolean }) {
  return (
    <section id="contact" className="py-14">
      <div className="mx-auto max-w-2xl px-6">
        {standalone && (
          <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">Contact</span>
          </div>
        )}
        <div className="mb-10">
          <p className="font-mono text-sm text-primary mb-1">{`>`} connect</p>
          <h2 className="text-3xl font-extrabold tracking-tight">Get In Touch</h2>
        </div>
        <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
          I&apos;m always open to discussing new opportunities, collaborations, or sharing knowledge about AI/ML and platform engineering.
        </p>
        <div className="flex flex-wrap gap-4">
          <EmailButton />
          <a
            href="https://www.linkedin.com/in/jagjpatel/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors"
          >
            <Linkedin size={20} /> LinkedIn
          </a>
          <a
            href="https://github.com/JagdishkumarPatel"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-lg hover:border-primary hover:text-primary transition-colors"
          >
            <Github size={20} /> GitHub
          </a>
        </div>
      </div>
    </section>
  )
}

export function Contact() {
  return <ContactContent />
}

export function ContactPage() {
  return <ContactContent standalone />
}