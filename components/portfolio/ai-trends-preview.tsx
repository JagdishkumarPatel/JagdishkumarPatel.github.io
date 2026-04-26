import fs from "fs"
import path from "path"
import Link from "next/link"
import { ArrowRight, ExternalLink } from "lucide-react"

interface NewsItem {
  title: string
  url: string
  feedSource: string
  source: string
  publishedAt: string
  summary: string
  tags: string[]
  engagementScore: number
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return "< 1h ago"
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const SOURCE_STYLES: Record<string, string> = {
  "Hacker News":     "bg-orange-500/10 text-orange-500",
  "Reddit":          "bg-red-500/10 text-red-500",
  "arXiv":           "bg-blue-500/10 text-blue-500",
  "OpenAI":          "bg-emerald-500/10 text-emerald-500",
  "Anthropic":       "bg-amber-500/10 text-amber-600",
  "Google AI":       "bg-sky-500/10 text-sky-500",
  "Microsoft AI":    "bg-indigo-500/10 text-indigo-500",
  "DeepMind":        "bg-violet-500/10 text-violet-500",
  "Meta AI":         "bg-blue-600/10 text-blue-600",
  "Hugging Face":    "bg-yellow-500/10 text-yellow-600",
  "VentureBeat":     "bg-pink-500/10 text-pink-500",
  "MIT Tech Review": "bg-rose-500/10 text-rose-500",
  "The Verge":       "bg-purple-500/10 text-purple-500",
  "Wired":           "bg-slate-500/10 text-slate-500",
  "Papers With Code":"bg-teal-500/10 text-teal-500",
}

function getTopItems(): NewsItem[] {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "top-news.json")
    const raw = fs.readFileSync(filePath, "utf-8")
    const data = JSON.parse(raw)
    return (data.items ?? []).slice(0, 4)
  } catch {
    return []
  }
}

export function AiTrendsPreview() {
  const items = getTopItems()

  return (
    <section id="ai-trends" className="py-14 mx-auto max-w-4xl px-6">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="font-mono text-sm text-primary mb-1">{">"}  ai latest news</p>
          <h2 className="text-3xl font-extrabold tracking-tight gradient-heading">AI Latest News</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Top AI/ML developments right now — curated from HN, Reddit, arXiv, OpenAI, Anthropic, Google, Microsoft, DeepMind, Meta & more.
          </p>
        </div>
        <Link
          href="/ai-trends"
          className="text-sm text-muted-foreground hover:text-primary transition-colors shrink-0"
        >
          View all →
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Feed is being populated — check back soon or{" "}
          <Link href="/ai-trends" className="text-primary hover:underline">
            view the full page
          </Link>
          .
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200 p-5 gap-3"
            >
              {/* Source badge + time */}
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${
                    SOURCE_STYLES[item.feedSource] ?? "bg-muted text-muted-foreground"
                  }`}
                >
                  {item.feedSource}
                </span>
                <span className="text-xs text-muted-foreground font-mono shrink-0">
                  {timeAgo(item.publishedAt)}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-3 flex-1">
                {item.title}
              </h3>

              {/* Summary */}
              {item.summary && (
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {item.summary}
                </p>
              )}

              {/* Footer: tags + external link icon */}
              <div className="flex items-center justify-between gap-2 mt-auto">
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 rounded-full border bg-muted text-muted-foreground border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <ExternalLink
                  size={12}
                  className="text-muted-foreground group-hover:text-primary transition-colors shrink-0"
                />
              </div>
            </a>
          ))}
        </div>
      )}

      {/* View all CTA */}
      <div className="mt-6 text-center">
        <Link
          href="/ai-trends"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          See all trending AI articles
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  )
}
