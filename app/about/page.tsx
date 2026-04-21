import type { Metadata } from 'next'
import { About } from '@/components/portfolio/about'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Jag Patel | Principal AI/ML Engineer in Melbourne, Australia',
  description: 'Jag Patel is a Principal AI/ML Engineer based in Melbourne, Australia, with 18+ years across AI/ML, LLMs, MLOps, DevSecOps, and cloud infrastructure.',
  keywords: [
    'Jag Patel', 'Jagdishkumar Patel', 'about Jag Patel', 'Principal AI ML Engineer',
    'AI ML Engineer Australia', 'AI ML Engineer Melbourne', 'MLOps engineer', 'LLM engineer', 'DevSecOps engineer',
    'cloud engineer Australia', 'cloud engineer Melbourne', 'platform engineer',
  ],
  authors: [{ name: 'Jag Patel', url: 'https://jagdishkumarpatel.github.io' }],
  alternates: { canonical: 'https://jagdishkumarpatel.github.io/about' },
  openGraph: {
    title: 'About Jag Patel | Principal AI/ML Engineer in Melbourne, Australia',
    description: 'Jag Patel — Principal AI/ML Engineer based in Melbourne, Australia, with 18+ years in AI, MLOps, DevSecOps, and cloud automation.',
    url: 'https://jagdishkumarpatel.github.io/about',
    siteName: 'Jag Patel',
    type: 'profile',
    locale: 'en_AU',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Jag Patel | Principal AI/ML Engineer in Melbourne, Australia',
    description: 'Jag Patel — 18+ years in AI/ML, LLMs, MLOps, DevSecOps, and cloud automation. Based in Melbourne, Australia.',
    creator: '@JagPatel',
  },
  robots: { index: true, follow: true },
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
