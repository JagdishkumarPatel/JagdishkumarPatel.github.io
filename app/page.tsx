import { Hero } from '@/components/portfolio/hero'
import { About } from '@/components/portfolio/about'
import { Capabilities } from '@/components/portfolio/capabilities'
import { Projects } from '@/components/portfolio/projects'
import { Blog } from '@/components/portfolio/blog'
import { Contact } from '@/components/portfolio/contact'

export default function Home() {
  return (
    <div>
      <Hero />
      <About />
      <Capabilities />
      <Projects />
      <Blog />
      <Contact />
    </div>
  )
}