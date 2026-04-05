import { Hero } from '@/components/portfolio/hero'
import { About } from '@/components/portfolio/about'
import { Projects } from '@/components/portfolio/projects'
import { Blog } from '@/components/portfolio/blog'
import { Contact } from '@/components/portfolio/contact'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Home() {
  return (
    <main className="mx-auto max-w-screen-xl px-6 py-12 font-sans md:px-12 md:py-20 lg:px-24 lg:py-0">
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      <div className="flex flex-col gap-24 lg:gap-32">
        <Hero />
        <About />
        <Projects />
        <Blog />
        <Contact />
      </div>
    </main>
  )
}