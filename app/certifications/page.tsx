import type { Metadata } from 'next'
import { CertificationsPage } from '@/components/portfolio/certifications'

export const metadata: Metadata = {
  title: 'Licenses & Certifications | Jag Patel',
  description:
    'Professional certifications and licenses held by Jag Patel — Principal AI/ML Engineer specialising in cloud, DevSecOps, and infrastructure engineering.',
  openGraph: {
    title: 'Licenses & Certifications | Jag Patel',
    description:
      'Industry certifications across AWS, Azure, Terraform, and more — held by Jag Patel, Principal AI/ML Engineer.',
    type: 'profile',
  },
}

export default function Certifications() {
  return <CertificationsPage />
}
