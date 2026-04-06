import { Hero } from '@/components/portfolio/hero'
import { About } from '@/components/portfolio/about'
import { Projects } from '@/components/portfolio/projects'
import { Blog } from '@/components/portfolio/blog'
import { Contact } from '@/components/portfolio/contact'

export default function Home() {
  return (
    <div>
      <Hero />
      <About />
      <Projects />
      <Blog />
      <Contact />
    </div>
  )
}