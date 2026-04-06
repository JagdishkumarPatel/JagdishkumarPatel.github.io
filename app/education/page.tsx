import type { Metadata } from 'next'
import { EducationPage } from '@/components/portfolio/education'

export const metadata: Metadata = {
  title: 'Education | Jag Patel',
  description:
    'Academic background and formal qualifications of Jag Patel — Principal AI/ML Engineer with 18+ years of experience.',
  openGraph: {
    title: 'Education | Jag Patel',
    description:
      'Academic qualifications of Jag Patel, Principal AI/ML Engineer.',
    type: 'profile',
  },
}

export default function Education() {
  return <EducationPage />
}
