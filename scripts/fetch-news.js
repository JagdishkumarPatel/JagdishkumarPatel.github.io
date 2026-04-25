#!/usr/bin/env node
/**
 * fetch-news.js
 * Fetches top AI/ML news from Hacker News and writes top 10 to public/data/top-news.json
 */

const fs = require('fs')
const path = require('path')
const https = require('https')

const AI_KEYWORDS = [
  'ai', 'ml', 'llm', 'gpt', 'machine learning', 'deep learning', 'neural',
  'openai', 'anthropic', 'gemini', 'claude', 'mistral', 'transformer',
  'diffusion', 'rag', 'agent', 'copilot', 'langchain', 'hugging face',
  'reinforcement learning', 'embeddings', 'vector', 'inference', 'fine-tun',
]

const SOURCE_WEIGHTS = {
  'arxiv.org': 1.4,
  'openai.com': 1.3,
  'anthropic.com': 1.3,
  'huggingface.co': 1.2,
  'deepmind.com': 1.2,
  'research.google': 1.2,
  'techcrunch.com': 1.1,
  'theverge.com': 1.1,
  'wired.com': 1.1,
}

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'ai-trends-bot/1.0' } }, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        try { resolve(JSON.parse(data)) } catch { reject(new Error('JSON parse error')) }
      })
    }).on('error', reject)
  })
}

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

function inferTags(title = '') {
  const t = title.toLowerCase()
  const tags = []
  if (t.includes('llm') || t.includes('gpt') || t.includes('claude') || t.includes('gemini') || t.includes('language model')) tags.push('LLM')
  if (t.includes('agent')) tags.push('Agents')
  if (t.includes('research') || t.includes('arxiv') || t.includes('paper')) tags.push('Research')
  if (t.includes('open source') || t.includes('github')) tags.push('Open Source')
  if (t.includes('rag') || t.includes('retrieval')) tags.push('RAG')
  if (t.includes('image') || t.includes('diffusion') || t.includes('stable') || t.includes('vision')) tags.push('Vision')
  if (t.includes('safety') || t.includes('align') || t.includes('bias')) tags.push('Safety')
  if (tags.length === 0) tags.push('AI')
  return tags
}

function scoreArticle(item) {
  const now = Date.now() / 1000
  const ageHours = (now - item.time) / 3600
  const recency = Math.max(0, 1 - ageHours / 72) // decay over 72h
  const engagement = Math.log10(Math.max(1, item.score || 1)) / Math.log10(1000)
  const sourceWeight = getSourceWeight(item.url || '')
  return parseFloat(((recency * 0.4 + engagement * 0.4) * sourceWeight).toFixed(4))
}

async function fetchHNStories() {
  console.log('Fetching Hacker News top stories...')
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
}

async function main() {
  const stories = await fetchHNStories()

  const aiStories = stories
    .filter((s) => isAIRelated(s.title, s.url))
    .map((s) => ({
      title: s.title,
      url: s.url,
      source: (() => { try { return new URL(s.url).hostname.replace('www.', '') } catch { return 'Hacker News' } })(),
      score: scoreArticle(s),
      publishedAt: new Date(s.time * 1000).toISOString(),
      summary: '',
      tags: inferTags(s.title),
      hnScore: s.score || 0,
    }))

  // Deduplicate by URL
  const seen = new Set()
  const unique = aiStories.filter((a) => {
    if (seen.has(a.url)) return false
    seen.add(a.url)
    return true
  })

  const top10 = unique.sort((a, b) => b.score - a.score).slice(0, 10)

  const output = {
    updatedAt: new Date().toISOString(),
    items: top10,
  }

  const outDir = path.join(__dirname, '..', 'public', 'data')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

  fs.writeFileSync(path.join(outDir, 'top-news.json'), JSON.stringify(output, null, 2))
  console.log(`✅ Written ${top10.length} articles to public/data/top-news.json`)
}

main().catch((err) => {
  console.error('❌ Failed:', err.message)
  process.exit(1)
})
