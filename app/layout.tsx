import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeDarkSync } from '@/components/theme-dark-sync'
import { Nav } from '@/components/layout/nav'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://jagdishkumarpatel.github.io'),
  title: {
    default: 'Jag Patel — Principal AI/ML Engineer, MLOps & Cloud',
    template: '%s | Jag Patel',
  },
  description: 'Jag Patel — Principal AI/ML Engineer. 18+ years in AI/ML, LLMs, PromptFlow, DevSecOps, and cloud automation. Building transparent, production-grade AI systems and secure platforms.',
  keywords: [
    'Jag Patel',
    'Jagdishkumar Patel',
    'AI Engineer',
    'AI/ML Engineer',
    'AI/ML Engineering',
    'Principal AI/ML Engineer',
    'Machine Learning Engineer',
    'Data Science Engineer',
    'MLOps Engineer',
    'MLOps',
    'Cloud Engineer',
    'Cloud Engineering',
    'Cloud DevOps Engineer',
    'Cloud DevSecOps Engineer',
    'DevSecOps',
    'PromptFlow',
    'Mistral',
    'GPT4All',
    'Azure',
    'AWS',
    'Bicep',
    'Terraform',
    'LLM',
    'Platform Engineering',
    'Python',
    'FastAPI',
    'Ollama',
    'LangChain',
    'Cloud Security',
    'Automation',
    'Leadership',
  ],
  openGraph: {
    siteName: 'Jag Patel',
    type: 'profile',
    locale: 'en_AU',
    title: 'Jag Patel — Principal AI/ML Engineer, MLOps & Cloud',
    description: 'Principal AI/ML Engineer with 18+ years in AI, MLOps, PromptFlow, DevSecOps, and cloud automation.',
    url: 'https://jagdishkumarpatel.github.io',
    images: [
      {
        url: '/images/avatar.jpg',
        width: 800,
        height: 800,
        alt: 'Jag Patel — Principal AI/ML Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jag Patel — Principal AI/ML Engineer',
    description: '18+ years in AI/ML, LLMs, PromptFlow, DevSecOps, and cloud automation.',
    images: ['/images/avatar.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

// Add JSON-LD structured data for Person
export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Jag Patel',
  jobTitle: 'Principal AI/ML Engineer',
  url: 'https://jagdishkumarpatel.github.io',
  description: 'Principal AI/ML Engineer based in Melbourne, Australia, with 18+ years in AI, MLOps, PromptFlow, DevSecOps, and cloud automation.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Melbourne',
    addressRegion: 'VIC',
    addressCountry: 'Australia',
  },
  alumniOf: {
    '@type': 'Organization',
    name: 'Monash University',
    sameAs: 'https://www.monash.edu/'
  },
  sameAs: [
    'https://www.linkedin.com/in/jagjpatel/',
    'https://github.com/JagdishkumarPatel',
    'https://twitter.com/JagPatel',
    'https://scholar.google.com/citations?user=JagPatel',
    'https://www.kaggle.com/jagpatel',
    'https://www.monash.edu/',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        {/* Google Analytics (GA4) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-J0DJH4C4DR"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-J0DJH4C4DR');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="font-sans bg-background text-foreground antialiased flex flex-col min-h-screen">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeDarkSync />
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
