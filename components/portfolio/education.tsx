import Link from 'next/link'
import { GraduationCap, ExternalLink } from 'lucide-react'
import educationData from '@/public/metadata/education.json'

type Education = {
  degree: string
  field: string
  institution: string
  location: string
  start: string
  end: string
  description: string
  credentialUrl: string
}

export function EducationPage() {
  const education = educationData as Education[]

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground">Education</span>
      </div>
      <div className="mb-12">
        <p className="font-mono text-sm text-primary mb-1">{`>`} education</p>
        <h1 className="text-3xl font-extrabold tracking-tight">Education</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Academic background and formal qualifications.
        </p>
      </div>
      <div className="space-y-6">
        {education.map((edu) => (
          <div
            key={`${edu.institution}-${edu.degree}`}
            className="flex items-start gap-5 rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all duration-200"
          >
            <div className="mt-0.5 shrink-0 rounded-lg bg-primary/10 p-2.5">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-base leading-snug">
                {edu.degree}{edu.field ? ` — ${edu.field}` : ''}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {edu.institution}{edu.location ? `, ${edu.location}` : ''}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {edu.start}{edu.end && edu.end !== edu.start ? ` – ${edu.end}` : ''}
              </p>
              {edu.description && (
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{edu.description}</p>
              )}
              {edu.credentialUrl && (
                <a
                  href={edu.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-xs text-primary hover:underline"
                >
                  Show credential <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
