'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { FilterDropdown } from '@/components/portfolio/filter-dropdown'

type PostMeta = {
  slug: string
  title: string
  date: string
  excerpt?: string
  feature_image?: string | null
  tags?: string[]
  description?: string
}

export function BlogPage({ posts }: { posts: PostMeta[] }) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const allTags = useMemo(() => {
    const set = new Set<string>()
    posts.forEach((p) => p.tags?.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [posts])

  const filtered = useMemo(
    () =>
      selectedTags.length === 0
        ? posts
        : posts.filter((p) => selectedTags.every((t) => p.tags?.includes(t))),
    [posts, selectedTags]
  )

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground">Blog</span>
      </div>
      <div className="mb-2 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-primary mb-1">{'>'} writing</p>
          <h1 className="text-3xl font-extrabold tracking-tight">All Posts</h1>
          <p className="text-sm text-muted-foreground mt-2">
            {filtered.length} post{filtered.length !== 1 ? 's' : ''}
            {selectedTags.length > 0 ? ` matching selected tags` : ''}
          </p>
        </div>
        {allTags.length > 0 && (
          <div className="shrink-0">
            <FilterDropdown
              label="Filter by tag"
              options={allTags}
              selected={selectedTags}
              onChange={setSelectedTags}
            />
          </div>
        )}
      </div>
      <hr className="border-border mb-8" />

      <div className="space-y-6">
        {filtered.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
            <div className="flex gap-5 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200 overflow-hidden">
              {post.feature_image && (
                <div className="hidden sm:block relative shrink-0 w-40 h-32 overflow-hidden">
                  <Image
                    src={post.feature_image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="flex-1 p-5 flex flex-col justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-wrap">
                    <time className="text-xs text-muted-foreground">
                      {new Date(post.date).toLocaleDateString('en-AU', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                    {post.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-full px-2 py-0.5 text-xs transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="text-center py-12 text-muted-foreground">No posts match this filter.</p>
        )}
      </div>
    </div>
  )
}
