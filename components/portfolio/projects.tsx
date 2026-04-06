import Link from 'next/link'
import { ExternalLink, Github } from 'lucide-react'
import projectsData from '@/public/metadata/projects.json'

type Project = {
  title: string
  description: string
  tech: string[]
  github: string
  demo?: string
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all duration-200">
      <h3 className="font-semibold text-lg mb-2 leading-snug">{project.title}</h3>
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
      </div>
    </div>
  )
}

export function Projects() {
  return (
    <section id="projects" className="py-24 mx-auto max-w-4xl px-6">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <p className="font-mono text-sm text-primary mb-1">{`>`} work</p>
          <h2 className="text-3xl font-extrabold tracking-tight">Projects</h2>
        </div>
        <Link href="/projects" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          View all →
        </Link>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {projectsData.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  )
}

export function ProjectsPage({ projects }: { projects: Project[] }) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground">Projects</span>
      </div>
      <div className="mb-12">
        <p className="font-mono text-sm text-primary mb-1">{`>`} work</p>
        <h1 className="text-3xl font-extrabold tracking-tight">Projects</h1>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </div>
  )
}