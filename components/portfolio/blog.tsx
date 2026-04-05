
import blogPosts from "../../public/metadata/blog-posts.json";

export function Blog() {
  return (
    <section id="blog" className="py-20">
      <div className="container mx-auto px-4">
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">Latest Blog Posts</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            {blogPosts.map((post) => (
              <div key={post.slug} className="bg-card rounded-lg p-6 shadow-lg">
                {post.feature_image && (
                  <img
                    src={post.feature_image}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <div className="text-sm text-muted-foreground">
                  {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            ))}
            {blogPosts.length === 0 && (
              <p className="text-center mt-8 text-muted-foreground">
                More posts coming soon with MDX support!
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}