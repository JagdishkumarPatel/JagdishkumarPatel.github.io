"use client"

import * as React from "react"
import type { Metadata } from "next"

interface NewsItem {
  title: string
  url: string
  source: string
  score: number
  publishedAt: string
  summary: string
  tags: string[]
  hnScore: number
}

interface NewsFeed {
  updatedAt: string
  items: NewsItem[]
}

const TAG_COLORS: Record<string, string> = {
  LLM: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  Agents: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Research: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "Open Source": "bg-orange-500/15 text-orange-400 border-orange-500/30",
  RAG: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  Vision: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  Safety: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  AI: "bg-primary/15 text-primary border-primary/30",
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return "< 1h ago"
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function AITrendsPage() {
  const [feed, setFeed] = React.useState<NewsFeed | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    fetch("/data/top-news.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load feed")
        return r.json()
      })
      .then((data: NewsFeed) => {
        setFeed(data)
        setLoading(false)
      })
      .catch(() => {
        setError("Could not load AI trends. Please try again later.")
        setLoading(false)
      })
  }, [])

  return (
    <main className="min-h-screen bg-background pt-24 pb-16 px-6">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-10">
          <p className="font-mono text-primary text-sm mb-2">// real-time intelligence</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">
            Top 10 AI Trends
          </h1>
          <p className="text-muted-foreground text-base max-w-xl">
            The most important AI/ML developments right now — ranked by recency, source authority,
            and community engagement. Curated by{" "}
            <span className="text-foreground font-medium">Jag Patel</span>, Principal AI/ML Engineer.
          </p>
          {feed?.updatedAt && (
            <p className="mt-3 text-xs text-muted-foreground font-mono">
              Last updated: {new Date(feed.updatedAt).toUTCString()}
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-5 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Feed */}
        {!loading && !error && feed && feed.items.length === 0 && (
          <p className="text-muted-foreground text-sm">Feed is being populated. Check back soon.</p>
        )}

        {!loading && !error && feed && feed.items.length > 0 && (
          <ol className="space-y-4">
            {feed.items.map((item, idx) => (
              <li key={item.url}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-card/80 transition-all duration-200 p-5"
                >
                  <div className="flex items-start gap-4">
                    {/* Rank */}
                    <span className="font-mono text-2xl font-bold text-primary/30 group-hover:text-primary/60 transition-colors min-w-[2rem] leading-none mt-1">
                      {String(idx + 1).padStart(2, "0")}
                    </span>

                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
                        {item.title}
                      </h2>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mb-3">
                        <span className="font-mono">{item.source}</span>
                        <span>·</span>
                        <span>{timeAgo(item.publishedAt)}</span>
                        {item.hnScore > 0 && (
                          <>
                            <span>·</span>
                            <span>▲ {item.hnScore} pts</span>
                          </>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${
                              TAG_COLORS[tag] ?? "bg-muted text-muted-foreground border-border"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ol>
        )}

        {/* Footer attribution */}
        <div className="mt-12 pt-8 border-t border-border text-xs text-muted-foreground font-mono">
          <p>
            Data sourced from{" "}
            <a href="https://news.ycombinator.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Hacker News
            </a>{" "}
            · Ranked by Jag Patel's scoring algorithm · Updated every 3 hours
          </p>
        </div>
      </div>
    </main>
  )
}
