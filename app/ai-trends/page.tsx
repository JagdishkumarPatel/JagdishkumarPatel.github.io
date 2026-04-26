"use client"

import * as React from "react"
import { FilterDropdown } from "@/components/portfolio/filter-dropdown"
import { ChevronDown, Search, X, SlidersHorizontal } from "lucide-react"

const DEFAULT_VISIBLE = 10

interface NewsItem {
  title: string
  url: string
  feedSource: string
  source: string
  score: number
  publishedAt: string
  summary: string
  tags: string[]
  engagementScore: number
}

interface NewsFeed {
  updatedAt: string
  sources: string[]
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
  const [activeSource, setActiveSource] = React.useState<string[]>([])
  const [activeDays, setActiveDays] = React.useState(0)
  const [keyword, setKeyword] = React.useState("")
  const [visibleCount, setVisibleCount] = React.useState(DEFAULT_VISIBLE)
  const [sortBy, setSortBy] = React.useState<"score" | "date">("score")
  const [timeOpen, setTimeOpen] = React.useState(false)
  const [filterSheetOpen, setFilterSheetOpen] = React.useState(false)
  const timeRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (timeRef.current && !timeRef.current.contains(e.target as Node)) setTimeOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setTimeOpen(false); setFilterSheetOpen(false) }
    }
    document.addEventListener("mousedown", onClickOutside)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onClickOutside)
      document.removeEventListener("keydown", onKey)
    }
  }, [])

  // Lock body scroll when bottom sheet open
  React.useEffect(() => {
    document.body.style.overflow = filterSheetOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [filterSheetOpen])

  // Derive available tags, sources and filtered items
  const allTags = React.useMemo(() => {
    if (!feed) return []
    const tagSet = new Set<string>()
    feed.items.forEach((item) => item.tags.forEach((t) => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }, [feed])

  const allFeedSources = React.useMemo(() => {
    if (!feed) return []
    const s = new Set<string>()
    feed.items.forEach((item) => s.add(item.feedSource))
    return Array.from(s).sort()
  }, [feed])

  const filteredItems = React.useMemo(() => {
    if (!feed) return []
    const cutoff = activeDays > 0 ? Date.now() - activeDays * 86400000 : 0
    const kw = keyword.trim().toLowerCase()
    const filtered = feed.items.filter((item) => {
      if (activeSource.length > 0 && !activeSource.includes(item.feedSource)) return false
      if (activeTag.length > 0 && !activeTag.some((t) => item.tags.includes(t))) return false
      if (cutoff && new Date(item.publishedAt).getTime() < cutoff) return false
      if (kw && !item.title.toLowerCase().includes(kw) && !item.summary.toLowerCase().includes(kw) && !item.source.toLowerCase().includes(kw)) return false
      return true
    })
    if (sortBy === "date") {
      return [...filtered].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    }
    return filtered
  }, [feed, activeTag, activeSource, activeDays, keyword, sortBy])

  const filterCount = (activeSource.length > 0 ? 1 : 0) + (activeTag.length > 0 ? 1 : 0) + (activeDays > 0 ? 1 : 0)
  const hasActiveFilters = filterCount > 0 || keyword.trim() !== "" || sortBy !== "score"

  function clearFilters() {
    setActiveTag([])
    setActiveSource([])
    setActiveDays(0)
    setKeyword("")
    setSortBy("score")
    setVisibleCount(DEFAULT_VISIBLE)
  }

  // Reset visible count when filters change
  React.useEffect(() => { setVisibleCount(DEFAULT_VISIBLE) }, [activeTag, activeSource, activeDays, keyword])

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
    <main className="min-h-screen pt-24 pb-16 px-6">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-10">
          <p className="font-mono text-primary text-sm mb-2"><span>{'// ai latest news'}</span></p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">
            AI Latest News
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

        {/* Filters */}
        {!loading && !error && (
          <div className="mb-8 space-y-3">

            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search by keyword, title, or source…"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full rounded-lg border border-border bg-card pl-9 pr-9 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
              />
              {keyword && (
                <button onClick={() => setKeyword("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Controls row */}
            <div className="flex items-center gap-3">
              {/* Sort toggle — always visible */}
              <div className="inline-flex rounded-lg border border-border bg-card overflow-hidden shrink-0">
                <button
                  onClick={() => setSortBy("score")}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    sortBy === "score" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Relevance
                </button>
                <button
                  onClick={() => setSortBy("date")}
                  className={`px-3 py-2 text-sm font-medium transition-colors border-l border-border ${
                    sortBy === "date" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Newest
                </button>
              </div>

              {/* Mobile: single Filters button */}
              <button
                onClick={() => setFilterSheetOpen(true)}
                className={`md:hidden inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors ${
                  filterCount > 0
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                <SlidersHorizontal size={14} />
                Filters
                {filterCount > 0 && (
                  <span className="rounded-full bg-primary text-primary-foreground text-xs px-1.5 py-0.5 leading-none">
                    {filterCount}
                  </span>
                )}
              </button>

              {/* Desktop: inline dropdowns */}
              <div className="hidden md:flex items-center gap-3">
                {/* Time period */}
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
                    <div className="absolute right-0 top-full mt-1.5 z-50 min-w-[160px] rounded-xl border border-border bg-card shadow-lg">
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
                {allFeedSources.length > 1 && (
                  <FilterDropdown label="Source" options={allFeedSources} selected={activeSource} onChange={setActiveSource} />
                )}
                {allTags.length > 0 && (
                  <FilterDropdown label="Tag" options={allTags} selected={activeTag} onChange={setActiveTag} />
                )}
              </div>

              {/* Clear all — desktop */}
              {hasActiveFilters && (
                <button onClick={clearFilters} className="hidden md:block text-xs text-muted-foreground hover:text-primary transition-colors ml-auto">
                  Clear all
                </button>
              )}
            </div>

            {/* Active filter pills — both mobile and desktop */}
            {(activeSource.length > 0 || activeTag.length > 0 || activeDays > 0) && (
              <div className="flex flex-wrap gap-2">
                {activeDays > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 text-xs font-medium">
                    {TIME_PERIODS.find((p) => p.value === activeDays)?.label}
                    <button onClick={() => setActiveDays(0)} className="hover:text-primary/60 ml-0.5"><X size={11} /></button>
                  </span>
                )}
                {activeSource.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 text-xs font-medium">
                    {s}
                    <button onClick={() => setActiveSource(activeSource.filter((x) => x !== s))} className="hover:text-primary/60 ml-0.5"><X size={11} /></button>
                  </span>
                ))}
                {activeTag.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 text-xs font-medium">
                    {t}
                    <button onClick={() => setActiveTag(activeTag.filter((x) => x !== t))} className="hover:text-primary/60 ml-0.5"><X size={11} /></button>
                  </span>
                ))}
                {/* Mobile clear all */}
                <button onClick={clearFilters} className="md:hidden text-xs text-muted-foreground hover:text-primary transition-colors self-center ml-1">
                  Clear all
                </button>
              </div>
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

        {!loading && !error && feed && feed.items.length === 0 && (
          <p className="text-muted-foreground text-sm">Feed is being populated. Check back soon.</p>
        )}

        {!loading && !error && feed && filteredItems.length === 0 && feed.items.length > 0 && (
          <p className="text-muted-foreground text-sm">No articles match the current filters. <button onClick={clearFilters} className="text-primary hover:underline">Clear filters</button></p>
        )}

        {!loading && !error && feed && filteredItems.length > 0 && (
          <>
            <ol className="space-y-4">
              {filteredItems.slice(0, visibleCount).map((item, idx) => (
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
                          {/* Feed source badge */}
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${
                            item.feedSource === 'Hacker News'     ? 'bg-orange-500/10 text-orange-500' :
                            item.feedSource === 'Reddit'          ? 'bg-red-500/10 text-red-500' :
                            item.feedSource === 'arXiv'           ? 'bg-blue-500/10 text-blue-500' :
                            item.feedSource === 'OpenAI'          ? 'bg-emerald-500/10 text-emerald-500' :
                            item.feedSource === 'Anthropic'       ? 'bg-amber-500/10 text-amber-600' :
                            item.feedSource === 'Google AI'       ? 'bg-sky-500/10 text-sky-500' :
                            item.feedSource === 'Microsoft AI'    ? 'bg-indigo-500/10 text-indigo-500' :
                            item.feedSource === 'DeepMind'        ? 'bg-violet-500/10 text-violet-500' :
                            item.feedSource === 'Meta AI'         ? 'bg-blue-600/10 text-blue-600' :
                            item.feedSource === 'Hugging Face'    ? 'bg-yellow-500/10 text-yellow-600' :
                            item.feedSource === 'VentureBeat'     ? 'bg-pink-500/10 text-pink-500' :
                            item.feedSource === 'MIT Tech Review' ? 'bg-rose-500/10 text-rose-500' :
                            item.feedSource === 'The Verge'       ? 'bg-purple-500/10 text-purple-500' :
                            item.feedSource === 'Wired'           ? 'bg-slate-500/10 text-slate-500' :
                            item.feedSource === 'Papers With Code'? 'bg-teal-500/10 text-teal-500' :
                            'bg-muted text-muted-foreground'
                          }`}>{item.feedSource}</span>
                          <span className="font-mono">{item.source}</span>
                          <span>·</span>
                          <span>{timeAgo(item.publishedAt)}</span>
                          {item.engagementScore > 0 && (
                            <>
                              <span>·</span>
                              <span>▲ {item.engagementScore} pts</span>
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

            {/* Show more / show less */}
            {filteredItems.length > DEFAULT_VISIBLE && (
              <div className="mt-6 flex items-center justify-center gap-4">
                {visibleCount < filteredItems.length && (
                  <button
                    onClick={() => setVisibleCount((n) => Math.min(n + 10, filteredItems.length))}
                    className="rounded-lg border border-border bg-card px-5 py-2 text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
                  >
                    Show more ({filteredItems.length - visibleCount} remaining)
                  </button>
                )}
                {visibleCount > DEFAULT_VISIBLE && (
                  <button
                    onClick={() => setVisibleCount(DEFAULT_VISIBLE)}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Show less
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* Dynamic JSON-LD for Google rich snippets */}
        {!loading && feed && feed.items.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                name: "Top AI/ML Trends — Curated by Jag Patel, Principal AI/ML Engineer",
                url: "https://jagdishkumarpatel.github.io/ai-trends",
                numberOfItems: feed.items.length,
                itemListElement: feed.items.slice(0, 10).map((item, idx) => ({
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
            <a href="https://news.ycombinator.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Hacker News</a>
            {" · "}
            <a href="https://reddit.com/r/MachineLearning" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Reddit</a>
            {" · "}
            <a href="https://arxiv.org/list/cs.AI/recent" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">arXiv</a>
            {" · "}
            <a href="https://openai.com/news" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenAI</a>
            {" · "}
            <a href="https://anthropic.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Anthropic</a>
            {" · "}
            <a href="https://deepmind.google/blog" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">DeepMind</a>
            {" · "}
            <a href="https://ai.meta.com/blog" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meta AI</a>
            {" · "}
            <a href="https://huggingface.co/blog" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Hugging Face</a>
            {" · "}and more · Ranked by Jag Patel&apos;s scoring algorithm · Updated every 3 hours
          </p>
        </div>
      </div>

      {/* Mobile filter bottom sheet — rendered inside <main> so it's in the React tree */}
      {filterSheetOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setFilterSheetOpen(false)}
          />
          {/* Sheet */}
          <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-border bg-background px-5 pb-8 pt-4 shadow-2xl">
            {/* Handle */}
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted" />
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-foreground">Filters</h3>
              <button onClick={() => setFilterSheetOpen(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>

            {/* Time period */}
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Time period</p>
              <div className="flex flex-wrap gap-2">
                {TIME_PERIODS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setActiveDays(p.value)}
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      activeDays === p.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Source */}
            {allFeedSources.length > 1 && (
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Source</p>
                <div className="flex flex-wrap gap-2">
                  {allFeedSources.map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveSource(activeSource.includes(s) ? activeSource.filter((x) => x !== s) : [...activeSource, s])}
                      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                        activeSource.includes(s)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {allTags.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Topic</p>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveTag(activeTag.includes(t) ? activeTag.filter((x) => x !== t) : [...activeTag, t])}
                      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                        activeTag.includes(t)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              {filterCount > 0 && (
                <button
                  onClick={() => { setActiveTag([]); setActiveSource([]); setActiveDays(0) }}
                  className="flex-1 rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear filters
                </button>
              )}
              <button
                onClick={() => setFilterSheetOpen(false)}
                className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {filteredItems.length === 0 ? "No results" : `Show ${filteredItems.length} article${filteredItems.length !== 1 ? "s" : ""}`}
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  )
}
