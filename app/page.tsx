import type { Metadata } from 'next'
import { Hero } from '@/components/portfolio/hero'
import { About } from '@/components/portfolio/about'
import { Capabilities } from '@/components/portfolio/capabilities'
import { Projects } from '@/components/portfolio/projects'
import { Blog } from '@/components/portfolio/blog'
import { Contact } from '@/components/portfolio/contact'
import { HomeEntry } from '@/components/portfolio/home-entry'

export const metadata: Metadata = {
  title: 'Jag Patel — Principal AI/ML Engineer | Machine Learning, MLOps & Cloud',
  description: 'Jag Patel (Jagdishkumar Patel) — Principal AI/ML Engineer with 18+ years across AI/ML Engineering, Machine Learning, Data Science, MLOps, Cloud Engineering, Cloud DevOps, and DevSecOps. Based in Australia.',
  keywords: [
    'Jag Patel', 'Jagdishkumar Patel', 'AI Engineer', 'AI/ML Engineer', 'AI/ML Engineering',
    'Principal AI/ML Engineer', 'Machine Learning Engineer', 'Data Science Engineer',
    'MLOps Engineer', 'Cloud Engineer', 'Cloud Engineering', 'Cloud DevOps Engineer',
    'Cloud DevSecOps Engineer', 'DevSecOps', 'LLM', 'Ollama', 'Azure', 'AWS',
    'Platform Engineering', 'Python',
  ],
  alternates: { canonical: 'https://jagdishkumarpatel.github.io' },
  openGraph: {
    title: 'Jag Patel — Principal AI/ML Engineer',
    description: 'Principal AI/ML Engineer with 18+ years in AI/ML Engineering, Machine Learning, MLOps, Cloud Engineering, and DevSecOps.',
    url: 'https://jagdishkumarpatel.github.io',
    siteName: 'Jag Patel',
    type: 'profile',
  },
}

export default function Home() {
  return (
    <HomeEntry>
      <Hero />
      <About />
      <Capabilities />
      <Projects />
      <Blog />
      <Contact />
    </HomeEntry>
  )
}