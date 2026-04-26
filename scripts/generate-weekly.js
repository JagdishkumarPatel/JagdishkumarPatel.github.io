#!/usr/bin/env node
/**
 * generate-weekly.js
 * Reads public/data/top-news.json, filters + scores the last 7 days,
 * and writes a focused editorial draft to content/drafts/
 *
 * Run manually:  node scripts/generate-weekly.js
 * Or via GitHub Actions every Sunday.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

// ── Config ────────────────────────────────────────────────────────────────────
const DATA_FILE       = path.join(ROOT, 'public/data/top-news.json')
const OUT_DIR         = path.join(ROOT, 'content/drafts')
const AUTHOR          = 'Jag Patel'
const MAX_SECTIONS    = 3   // only top 3 most-populated buckets make the post
const MAX_PER_SECTION = 3   // top stories shown per section
const MAX_SECONDARY   = 3   // secondary updates bullet list below sections
const MIN_RELEVANCE   = 2   // items scoring below this are excluded entirely

// ── Relevance filtering ───────────────────────────────────────────────────────
// Terms that MUST appear for an item to be included
const AI_SIGNAL_TERMS = [
  'ai', 'ml', 'machine learning', 'deep learning', 'neural', 'llm', 'gpt', 'claude',
  'gemini', 'mistral', 'deepseek', 'llama', 'model', 'agent', 'automation', 'openai',
  'anthropic', 'deepmind', 'hugging', 'arxiv', 'research', 'inference', 'training',
  'fine-tun', 'embedding', 'transformer', 'diffusion', 'generative', 'copilot',
  'alignment', 'safety', 'benchmark', 'dataset', 'foundation model', 'multimodal',
  'vision model', 'language model', 'reinforcement', 'vector', 'rag', 'prompt',
]

// Terms that immediately disqualify an item (noise / lifestyle / deals)
const EXCLUDE_TERMS = [
  'promo code', 'deal', 'discount', 'sale', 'off plus', 'free shipping',
  'gift', 'mug', 'pool clean', 'ping-pong', 'table tennis', 'dualsense', 'ps5',
  'airpod', 'shoe', 'running shoe', 'cook legacy', 'michael jackson', 'civil war',
  'focus timer', 'focus app', 'focus friend', 'forest app',
]

/**
 * Score an item's AI relevance (0–5).
 * 0 = irrelevant, 5 = highly relevant
 */
function relevanceScore(item) {
  const text = `${item.title || ''} ${item.summary || ''} ${(item.tags || []).join(' ')}`.toLowerCase()

  // Hard exclusion
  if (EXCLUDE_TERMS.some(t => text.includes(t))) return 0

  // Must have at least one AI signal
  const signalCount = AI_SIGNAL_TERMS.filter(t => text.includes(t)).length
  if (signalCount === 0) return 0

  let score = Math.min(signalCount, 3) // 1-3 from signal density

  // Bonus: from high-signal sources
  if (['arXiv', 'OpenAI', 'Anthropic', 'DeepMind', 'Google AI', 'HuggingFace', 'Meta AI'].includes(item.feedSource)) score += 1
  if (['MIT Tech Review', 'VentureBeat', 'TechCrunch'].includes(item.feedSource)) score += 0.5

  // Bonus: explicitly AI-tagged
  if ((item.tags || []).some(t => /ai|llm|agent|ml|safety/i.test(t))) score += 1

  return Math.min(score, 5)
}

// ── Tag buckets ───────────────────────────────────────────────────────────────
const TAG_BUCKETS = [
  { heading: 'Large Language Models',     match: ['llms', 'llm', 'gpt', 'claude', 'gemini', 'mistral', 'language models', 'foundation model'] },
  { heading: 'AI Agents & Automation',    match: ['agents', 'agent', 'automation', 'agentic', 'mcp', 'tool use', 'orchestration'] },
  { heading: 'AI Safety & Alignment',     match: ['safety', 'ethics', 'alignment', 'responsible ai', 'bias', 'audit', 'red team', 'jailbreak'] },
  { heading: 'Research & Breakthroughs',  match: ['research', 'arxiv', 'papers', 'academic', 'benchmark', 'study'] },
  { heading: 'AI Infrastructure & MLOps', match: ['infrastructure', 'mlops', 'ml infra', 'devops', 'platform', 'inference', 'training'] },
  { heading: 'Open Source & Models',      match: ['open source', 'opensource', 'huggingface', 'github', 'release', 'weights'] },
  { heading: 'Industry & Enterprise',     match: ['industry', 'business', 'startup', 'funding', 'enterprise', 'layoff', 'acquisition'] },
]
const FALLBACK_BUCKET = 'Notable Updates'

// ── Helpers ───────────────────────────────────────────────────────────────────

function isoDate(d) {
  return d.toISOString().split('T')[0]
}

/** Monday of the ISO week containing `date` */
function weekStart(date) {
  const d = new Date(date)
  const day = d.getDay() // 0 = Sunday
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function formatDateLong(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

function bucketItem(item) {
  const itemTags = (item.tags || []).map(t => t.toLowerCase())
  for (const bucket of TAG_BUCKETS) {
    const matchers = bucket.match.map(m => m.toLowerCase())
    if (matchers.some(m => itemTags.includes(m))) return bucket.heading
  }
  return FALLBACK_BUCKET
}

function slug(dateStr) {
  // e.g. ai-weekly-april-27-2026
  const d = new Date(dateStr)
  const month = d.toLocaleDateString('en-US', { month: 'long' }).toLowerCase()
  return `ai-weekly-${month}-${d.getDate()}-${d.getFullYear()}`
}

function titleCase(str) {
  return str.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1))
}

// ── Main ──────────────────────────────────────────────────────────────────────

if (!fs.existsSync(DATA_FILE)) {
  console.error('[generate-weekly] top-news.json not found — run fetch-news.js first.')
  process.exit(1)
}

const rawData  = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
const allItems = Array.isArray(rawData) ? rawData : (rawData.items || [])

const now     = new Date()
const cutoff  = new Date(now - 7 * 24 * 60 * 60 * 1000)

// Filter to last 7 days, score for relevance, drop noise below threshold
const week = allItems
  .filter(item => new Date(item.publishedAt) >= cutoff)
  .map(item => ({ ...item, score: relevanceScore(item) }))
  .filter(item => item.score >= MIN_RELEVANCE)
  .sort((a, b) => b.score - a.score)

if (week.length === 0) {
  console.log('[generate-weekly] No articles in the last 7 days — nothing to generate.')
  process.exit(0)
}

// Group into buckets
const grouped = {}
for (const item of week) {
  const b = bucketItem(item)
  if (!grouped[b]) grouped[b] = []
  grouped[b].push(item)
}

// Determine ordered sections — top MAX_SECTIONS by article count
const orderedBuckets = [
  ...TAG_BUCKETS.map(b => b.heading).filter(h => grouped[h]?.length > 0),
  ...(grouped[FALLBACK_BUCKET]?.length > 0 ? [FALLBACK_BUCKET] : [])
]
  .sort((a, b) => (grouped[b]?.length || 0) - (grouped[a]?.length || 0))
  .slice(0, MAX_SECTIONS)

const postDate = isoDate(now)
const postSlug = slug(postDate)
const weekStartDate = formatDateLong(isoDate(weekStart(now)))
const weekEndDate   = formatDateLong(postDate)

// Build a short lead summary from top sources appearing this week
const sourceSet = [...new Set(week.map(i => i.feedSource).filter(Boolean))].slice(0, 6)
const topTitles = week.slice(0, 3).map(i => i.title).join(', ')

// SEO: rich but natural description  (160 char target)
const descriptionRaw =
  `Top AI and machine learning developments for the week of ${weekStartDate}: ` +
  `${week.length} stories across LLMs, AI agents, research, and industry news ` +
  `curated by ${AUTHOR}.`
const description = descriptionRaw.length > 160
  ? descriptionRaw.slice(0, 157) + '...'
  : descriptionRaw

// SEO keywords anchored to "Jag Patel" + topical terms
const keywordsBase = [
  'Jag Patel', 'Jagdishkumar Patel',
  'AI news this week', `AI weekly ${new Date(postDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
  'machine learning news', 'LLM news', 'AI agent news', 'AI research roundup',
  'this week in AI', 'weekly AI summary', 'AI headlines'
]
// Add any prominent bucket/source as bonus keywords
const bucketKeywords = orderedBuckets.slice(0, 4).map(b => `${b} news`)
const keywords = [...keywordsBase, ...bucketKeywords]

// Tags for blog listing page (broad, discoverable)
const tagsBase = [
  'Jag Patel', 'AI Weekly', 'Machine Learning', 'LLM', 'AI News',
  'Weekly Roundup', 'Artificial Intelligence', 'Deep Learning', 'MLOps', 'AI Agents'
]
const tags = [...new Set([...tagsBase, ...orderedBuckets.slice(0, 4)])]

// ── Content helpers ───────────────────────────────────────────────────────────

const SOURCE_LABELS = {
  'Hacker News':     '🟠 Hacker News',
  'arXiv':           '📄 arXiv',
  'OpenAI':          '🤖 OpenAI',
  'Anthropic':       '🧠 Anthropic',
  'Google AI':       '🔵 Google AI',
  'DeepMind':        '🔬 DeepMind',
  'Meta AI':         '🌐 Meta AI',
  'Microsoft':       '🪟 Microsoft',
  'HuggingFace':     '🤗 Hugging Face',
  'MIT Tech Review': '🔬 MIT Tech Review',
  'Wired':           '⚡ Wired',
  'The Verge':       '📱 The Verge',
  'VentureBeat':     '💼 VentureBeat',
  'TechCrunch':      '🚀 TechCrunch',
  'Reddit':          '👽 Reddit',
}

// Per-section: static insight + dynamic key-takeaway seeded from article titles
const SECTION_ANALYSIS = {
  'Large Language Models': {
    insight: 'Foundation model development is rapidly shifting from raw benchmark performance to controllability, safety, and real-world deployment constraints.',
    takeaway: 'LLMs are improving in capability faster than in controllability — the next frontier is reliable, auditable behaviour under adversarial conditions.',
  },
  'AI Agents & Automation': {
    insight: 'Agent-based systems are moving beyond demos. This week\'s stories show increasing focus on multi-step, enterprise-grade workflows and evaluation frameworks.',
    takeaway: 'The agent engineering challenge has shifted from "can it reason?" to "can it be trusted in production workflows at scale?"',
  },
  'Research & Papers': {
    insight: 'Academic research this week concentrated on long-horizon reasoning, alignment gaps, and evaluation methodology — foundational problems that will shape systems for years.',
    takeaway: 'The papers published today are the product features shipped in 12–18 months. Alignment and evaluation quality are the two critical bottlenecks.',
  },
  'AI Infrastructure & MLOps': {
    insight: 'Infrastructure investment is accelerating as organisations move from AI experimentation to production. Reliability, observability, and cost efficiency are now top priorities.',
    takeaway: 'Platform engineers who understand AI infrastructure will be among the most sought-after roles over the next 3 years.',
  },
  'Open Source': {
    insight: 'The open-source ecosystem is closing the capability gap with frontier proprietary models faster than most predicted — driven by efficient architectures and community-scale fine-tuning.',
    takeaway: 'Open-source AI is no longer a "good enough" fallback. For many enterprise use cases, it\'s becoming the default-first choice.',
  },
  'Computer Vision & Multimodal': {
    insight: 'Multimodal AI is pushing past image understanding into video, spatial reasoning, and real-time perception — expanding the surface area of AI deployment dramatically.',
    takeaway: 'The next generation of AI products will be multimodal by default, not by exception.',
  },
  'AI Safety & Ethics': {
    insight: 'Safety work is becoming more operational and adversarial — moving from theoretical frameworks to active red-teaming, auditing, and behavioural testing at scale.',
    takeaway: 'AI safety is shifting from a research concern to an engineering discipline. Expect formal safety certifications to become a procurement requirement.',
  },
  'Industry News': {
    insight: 'The AI industry is consolidating around a smaller number of well-capitalised players while specialised vertical AI companies attract significant funding.',
    takeaway: 'Enterprise AI adoption is accelerating, but deployment complexity and governance concerns remain the primary friction points.',
  },
  'Developer Tools': {
    insight: 'The developer tooling layer is maturing rapidly — from experimental SDKs to production-grade APIs, IDE integrations, and workflow automation platforms.',
    takeaway: 'Developers who build with AI tooling today are building the skills that will define engineering practice within 2 years.',
  },
  'General AI News': {
    insight: 'Broad AI coverage this week reflected the widening impact of AI across sectors beyond pure tech — healthcare, media, military, and consumer applications.',
    takeaway: 'AI\'s reach is now too broad to track from within a single discipline. Cross-domain awareness is becoming a core professional competency.',
  },
}

/**
 * Derive "Week in 3 Insights" from the dominant buckets and top articles.
 * Returns an array of 3 insight strings.
 */
function deriveWeekInsights(orderedBuckets, grouped, topStory) {
  const insights = []

  // Insight 1: safety/alignment signal (if present)
  const hasSafety = grouped['AI Safety & Ethics']?.length > 0
  const hasAlignmentResearch = (grouped['Research & Papers'] || [])
    .some(i => /align|fak|jailbreak|safety|audit/i.test(i.title + (i.summary || '')))
  if (hasSafety || hasAlignmentResearch) {
    insights.push('AI safety is becoming more operational — adversarial testing, red-teaming, and alignment audits are now engineering disciplines, not just research topics')
  }

  // Insight 2: agents signal (if present)
  const hasAgents = grouped['AI Agents & Automation']?.length > 0
  if (hasAgents) {
    insights.push('Agent-based systems are entering serious enterprise workflows — the focus has shifted from proof-of-concept demos to reliability, evaluation, and production-grade orchestration')
  }

  // Insight 3: research / open source signal
  const hasOSS = grouped['Open Source']?.length > 0
  const hasResearch = grouped['Research & Papers']?.length > 0
  if (hasOSS) {
    insights.push('Open-source models continue to close the capability gap — for many enterprise use cases, they are now the default-first choice, not a cost-saving compromise')
  } else if (hasResearch) {
    insights.push('Academic research is concentrating on long-horizon reasoning and evaluation methodology — the unsolved problems that will define model reliability for the next generation')
  } else {
    insights.push(`${orderedBuckets[0] || 'AI infrastructure'} dominated the news cycle this week, signalling where industry investment is concentrating heading into the next quarter`)
  }

  // If we got fewer than 3, pad with a general signal
  if (insights.length < 3) {
    insights.push('The pace of AI advancement has shifted from annual breakthroughs to weekly releases — staying current is now a core professional competency for anyone in tech')
  }

  return insights.slice(0, 3)
}

/**
 * Derive a "Why it matters" + "Impact" block for the top story.
 */
function deriveTopStoryAnalysis(item) {
  if (!item) return ''
  const title = (item.title || '').replace(/&#[0-9]+;/g, '')
  const summary = cleanSummary(item.summary)
  const src = item.feedSource || ''

  // Heuristic signals from title/summary
  const isSafety     = /safety|jailbreak|red.team|bug bounty|align|audit/i.test(title + summary)
  const isModel      = /gpt|claude|gemini|mistral|deepseek|llama|model|release/i.test(title + summary)
  const isAgent      = /agent|automat|workflow|orchestrat|agentic/i.test(title + summary)
  const isOSS        = /open.source|hugging|github|release/i.test(title + summary)
  const isResearch   = /arxiv|paper|abstract|research|study/i.test(title + src)
  const isIndustry   = /layoff|funding|acqui|billion|startup|hire|valuation/i.test(title + summary)

  let why = summary || 'This development represents a significant shift in where the industry is focusing its attention.'
  let impact = ''

  if (isSafety) {
    why = `This signals a shift from passive AI safety policies to active adversarial testing. ${src ? src + ' coverage' : 'The story'} reflects growing concern around misuse in high-stakes domains.`
    impact = 'Expect more public red-teaming programmes and formal adversarial audits across AI labs in 2026.'
  } else if (isModel) {
    why = `New model releases set the capability baseline every other team benchmarks against. This one is notable for what it changes about the current frontier.`
    impact = 'Downstream products and APIs built on top of these models will need to re-evaluate assumptions about what is now possible.'
  } else if (isAgent) {
    why = `Agent-based deployments are moving from experimental to production-critical. This story illustrates the maturation of the orchestration layer.`
    impact = 'Engineering teams building on agentic frameworks should watch for evaluation tooling and reliability patterns emerging from this work.'
  } else if (isOSS) {
    why = `Open-source releases reshape the commercial landscape — what was a paid-only capability yesterday becomes a community asset today.`
    impact = 'Enterprise procurement decisions will increasingly need to justify proprietary costs against capable open alternatives.'
  } else if (isResearch) {
    why = `Academic papers from this week will likely become implementation patterns within 12–18 months. The concepts being formalised now are the product features shipped next year.`
    impact = 'Engineers who track research trends have a compounding advantage in anticipating where the tooling is heading.'
  } else if (isIndustry) {
    why = `Industry moves — funding, layoffs, acquisitions — reveal where investor confidence is concentrated and where it is contracting.`
    impact = 'These signals matter for anyone making technology bets: they indicate which platforms and ecosystems have the runway to reach maturity.'
  }

  return `**Why it matters:**\n${why}\n\n**Impact:**\n${impact || 'Monitor how competitors and complementary tooling respond over the next 2–3 weeks.'}`
}

/**
 * Derive "What to watch next week" from dominant themes.
 */
function deriveWatchList(orderedBuckets, grouped) {
  const watches = []

  if (grouped['AI Safety & Ethics']?.length || (grouped['Research & Papers'] || []).some(i => /align|safety/i.test(i.title))) {
    watches.push('More public safety challenges, red-teaming programmes, and adversarial audit announcements from major labs')
  }
  if (grouped['Large Language Models']?.length) {
    watches.push('Continued capability releases and benchmarking wars between frontier model providers')
  }
  if (grouped['AI Agents & Automation']?.length) {
    watches.push('Growth in agent-based enterprise tooling and the evaluation frameworks needed to trust them in production')
  }
  if (grouped['Open Source']?.length) {
    watches.push('Community adoption metrics and downstream fine-tuning experiments building on this week\'s open-source releases')
  }
  if (grouped['Industry News']?.length) {
    watches.push('Follow-on hiring and funding signals from the industry moves announced this week')
  }

  // Always include a forward-looking research signal
  watches.push('New arXiv preprints on long-horizon reasoning, multimodal evaluation, and inference efficiency — the research themes accelerating right now')

  return watches.slice(0, 4)
}

/**
 * Clean raw summary text:
 * - Strip arXiv preamble
 * - Strip HTML tags and entities
 * - Truncate to ~2 clean sentences, max 220 chars
 */
function cleanSummary(raw) {
  if (!raw) return ''
  let s = raw
    .replace(/arXiv:\S+\s+Announce\s+Type:\s+\w+\s+Abstract:\s*/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#8217;/g, "'")
    .replace(/&#[0-9]+;/g, '').replace(/&[a-z]+;/g, '')
    .replace(/\s+/g, ' ').trim()

  const sentenceEnd = /[.!?]/g
  let count = 0, cutAt = s.length, match
  while ((match = sentenceEnd.exec(s)) !== null) {
    count++
    if (count === 2) { cutAt = match.index + 1; break }
  }
  s = s.slice(0, cutAt).trim()
  if (s.length > 220) s = s.slice(0, 220).replace(/\s+\S*$/, '') + '…'
  return s
}

/**
 * Render a single news item.
 * Featured: #### heading + `Source · Date` line + 1–2 line summary.
 * Compact (More Signals): plain bullet with source badge inline.
 */
function renderItem(item, compact = false) {
  const title    = (item.title || 'Untitled').replace(/&#[0-9]+;/g, '').replace(/&[a-z]+;/g, '')
  const srcLabel = SOURCE_LABELS[item.feedSource] || (item.feedSource ? `📰 ${item.feedSource}` : '')
  const badge    = srcLabel ? `\`${srcLabel}\`` : ''
  const summary  = cleanSummary(item.summary)
  const date     = item.publishedAt
    ? new Date(item.publishedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
    : ''
  const meta = [badge, date].filter(Boolean).join(' · ')

  if (compact) {
    return `- [${title}](${item.url}) ${badge}`
  }

  return [
    `### [${title}](${item.url})`,
    meta ? meta : '',
    summary || '',
  ].filter(Boolean).join('\n')
}

// ── MDX assembly ──────────────────────────────────────────────────────────────

// Top story — highest scored item
const topStory = week[0] || null

// Fixed 4 subsections for Key Developments
// Map our dynamic buckets into the 4 fixed slots
const FIXED_SECTIONS = [
  { label: 'Large Language Models',  buckets: ['Large Language Models'] },
  { label: 'AI Agents & Automation', buckets: ['AI Agents & Automation'] },
  { label: 'Research & Papers',      buckets: ['Research & Breakthroughs', 'Research & Papers', 'AI Safety & Alignment'] },
  { label: 'Industry & Open Source', buckets: ['Industry & Enterprise', 'Open Source & Models', 'AI Infrastructure & MLOps'] },
]

// Exclude top story from sections to avoid duplication
const topStoryUrl = topStory?.url

const MAX_ARXIV_PER_SECTION = 1  // prevent arXiv papers from dominating any section

const keyDevSections = FIXED_SECTIONS.map(section => {
  // Cap arXiv to MAX_ARXIV_PER_SECTION per section so industry/blog stories get through
  let arxivSeen = 0
  const items = section.buckets
    .flatMap(b => grouped[b] || [])
    .filter(i => i.url !== topStoryUrl)
    .sort((a, b) => b.score - a.score)
    .filter(i => {
      if (i.feedSource === 'arXiv' || i.url?.includes('arxiv.org')) {
        if (arxivSeen >= MAX_ARXIV_PER_SECTION) return false
        arxivSeen++
      }
      return true
    })
    .slice(0, MAX_PER_SECTION)

  if (items.length === 0) return null

  return `## ${section.label}\n\n${items.map(i => renderItem(i)).join('\n\n')}`
}).filter(Boolean)

// Secondary — high-signal items not already featured
const featuredUrls = new Set([
  topStoryUrl,
  ...FIXED_SECTIONS.flatMap(s =>
    s.buckets.flatMap(b => (grouped[b] || []).slice(0, MAX_PER_SECTION).map(i => i.url))
  )
].filter(Boolean))

const secondaryItems = week
  .filter(i => !featuredUrls.has(i.url))
  .filter(i => i.score >= MIN_RELEVANCE + 1)
  .slice(0, MAX_SECONDARY)

const articleCount = keyDevSections.length * MAX_PER_SECTION + secondaryItems.length + 1
const topStoryTitle = (topStory?.title || '').replace(/&#[0-9]+;/g, '')
const weekInsights  = deriveWeekInsights(orderedBuckets, grouped, topStory)
const topStoryBlock = deriveTopStoryAnalysis(topStory)
const watchList     = deriveWatchList(orderedBuckets, grouped)

const mdx = `---
title: "This Week in AI — ${weekEndDate} | Weekly AI & ML Roundup"
slug: "${postSlug}"
date: "${postDate}"
description: "${description}"
keywords: ${JSON.stringify(keywords)}
tags: ${JSON.stringify(tags)}
author: "${AUTHOR}"
feature_image: "/images/ai-weekly-banner.png"
thumbnail: "/images/ai-weekly-banner.png"
status: draft
---

{/* ✏️ TODO: 2–3 sentence intro — what was the dominant theme this week from your lens as an AI engineer in a legal/enterprise environment? */}

Here's what actually mattered in AI from **${weekStartDate}** to **${weekEndDate}** — filtered for legal, compliance, and enterprise teams.

> 🔔 Live feed: [AI Latest News](/ai-trends) updates every 3 hours.

---

## 🧠 What Mattered This Week

{/* ✏️ TODO: Rewrite these 3 bullets in your own voice — what were the real signals this week? */}

${weekInsights.map((ins, i) => `> ${i + 1}. ${ins}`).join('\n')}

---

## 🔥 Top Story

### [${topStoryTitle}](${topStory?.url || '#'})

\`${SOURCE_LABELS[topStory?.feedSource] || topStory?.feedSource || ''}\` · ${topStory?.publishedAt ? new Date(topStory.publishedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }) : ''}

{/* ✏️ TODO: Rewrite with your angle — what does this mean for legal AI or regulated enterprise deployments? */}

${topStoryBlock}

---

## 🧩 Key Developments

${keyDevSections.join('\n\n---\n\n')}

---
${secondaryItems.length > 0 ? `
## 📎 More Signals

{/* ✏️ TODO: Keep only what's relevant to your audience, trim the rest */}

${secondaryItems.map(i => renderItem(i, true)).join('\n')}

---
` : ''}
## 🔮 What to Watch Next Week

{/* ✏️ TODO: Add 1–2 signals you're personally tracking */}

${watchList.map(w => `- ${w}`).join('\n')}

---

## 🧠 My Take

{/* ✏️ TODO: Most important section — 1–2 paragraphs. What would you tell a legal or compliance leader who asked "what should I know about AI this week?" */}

*[Write your take here — trends, implications, enterprise/legal lens]*

---

*AI in Practice is a weekly AI signal digest by [Jag Patel](https://www.linkedin.com/in/jagdishkumarpatel/).*  
*Sources: ${sourceSet.join(' · ')}*
`

// ── Write file ─────────────────────────────────────────────────────────────────

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

const outFile = path.join(OUT_DIR, `${postSlug}.mdx`)

if (fs.existsSync(outFile)) {
  console.log(`[generate-weekly] Draft already exists: ${postSlug}.mdx — delete it to regenerate.`)
  process.exit(0)
}

fs.writeFileSync(outFile, mdx, 'utf8')
console.log(`[generate-weekly] ✅ Draft written: content/drafts/${postSlug}.mdx`)
console.log(`[generate-weekly]    Articles: ${articleCount} | Sections: ${orderedBuckets.length} | Sources: ${sourceSet.length}`)
console.log(`[generate-weekly]`)
console.log(`[generate-weekly] 📝 Next steps:`)
console.log(`[generate-weekly]    1. Open content/drafts/${postSlug}.mdx`)
console.log(`[generate-weekly]    2. Fill in the ✏️ TODO sections with your perspective`)
console.log(`[generate-weekly]    3. Move to content/publish/ when ready to go live`)
