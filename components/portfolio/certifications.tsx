import Link from 'next/link'
import { ExternalLink, Award } from 'lucide-react'
import certsData from '@/public/metadata/certifications.json'

type Cert = {
  name: string
  issuer: string
  issuerLogo: string
  issued: string
  expires: string
  credentialId: string
  credentialUrl: string
  category: string
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const [year, month] = dateStr.split('-')
  if (!month) return year
  const d = new Date(Number(year), Number(month) - 1)
  return d.toLocaleDateString('en-AU', { year: 'numeric', month: 'short' })
}

// Group by category
function groupByCategory(certs: Cert[]) {
  return certs.reduce<Record<string, Cert[]>>((acc, cert) => {
    const cat = cert.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(cert)
    return acc
  }, {})
}

function CertCard({ cert }: { cert: Cert }) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all duration-200">
      <div className="mt-0.5 shrink-0 rounded-lg bg-primary/10 p-2">
        <Award className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm leading-snug">{cert.name}</h3>
        <p className="text-sm text-muted-foreground mt-0.5">{cert.issuer}</p>
        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
          {cert.issued && <span>Issued {formatDate(cert.issued)}</span>}
          {cert.expires && <><span>·</span><span>Expires {formatDate(cert.expires)}</span></>}
          {cert.credentialId && <><span>·</span><span>ID: {cert.credentialId}</span></>}
        </div>
        {cert.credentialUrl && (
          <a
            href={cert.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:underline"
          >
            Show credential <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
      <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
        {cert.category}
      </span>
    </div>
  )
}

export function CertificationsPage() {
  const groups = groupByCategory(certsData as Cert[])

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground">Certifications</span>
      </div>
      <div className="mb-12">
        <p className="font-mono text-sm text-primary mb-1">{`>`} credentials</p>
        <h1 className="text-3xl font-extrabold tracking-tight gradient-heading">Licenses &amp; Certifications</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Industry certifications and professional credentials across cloud, DevSecOps, AI/ML, and infrastructure engineering.
        </p>
      </div>
      <div className="space-y-10">
        {Object.entries(groups).map(([category, certs]) => (
          <div key={category}>
            <h2 className="text-base font-semibold uppercase tracking-widest text-muted-foreground mb-4 border-b border-border pb-2">
              {category}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {certs.map((cert) => (
                <CertCard key={cert.name} cert={cert} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
