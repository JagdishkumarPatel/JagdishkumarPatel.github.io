import type { Metadata } from 'next'
import { ProjectsPage } from '@/components/portfolio/projects'
import projectsData from '@/public/metadata/projects.json'

export const metadata: Metadata = {
  title: 'Projects | Jag Patel',
  description: 'Projects built by Jag Patel — Principal AI/ML Engineer.',
}

export default function Projects() {
  return <ProjectsPage projects={projectsData} />
}
