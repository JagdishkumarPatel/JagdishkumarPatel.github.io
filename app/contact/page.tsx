import type { Metadata } from 'next'
import { ContactPage } from '@/components/portfolio/contact'

export const metadata: Metadata = {
  title: 'Contact | Jag Patel',
  description: 'Get in touch with Jag Patel — Principal AI/ML Engineer.',
}

export default function Contact() {
  return <ContactPage />
}
