import type { Metadata } from 'next'
import { Hero } from '@/components/portfolio/hero'
import { About } from '@/components/portfolio/about'
import { Capabilities } from '@/components/portfolio/capabilities'
import { Projects } from '@/components/portfolio/projects'
import { Blog } from '@/components/portfolio/blog'
import { Contact } from '@/components/portfolio/contact'
import { HomeEntry } from '@/components/portfolio/home-entry'
import Carousel3D from '@/components/portfolio/Carousel3D'
import { getAllPosts } from '@/lib/posts'

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
  const posts = getAllPosts();
  return (
    <HomeEntry>
      <Hero />
      <About />
      {/* VisualCarousel below About section */}
      <section className="py-14 mx-auto max-w-4xl px-6">
        <div className="mb-10">
          <p className="font-mono text-sm text-primary mb-1">{'>'} highlights</p>
          <h2 className="text-3xl font-extrabold tracking-tight gradient-heading">Highlights</h2>
        </div>
        <Carousel3D posts={posts} />
      </section>
      <Capabilities />
      <Projects />
      <Blog />
      <Contact />
    </HomeEntry>
  )
}