
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getAllPosts } from "@/lib/posts"

export function Blog() {
  const blogPosts = getAllPosts()

  return (
    <section id="blog" className="py-24 mx-auto max-w-4xl px-6">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <p className="font-mono text-sm text-primary mb-1">{">"} writing</p>
          <h2 className="text-3xl font-extrabold tracking-tight">Latest Posts</h2>
        </div>
      </div>

      <div className="space-y-6">
        {blogPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
            <div className="flex gap-5 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200 overflow-hidden">
              {/* Image */}
              {post.feature_image && (
                <div className="hidden sm:block shrink-0 w-40 h-32 overflow-hidden">
                  <img
                    src={post.feature_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 p-5 flex flex-col justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <time className="text-xs text-muted-foreground">
                      {new Date(post.date).toLocaleDateString("en-AU", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                    {post.tags && post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          </Link>
        ))}
        {blogPosts.length === 0 && (
          <p className="text-center py-12 text-muted-foreground">More posts coming soon.</p>
        )}
      </div>
    </section>
  )
}
