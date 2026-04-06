import type { Metadata } from 'next'
import { About } from '@/components/portfolio/about'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About | Jag Patel',
  description: 'Principal AI/ML Engineer with 18+ years across AI/ML, DevSecOps, and cloud infrastructure.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pt-20">
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground">About</span>
      </div>
      <About />
    </div>
  )
}
