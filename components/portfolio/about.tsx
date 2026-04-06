import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'

function getAboutContent() {
  const filePath = path.join(process.cwd(), 'content', 'about.mdx')
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { content } = matter(raw)
  return content
}

export function About() {
  const content = getAboutContent()

  return (
    <section id="about" className="pt-10 pb-14 mx-auto max-w-4xl px-6">
      <div className="mb-12">
        <p className="font-mono text-sm text-primary mb-1">{`>`} about</p>
        <h2 className="text-3xl font-extrabold tracking-tight">About Me</h2>
      </div>
      <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-primary prose-code:text-primary prose-code:before:content-none prose-code:after:content-none">
        <MDXRemote
          source={content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug],
            },
          }}
        />
      </div>
    </section>
  )
}
