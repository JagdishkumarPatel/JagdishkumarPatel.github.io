import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Trends | Jag Patel — Principal AI/ML Engineer",
  description:
    "Top 10 AI/ML developments ranked by importance — curated by Jag Patel, Principal AI/ML Engineer specialising in LLMs, agents, MLOps, and cloud AI platforms.",
  keywords: [
    "AI trends", "ML news", "LLM news", "AI/ML 2026", "Jag Patel", "Jagdishkumar Patel",
    "Principal AI ML Engineer", "AI news ranked", "top AI developments", "machine learning trends",
    "generative AI", "AI agents", "MLOps", "Azure AI",
  ],
  authors: [{ name: "Jag Patel", url: "https://jagdishkumarpatel.github.io" }],
  alternates: { canonical: "https://jagdishkumarpatel.github.io/ai-trends" },
  openGraph: {
    title: "AI Trends | Jag Patel — Principal AI/ML Engineer",
    description:
      "Top 10 AI/ML developments ranked by recency, source authority, and community engagement. Curated by Jag Patel, Principal AI/ML Engineer.",
    url: "https://jagdishkumarpatel.github.io/ai-trends",
    siteName: "Jag Patel",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Trends | Jag Patel — Principal AI/ML Engineer",
    description:
      "Top 10 AI/ML developments ranked daily. Curated by Jag Patel, Principal AI/ML Engineer.",
    creator: "@JagPatel",
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "AI Trends — Top 10 AI/ML Developments",
  description: "Top 10 AI/ML developments ranked by importance, curated by Jag Patel, Principal AI/ML Engineer.",
  url: "https://jagdishkumarpatel.github.io/ai-trends",
  author: {
    "@type": "Person",
    name: "Jag Patel",
    jobTitle: "Principal AI/ML Engineer",
    url: "https://jagdishkumarpatel.github.io",
  },
  publisher: {
    "@type": "Person",
    name: "Jag Patel",
    url: "https://jagdishkumarpatel.github.io",
  },
}

export default function AITrendsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}
