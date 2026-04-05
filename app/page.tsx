import { Hero } from '@/components/hero'
import { About } from '@/components/about'
import { Projects } from '@/components/projects'
import { Blog } from '@/components/blog'
import { Contact } from '@/components/contact'

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <Blog />
      <Contact />
    </main>
  )
}