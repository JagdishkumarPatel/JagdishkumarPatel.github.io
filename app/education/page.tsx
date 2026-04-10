import type { Metadata } from 'next'
import { EducationPage } from '@/components/portfolio/education'

export const metadata: Metadata = {
  title: 'Education | Jag Patel',
  description: 'Academic background and formal qualifications of Jag Patel — Principal AI/ML Engineer with 18+ years of experience in AI, cloud, and platform engineering.',
  keywords: [
    'Jag Patel education', 'Jagdishkumar Patel', 'Jag Patel qualifications',
    'AI ML engineer education', 'Principal AI ML Engineer background',
  ],
  authors: [{ name: 'Jag Patel', url: 'https://jagdishkumarpatel.github.io' }],
  alternates: { canonical: 'https://jagdishkumarpatel.github.io/education' },
  openGraph: {
    title: 'Education | Jag Patel',
    description: 'Academic qualifications of Jag Patel, Principal AI/ML Engineer.',
    url: 'https://jagdishkumarpatel.github.io/education',
    siteName: 'Jag Patel',
    type: 'profile',
  },
  twitter: {
    card: 'summary',
    title: 'Education | Jag Patel',
    description: 'Academic background and qualifications of Jag Patel, Principal AI/ML Engineer.',
    creator: '@JagPatel',
  },
  robots: { index: true, follow: true },
}

export default function Education() {
  return <EducationPage />
}
