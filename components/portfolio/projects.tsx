'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ExternalLink, Github, BookOpen } from 'lucide-react'
import projectsData from '@/public/metadata/projects.json'
import { FilterDropdown } from '@/components/portfolio/filter-dropdown'

type Project = {
  title: string
  description: string
  tech: string[]
  github: string
  demo?: string
  blogSlug?: string
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all duration-200">
      <h3 className="font-semibold text-lg mb-2 leading-snug">{project.title}</h3>
      <hr className="border-border mb-8" /> {/* Add a divider */}
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-1">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {project.tech.map((tech) => (
          <span key={tech} className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-medium">
            {tech}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-4">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Github size={15} /> GitHub <ExternalLink size={12} />
          </a>
        )}
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink size={15} /> Live Demo
          </a>
        )}
        {project.blogSlug && (
          <Link
            href={`/blog/${project.blogSlug}`}
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline transition-colors"
          >
            <BookOpen size={15} /> Read Post
          </Link>
        )}
      </div>
    </div>
  )
}

export function Projects() {
  return (
    <section id="projects" className="py-14 mx-auto max-w-4xl px-6">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <p className="font-mono text-sm text-primary mb-1">{`>`} work</p>
          <h2 className="text-3xl font-extrabold tracking-tight gradient-heading">Projects</h2>
        </div>
        <Link href="/projects" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          View all →
        </Link>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {projectsData.slice(0, 4).map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  )
}

export function ProjectsPage({ projects }: { projects: Project[] }) {
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])

  const allTechs = useMemo(() => {
    const set = new Set<string>()
    projects.forEach((p) => p.tech.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [projects])

  const filtered = useMemo(
    () =>
      selectedTechs.length === 0
        ? projects
        : projects.filter((p) => selectedTechs.every((t) => p.tech.includes(t))),
    [projects, selectedTechs]
  )

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground">Projects</span>
      </div>
      <div className="mb-2 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-primary mb-1">{`>`} work</p>
          <h1 className="text-3xl font-extrabold tracking-tight">Projects</h1>
          <hr className="border-border mb-8 mt-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {filtered.length} project{filtered.length !== 1 ? 's' : ''}
            {selectedTechs.length > 0 ? ` matching selected tech` : ''}
          </p>
        </div>
        {allTechs.length > 0 && (
          <div className="shrink-0">
            <FilterDropdown
              label="Filter by tech"
              options={allTechs}
              selected={selectedTechs}
              onChange={setSelectedTechs}
            />
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-2 text-center py-12 text-muted-foreground">No projects match this filter.</p>
        )}
      </div>
    </div>
  )
}
