import type { Metadata } from 'next'
import { ContactPage } from '@/components/portfolio/contact'

export const metadata: Metadata = {
  title: 'Contact Jag Patel | Principal AI/ML Engineer in Melbourne, Australia',
  description: 'Get in touch with Jag Patel — Principal AI/ML Engineer based in Melbourne, Australia, specialising in AI/ML, MLOps, platform engineering, and cloud automation.',
  keywords: [
    'Jag Patel', 'contact Jag Patel', 'Jagdishkumar Patel', 'hire AI ML engineer',
    'Principal AI ML Engineer contact', 'AI engineer Australia', 'AI engineer Melbourne',
  ],
  authors: [{ name: 'Jag Patel', url: 'https://jagdishkumarpatel.github.io' }],
  alternates: { canonical: 'https://jagdishkumarpatel.github.io/contact' },
  openGraph: {
    title: 'Contact Jag Patel | Principal AI/ML Engineer in Melbourne, Australia',
    description: 'Get in touch with Jag Patel — Principal AI/ML Engineer based in Melbourne, Australia.',
    url: 'https://jagdishkumarpatel.github.io/contact',
    siteName: 'Jag Patel',
    type: 'profile',
    locale: 'en_AU',
  },
  twitter: {
    card: 'summary',
    title: 'Contact Jag Patel | Principal AI/ML Engineer in Melbourne, Australia',
    description: 'Get in touch with Jag Patel — Principal AI/ML Engineer based in Melbourne, Australia.',
    creator: '@JagPatel',
  },
  robots: { index: true, follow: true },
}

export default function Contact() {
  return <ContactPage />
}
