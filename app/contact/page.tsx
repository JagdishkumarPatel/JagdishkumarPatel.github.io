import type { Metadata } from 'next'
import { ContactPage } from '@/components/portfolio/contact'

export const metadata: Metadata = {
  title: 'Contact Jag Patel | Principal AI/ML Engineer',
  description: 'Get in touch with Jag Patel — Principal AI/ML Engineer specialising in AI/ML, MLOps, platform engineering, and cloud automation.',
  keywords: [
    'Jag Patel', 'contact Jag Patel', 'Jagdishkumar Patel', 'hire AI ML engineer',
    'Principal AI ML Engineer contact', 'AI engineer Australia',
  ],
  authors: [{ name: 'Jag Patel', url: 'https://jagdishkumarpatel.github.io' }],
  alternates: { canonical: 'https://jagdishkumarpatel.github.io/contact' },
  openGraph: {
    title: 'Contact Jag Patel | Principal AI/ML Engineer',
    description: 'Get in touch with Jag Patel — Principal AI/ML Engineer.',
    url: 'https://jagdishkumarpatel.github.io/contact',
    siteName: 'Jag Patel',
    type: 'profile',
  },
  twitter: {
    card: 'summary',
    title: 'Contact Jag Patel | Principal AI/ML Engineer',
    description: 'Get in touch with Jag Patel — Principal AI/ML Engineer.',
    creator: '@JagPatel',
  },
  robots: { index: true, follow: true },
}

export default function Contact() {
  return <ContactPage />
}
