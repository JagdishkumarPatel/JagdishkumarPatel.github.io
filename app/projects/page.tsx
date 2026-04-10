import type { Metadata } from 'next'
import { ProjectsPage } from '@/components/portfolio/projects'
import projectsData from '@/public/metadata/projects.json'

export const metadata: Metadata = {
  title: 'Projects | Jag Patel',
  description: 'Explore projects built by Jag Patel — Principal AI/ML Engineer specialising in AI/ML pipelines, distributed systems, platform engineering, and cloud automation.',
  keywords: [
    'Jag Patel', 'Jagdishkumar Patel', 'Jag Patel projects', 'AI ML projects',
    'Principal AI ML Engineer', 'platform engineering projects', 'Python projects',
    'MLOps projects', 'distributed systems projects', 'cloud automation', 'Azure AI projects',
  ],
  authors: [{ name: 'Jag Patel', url: 'https://jagdishkumarpatel.github.io' }],
  alternates: { canonical: 'https://jagdishkumarpatel.github.io/projects' },
  openGraph: {
    title: 'Projects | Jag Patel',
    description: 'Explore AI/ML, platform engineering, and cloud automation projects built by Jag Patel — Principal AI/ML Engineer.',
    url: 'https://jagdishkumarpatel.github.io/projects',
    siteName: 'Jag Patel',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | Jag Patel',
    description: 'AI/ML, platform engineering, and cloud automation projects by Jag Patel — Principal AI/ML Engineer.',
    creator: '@JagPatel',
  },
  robots: { index: true, follow: true },
}

export default function Projects() {
  return <ProjectsPage projects={projectsData} />
}
