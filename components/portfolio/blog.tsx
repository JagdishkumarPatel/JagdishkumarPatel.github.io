
import Link from "next/link"
import { getAllPosts } from "@/lib/posts"

export function Blog() {
  const blogPosts = getAllPosts()

  return (
    <section id="blog" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Latest Blog Posts</h2>
        <div className="max-w-4xl mx-auto space-y-8">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <div className="bg-card rounded-lg p-6 shadow-lg border border-border hover:border-primary transition-colors">
                {post.feature_image && (
                  <img
                    src={post.feature_image}
                    alt={post.title}
                    className="w-full object-cover rounded-lg mb-4 max-h-48"
                  />
                )}
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <time className="text-sm text-muted-foreground">
                    {new Date(post.date).toLocaleDateString("en-AU", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
          {blogPosts.length === 0 && (
            <p className="text-center mt-8 text-muted-foreground">More posts coming soon!</p>
          )}
        </div>
      </div>
    </section>
  )
}
