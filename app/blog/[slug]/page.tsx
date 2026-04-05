import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'
import { getAllPostSlugs, getPostBySlug } from '@/lib/posts'
import { ThemeSwitcher } from '@/components/theme-switcher'
import type { Metadata } from 'next'

type Props = { params: { slug: string } }

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return {}
  return {
    title: `${post.title} | Jag Patel`,
    description: post.description || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.description || post.excerpt,
      images: post.feature_image ? [post.feature_image] : [],
      type: 'article',
    },
  }
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed top-6 right-6 z-50">
        <ThemeSwitcher />
      </div>
      <article className="mx-auto max-w-3xl px-6 py-16 md:px-8">
        <Link
          href="/#blog"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          ← Back to blog
        </Link>

        {post.feature_image && (
          <img
            src={post.feature_image}
            alt={post.title}
            className="w-full rounded-xl object-cover mb-8 max-h-80"
          />
        )}

        <header className="mb-8">
          <h1 className="text-3xl font-bold leading-tight mb-3">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <time>
              {new Date(post.date).toLocaleDateString('en-AU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-primary prose-code:text-primary">
          <MDXRemote
            source={post.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug, rehypeHighlight],
              },
            }}
          />
        </div>
      </article>
    </div>
  )
}
