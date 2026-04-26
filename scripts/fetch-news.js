#!/usr/bin/env node
/**
 * fetch-news.js
 * Fetches top AI/ML news from Hacker News, Reddit, and arXiv.
 * Writes top 50 scored articles to public/data/top-news.json.
 */

import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Config — toggle sources on/off without touching logic */
const SOURCES = {
  hackernews: { enabled: true },
  reddit: { enabled: true, subs: ['MachineLearning', 'LocalLLaMA', 'artificial'] },
  arxiv: { enabled: true, feeds: ['cs.AI', 'cs.LG'] },
  blogs: {
    enabled: true,
    feeds: [
      // Official AI labs
      { name: 'OpenAI',           feedSource: 'OpenAI',           url: 'https://openai.com/news/rss.xml',                                          domain: 'openai.com' },
      { name: 'Anthropic',        feedSource: 'Anthropic',        url: 'https://www.anthropic.com/rss.xml',                                        domain: 'anthropic.com' },
      { name: 'Google AI',        feedSource: 'Google AI',        url: 'https://blog.google/technology/ai/rss/',                                   domain: 'blog.google' },
      { name: 'Microsoft AI',     feedSource: 'Microsoft AI',     url: 'https://blogs.microsoft.com/ai/feed/',                                     domain: 'blogs.microsoft.com' },
      { name: 'DeepMind',         feedSource: 'DeepMind',         url: 'https://deepmind.google/blog/rss.xml',                                     domain: 'deepmind.google' },
      { name: 'Meta AI',          feedSource: 'Meta AI',          url: 'https://ai.meta.com/blog/rss/',                                            domain: 'ai.meta.com' },
      { name: 'Hugging Face',     feedSource: 'Hugging Face',     url: 'https://huggingface.co/blog/feed.xml',                                     domain: 'huggingface.co' },
      // Tech media
      { name: 'VentureBeat AI',   feedSource: 'VentureBeat',      url: 'https://venturebeat.com/category/ai/feed/',                                domain: 'venturebeat.com' },
      { name: 'MIT Tech Review',  feedSource: 'MIT Tech Review',  url: 'https://www.technologyreview.com/feed/',                                   domain: 'technologyreview.com' },
      { name: 'The Verge AI',     feedSource: 'The Verge',        url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',        domain: 'theverge.com' },
      { name: 'Wired AI',         feedSource: 'Wired',            url: 'https://www.wired.com/feed/tag/artificial-intelligence/latest/rss',        domain: 'wired.com' },
      // Research & community
      { name: 'Papers With Code', feedSource: 'Papers With Code', url: 'https://paperswithcode.com/latest.rss',                                    domain: 'paperswithcode.com' },
    ],
  },
}

/** How many scored articles to store in JSON (user sees 10 by default, can expand) */
const STORE_TOP_N = 50

const AI_KEYWORDS = [
  'ai', 'ml', 'llm', 'gpt', 'machine learning', 'deep learning', 'neural',
  'openai', 'anthropic', 'gemini', 'claude', 'mistral', 'transformer',
  'diffusion', 'rag', 'agent', 'copilot', 'langchain', 'hugging face',
  'reinforcement learning', 'embeddings', 'vector', 'inference', 'fine-tun',
  'arxiv', 'paper', 'model', 'language model', 'multimodal',
]

const SOURCE_WEIGHTS = {
  // AI labs — highest authority
  'openai.com': 1.5,
  'anthropic.com': 1.5,
  'deepmind.google': 1.4,
  'ai.meta.com': 1.4,
  'research.google': 1.4,
  'arxiv.org': 1.4,
  // Tools & community
  'huggingface.co': 1.3,
  'paperswithcode.com': 1.3,
  // Microsoft & Google blogs
  'blogs.microsoft.com': 1.2,
  'blog.google': 1.2,
  // Tech media
  'technologyreview.com': 1.2,
  'venturebeat.com': 1.15,
  'theverge.com': 1.1,
  'wired.com': 1.1,
  'techcrunch.com': 1.1,
  // Community
  'reddit.com': 1.0,
}

/** HTTP/HTTPS GET with redirect following and optional JSON parse */
function request(url, asText = false) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url)
    const mod = parsed.protocol === 'https:' ? https : http
    const req = mod.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ai-trends-bot/2.0; +https://jagdishkumarpatel.github.io)',
        'Accept': 'application/json, application/xml, text/xml, */*',
      },
      timeout: 12000,
    }, (res) => {
      // Follow redirects (301/302/307/308)
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        return resolve(request(res.headers.location, asText))
      }
      if (res.statusCode && res.statusCode >= 400) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`))
      }
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        if (asText) return resolve(data)
        try { resolve(JSON.parse(data)) } catch { reject(new Error(`JSON parse error for ${url}`)) }
      })
      res.on('error', reject)
    })
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(); reject(new Error(`Timeout: ${url}`)) })
  })
}

function get(url) { return request(url, false) }
function getText(url) { return request(url, true) }

function isAIRelated(title = '', url = '') {
  const text = (title + ' ' + url).toLowerCase()
  return AI_KEYWORDS.some((kw) => text.includes(kw))
}

function getSourceWeight(url = '') {
  try {
    const host = new URL(url).hostname.replace('www.', '')
    for (const [domain, weight] of Object.entries(SOURCE_WEIGHTS)) {
      if (host.includes(domain)) return weight
    }
  } catch {}
  return 1.0
}

function inferTags(title = '', summary = '') {
  const t = (title + ' ' + summary).toLowerCase()
  const tags = []
  if (t.includes('llm') || t.includes('gpt') || t.includes('claude') || t.includes('gemini') || t.includes('language model') || t.includes('chatgpt') || t.includes('mistral') || t.includes('openai') || t.includes('anthropic')) tags.push('LLM')
  if (t.includes('agent') || t.includes('agentic') || t.includes('autonomous') || t.includes('multi-agent')) tags.push('Agents')
  if (t.includes('research') || t.includes('arxiv') || t.includes('paper') || t.includes('theory') || t.includes('study') || t.includes('findings') || t.includes('scientific')) tags.push('Research')
  if (t.includes('open source') || t.includes('github') || t.includes('open-source') || t.includes('released') || t.includes('hugging face') || t.includes('huggingface')) tags.push('Open Source')
  if (t.includes('rag') || t.includes('retrieval') || t.includes('embedding') || t.includes('vector') || t.includes('knowledge base')) tags.push('RAG')
  if (t.includes('image') || t.includes('diffusion') || t.includes('stable') || t.includes('vision') || t.includes('multimodal') || t.includes('video') || t.includes('visual')) tags.push('Vision')
  if (t.includes('safety') || t.includes('align') || t.includes('bias') || t.includes('ethics') || t.includes('risk') || t.includes('regulation') || t.includes('policy') || t.includes('harm')) tags.push('Safety')
  if (t.includes('tool') || t.includes('code') || t.includes('coding') || t.includes('developer') || t.includes('api') || t.includes('sdk') || t.includes('copilot') || t.includes('cursor') || t.includes('programming')) tags.push('Dev Tools')
  if (t.includes('model') && (t.includes('train') || t.includes('fine-tun') || t.includes('pretrain') || t.includes('weight') || t.includes('parameter') || t.includes('benchmark'))) tags.push('ML Infra')
  if (t.includes('startup') || t.includes('funding') || t.includes('invest') || t.includes('acqui') || t.includes('billion') || t.includes('valuation') || t.includes('ipo')) tags.push('Industry')
  if (tags.length === 0) tags.push('AI')
  return tags
}

function scoreArticle(item) {
  const now = Date.now() / 1000
  const ageHours = (now - (item.time || 0)) / 3600
  const recency = Math.max(0, 1 - ageHours / 72) // decay over 72h
  const engagement = Math.log10(Math.max(1, item.engagementScore || 1)) / Math.log10(1000)
  const sourceWeight = getSourceWeight(item.url || '')
  return parseFloat(((recency * 0.4 + engagement * 0.4) * sourceWeight).toFixed(4))
}

/** Fetch summary via microlink.io free API — handles bot protection & JS sites */
function fetchSummary(url) {
  return new Promise((resolve) => {
    const apiUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}`
    const req = https.get(apiUrl, { headers: { 'User-Agent': 'ai-trends-bot/1.0' }, timeout: 8000 }, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          const desc = json?.data?.description || ''
          resolve(desc.slice(0, 300).trim())
        } catch {
          resolve('')
        }
      })
      res.on('error', () => resolve(''))
    })
    req.on('error', () => resolve(''))
    req.on('timeout', () => { req.destroy(); resolve('') })
  })
}

// ─── Source fetchers ────────────────────────────────────────────────────────

async function fetchHNStories() {
  console.log('📰 Fetching Hacker News top stories...')
  const ids = await get('https://hacker-news.firebaseio.com/v0/topstories.json')
  const top200 = ids.slice(0, 200)
  const stories = []
  const batchSize = 20
  for (let i = 0; i < top200.length; i += batchSize) {
    const batch = top200.slice(i, i + batchSize)
    const results = await Promise.allSettled(
      batch.map((id) => get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`))
    )
    for (const r of results) {
      if (r.status === 'fulfilled' && r.value?.title && r.value?.url) {
        stories.push(r.value)
      }
    }
  }
  return stories
    .filter((s) => isAIRelated(s.title, s.url))
    .map((s) => ({
      title: s.title,
      url: s.url,
      feedSource: 'Hacker News',
      source: (() => { try { return new URL(s.url).hostname.replace('www.', '') } catch { return 'Hacker News' } })(),
      engagementScore: s.score || 0,
      time: s.time,
    }))
}

async function fetchRedditStories() {
  if (!SOURCES.reddit.enabled) return []
  console.log('🤖 Fetching Reddit stories...')
  const all = []
  for (const sub of SOURCES.reddit.subs) {
    try {
      const json = await get(`https://www.reddit.com/r/${sub}/hot.json?limit=50`)
      const posts = json?.data?.children ?? []
      for (const { data: p } of posts) {
        if (!p.title) continue
        // Use external URL if available, otherwise the Reddit post itself
        const url = p.is_self || !p.url || p.url.startsWith('https://www.reddit.com')
          ? `https://www.reddit.com${p.permalink}`
          : p.url
        if (!isAIRelated(p.title, url)) continue
        all.push({
          title: p.title,
          url,
          feedSource: 'Reddit',
          source: p.is_self || !p.url || p.url.startsWith('https://www.reddit.com')
            ? `r/${sub}`
            : (() => { try { return new URL(p.url).hostname.replace('www.', '') } catch { return `r/${sub}` } })(),
          engagementScore: p.score || 0,
          time: p.created_utc,
        })
      }
      console.log(`  ✓ r/${sub}: ${posts.length} posts fetched`)
    } catch (err) {
      console.warn(`  ⚠ r/${sub}: ${err.message}`)
    }
  }
  return all
}

/** Minimal RSS XML parser — no external deps */
function parseRssItems(xml) {
  const items = []
  const itemRe = /<item>([\s\S]*?)<\/item>/g
  let m
  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1]
    const title = (/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/.exec(block) || /<title>(.*?)<\/title>/.exec(block) || [])[1]?.trim() || ''
    const link = (/<link>(.*?)<\/link>/.exec(block) || [])[1]?.trim() || ''
    const desc = (/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/.exec(block) || /<description>([\s\S]*?)<\/description>/.exec(block) || [])[1]?.trim() || ''
    const pubDate = (/<pubDate>(.*?)<\/pubDate>/.exec(block) || [])[1]?.trim() || ''
    if (title && link) {
      items.push({ title: title.replace(/\[.*?\]$/, '').trim(), link, desc, pubDate })
    }
  }
  return items
}

async function fetchArxivStories() {
  if (!SOURCES.arxiv.enabled) return []
  console.log('🔬 Fetching arXiv stories...')
  const all = []
  for (const feed of SOURCES.arxiv.feeds) {
    try {
      const xml = await getText(`https://rss.arxiv.org/rss/${feed}`)
      const items = parseRssItems(xml)
      for (const item of items) {
        all.push({
          title: item.title,
          url: item.link,
          feedSource: 'arXiv',
          source: 'arxiv.org',
          engagementScore: 0,
          time: item.pubDate ? Math.floor(new Date(item.pubDate).getTime() / 1000) : Math.floor(Date.now() / 1000),
          preloadSummary: item.desc.replace(/<[^>]+>/g, '').slice(0, 300).trim(),
        })
      }
      console.log(`  ✓ arXiv ${feed}: ${items.length} papers`)
    } catch (err) {
      console.warn(`  ⚠ arXiv ${feed}: ${err.message}`)
    }
  }
  return all
}

async function fetchBlogStories() {
  if (!SOURCES.blogs.enabled) return []
  console.log('📡 Fetching company blog RSS feeds...')
  const all = []
  for (const feed of SOURCES.blogs.feeds) {
    try {
      const xml = await getText(feed.url)
      const items = parseRssItems(xml)
      for (const item of items) {
        all.push({
          title: item.title,
          url: item.link,
          feedSource: feed.feedSource,
          source: feed.domain,
          engagementScore: 0,
          time: item.pubDate ? Math.floor(new Date(item.pubDate).getTime() / 1000) : Math.floor(Date.now() / 1000),
          preloadSummary: item.desc.replace(/<[^>]+>/g, '').slice(0, 300).trim(),
        })
      }
      console.log(`  ✓ ${feed.name}: ${items.length} posts`)
    } catch (err) {
      console.warn(`  ⚠ ${feed.name}: ${err.message}`)
    }
  }
  return all
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const [hnRaw, redditRaw, arxivRaw, blogRaw] = await Promise.all([
    fetchHNStories(),
    fetchRedditStories(),
    fetchArxivStories(),
    fetchBlogStories(),
  ])

  const allRaw = [...hnRaw, ...redditRaw, ...arxivRaw, ...blogRaw]

  // Deduplicate by URL
  const seen = new Set()
  const unique = allRaw.filter((a) => {
    if (seen.has(a.url)) return false
    seen.add(a.url)
    return true
  })

  // Score and sort
  const scored = unique
    .map((s) => ({
      title: s.title,
      url: s.url,
      feedSource: s.feedSource,
      source: s.source,
      score: scoreArticle(s),
      publishedAt: new Date((s.time || 0) * 1000).toISOString(),
      summary: s.preloadSummary || '',
      tags: inferTags(s.title, s.preloadSummary || ''),
      engagementScore: s.engagementScore || 0,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, STORE_TOP_N)

  // Enrich summaries for articles that don't have one (HN and Reddit items)
  const needSummary = scored.filter((a) => !a.summary)
  console.log(`\nFetching summaries for ${needSummary.length} articles...`)

  await Promise.all(
    needSummary.map(async (item) => {
      item.summary = await fetchSummary(item.url)
      item.tags = inferTags(item.title, item.summary)
      if (item.summary) console.log(`  ✓ ${item.source}: ${item.summary.slice(0, 60)}...`)
    })
  )

  // Re-infer tags for arXiv items too now that we confirm their preloadSummary
  scored.filter((a) => a.feedSource === 'arXiv').forEach((item) => {
    item.tags = inferTags(item.title, item.summary)
  })

  const output = {
    updatedAt: new Date().toISOString(),
    sources: Object.keys(SOURCES).filter((k) => SOURCES[k].enabled),
    items: scored,
  }

  const outDir = path.join(__dirname, '..', 'public', 'data')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

  fs.writeFileSync(path.join(outDir, 'top-news.json'), JSON.stringify(output, null, 2))
  console.log(`\n✅ Written ${scored.length} articles to public/data/top-news.json`)

  const bySource = scored.reduce((acc, a) => {
    acc[a.feedSource] = (acc[a.feedSource] || 0) + 1
    return acc
  }, {})
  console.log('   Distribution:', Object.entries(bySource).map(([k, v]) => `${k}: ${v}`).join(', '))
}

main().catch((err) => {
  console.error('❌ Failed:', err.message)
  process.exit(1)
})
