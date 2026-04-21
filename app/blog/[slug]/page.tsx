import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'
import { getAllPostSlugs, getPostBySlug, getAllPosts } from '@/lib/posts'
import dynamic from 'next/dynamic'
const BlogCarousel = dynamic(() => import('@/components/portfolio/BlogCarousel'), { ssr: false })
const Carousel3D = dynamic(() => import('@/components/portfolio/Carousel3D'), { ssr: false })
import type { Metadata } from 'next'

type Props = { params: { slug: string } }

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return {}
  const url = `https://jagdishkumarpatel.github.io/blog/${post.slug}`
  const description = post.description || post.excerpt
  return {
    title: post.title.startsWith('Jag Patel') ? post.title : `${post.title} | Jag Patel`,
    description,
    keywords: (post as any).keywords ?? post.tags ?? [],
    authors: [{ name: 'Jag Patel', url: 'https://jagdishkumarpatel.github.io' }],
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description,
      url,
      siteName: 'Jag Patel',
      images: post.feature_image
        ? [{ url: post.feature_image, width: 1400, height: 788, alt: post.title }]
        : [],
      type: 'article',
      publishedTime: post.date,
      authors: ['Jag Patel'],
      tags: post.tags ?? [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: post.feature_image ? [post.feature_image] : [],
      creator: '@JagPatel',
    },
    robots: { index: true, follow: true },
  }
}

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  const mins = readingTime(post.content)
  const allPosts = getAllPosts().filter(p => p.slug !== post.slug)

  return (
    <>
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/#blog" className="hover:text-foreground transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-xs">{post.title}</span>
        </div>

        <div className="flex gap-12">
          {/* Main content */}
          <article className="flex-1 min-w-0">

            <header className="mb-10">
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <time>
                  {new Date(post.date).toLocaleDateString('en-AU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span>·</span>
                <span>{mins} min read</span>
                {post.tags && post.tags.length > 0 && (
                  <>
                    <span>·</span>
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
                  </>
                )}
              </div>
            </header>

            {/* Gallery carousel — after title so reader has context */}
            {Array.isArray(post.gallery) && post.gallery.length > 0 && (
              <div className="mb-10">
                <Carousel3D posts={post.gallery.map((img, idx) => ({
                  slug: `${post.slug}-img-${idx}`,
                  title: img.title || post.title,
                  description: img.description || post.description || post.excerpt,
                  thumbnail: img.src,
                  thumbnailLight: img.src,
                  thumbnailDark: img.src,
                  carousel: true,
                  order: idx,
                }))} />
              </div>
            )}

            {/* Single feature image — after title, same pattern as carousel */}
            {!Array.isArray(post.gallery) && post.feature_image && (
              <div className="relative w-full rounded-xl overflow-hidden mb-10 bg-muted" style={{ aspectRatio: '16/9' }}>
                <Image
                  src={post.feature_image}
                  alt={post.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            )}

            <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-primary prose-code:text-primary prose-code:before:content-none prose-code:after:content-none">
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

          {/* Sticky sidebar — hidden on mobile */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                On this page
              </p>
              <div className="text-sm text-muted-foreground space-y-1 border-l border-border pl-3">
                {post.content
                  .split('\n')
                  .filter((l) => /^#{1,3} /.test(l))
                  .slice(0, 8)
                  .map((heading, i) => {
                    const level = heading.match(/^(#+)/)?.[1].length ?? 1
                    const text = heading.replace(/^#+\s/, '')
                    const anchor = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    return (
                      <a
                        key={i}
                        href={`#${anchor}`}
                        className={`block hover:text-foreground transition-colors leading-snug ${
                          level === 1 ? '' : level === 2 ? 'pl-2' : 'pl-4'
                        }`}
                      >
                        {text}
                      </a>
                    )
                  })}
              </div>
            </div>
          </aside>
        </div>
      </div>
      {/* Related posts 3D carousel */}
      <section className="mt-16 max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
        <Carousel3D posts={allPosts} />
      </section>
    </>
  )
}
