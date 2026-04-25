"use client"

import * as React from "react"
import { FilterDropdown } from "@/components/portfolio/filter-dropdown"
import { ChevronDown } from "lucide-react"

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

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return "< 1h ago"
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const TIME_PERIODS = [
  { label: "All time", value: 0 },
  { label: "Last 24h", value: 1 },
  { label: "Last week", value: 7 },
  { label: "Last month", value: 30 },
]

export default function AITrendsPage() {
  const [feed, setFeed] = React.useState<NewsFeed | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")
  const [activeTag, setActiveTag] = React.useState<string[]>([])
  const [activeDays, setActiveDays] = React.useState(0)
  const [timeOpen, setTimeOpen] = React.useState(false)
  const timeRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (timeRef.current && !timeRef.current.contains(e.target as Node)) setTimeOpen(false)
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setTimeOpen(false) }
    document.addEventListener("mousedown", onClickOutside)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onClickOutside)
      document.removeEventListener("keydown", onKey)
    }
  }, [])

  // Derive available tags and filtered items
  const allTags = React.useMemo(() => {
    if (!feed) return []
    const tagSet = new Set<string>()
    feed.items.forEach((item) => item.tags.forEach((t) => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }, [feed])

  const filteredItems = React.useMemo(() => {
    if (!feed) return []
    const cutoff = activeDays > 0 ? Date.now() - activeDays * 86400000 : 0
    return feed.items.filter((item) => {
      if (activeTag.length > 0 && !activeTag.some((t) => item.tags.includes(t))) return false
      if (cutoff && new Date(item.publishedAt).getTime() < cutoff) return false
      return true
    })
  }, [feed, activeTag, activeDays])

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
          <p className="font-mono text-primary text-sm mb-2"><span>{'// real-time intelligence'}</span></p>
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

        {/* Filters — side by side, matching blog page pattern */}
        {!loading && !error && (
          <div className="mb-8 flex items-center gap-3">
            {/* Time period dropdown */}
            <div className="relative shrink-0" ref={timeRef}>
              <button
                onClick={() => setTimeOpen((o) => !o)}
                className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors ${
                  activeDays > 0
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {TIME_PERIODS.find((p) => p.value === activeDays)?.label ?? "All time"}
                <ChevronDown size={14} className={`transition-transform duration-200 ${timeOpen ? "rotate-180" : ""}`} />
              </button>
              {timeOpen && (
                <div className="absolute left-0 top-full mt-1.5 z-50 min-w-[160px] rounded-xl border border-border bg-card shadow-lg">
                  <div className="p-1">
                    {TIME_PERIODS.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => { setActiveDays(p.value); setTimeOpen(false) }}
                        className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-left transition-colors ${
                          activeDays === p.value
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tag dropdown — reuse blog FilterDropdown */}
            {allTags.length > 0 && (
              <FilterDropdown
                label="Filter by tag"
                options={allTags}
                selected={activeTag}
                onChange={setActiveTag}
              />
            )}
          </div>
        )}

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

        {!loading && !error && feed && filteredItems.length === 0 && feed.items.length > 0 && (
          <p className="text-muted-foreground text-sm">No articles match the current filters. <button onClick={() => { setActiveTag([]); setActiveDays(0) }} className="text-primary hover:underline">Clear filters</button></p>
        )}

        {!loading && !error && feed && filteredItems.length > 0 && (
          <ol className="space-y-4">
            {filteredItems.map((item, idx) => (
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

                      {/* Summary */}
                      {item.summary && (
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                          {item.summary}
                        </p>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] px-2 py-0.5 rounded-full border font-medium bg-muted text-muted-foreground border-border"
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

        {/* Dynamic JSON-LD for Google rich snippets */}
        {!loading && feed && feed.items.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                name: "Top 10 AI/ML Trends — Curated by Jag Patel, Principal AI/ML Engineer",
                url: "https://jagdishkumarpatel.github.io/ai-trends",
                numberOfItems: feed.items.length,
                itemListElement: feed.items.map((item, idx) => ({
                  "@type": "ListItem",
                  position: idx + 1,
                  name: item.title,
                  url: item.url,
                  description: item.summary || undefined,
                })),
              }),
            }}
          />
        )}

        {/* Footer attribution */}
        <div className="mt-12 pt-8 border-t border-border text-xs text-muted-foreground font-mono">
          <p>
            Data sourced from{" "}
            <a href="https://news.ycombinator.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Hacker News
            </a>{" "}
            · Ranked by Jag Patel&apos;s scoring algorithm · Updated every 3 hours
          </p>
        </div>
      </div>
    </main>
  )
}
