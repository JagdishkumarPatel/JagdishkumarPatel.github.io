import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Nav } from '@/components/layout/nav'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://jagdishkumarpatel.github.io'),
  title: {
    default: 'Jag Patel — Principal AI/ML Engineer',
    template: '%s | Jag Patel',
  },
  description: 'Principal AI/ML Engineer with 18+ years across AI/ML, DevSecOps, cloud infrastructure, and platform engineering.',
  openGraph: {
    siteName: 'Jag Patel',
    type: 'website',
    locale: 'en_AU',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans bg-background text-foreground antialiased flex flex-col min-h-screen">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
