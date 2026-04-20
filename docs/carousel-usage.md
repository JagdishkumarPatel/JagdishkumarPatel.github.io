# VisualCarousel & BlogCarousel Usage Guide

This guide explains how to use the two production-ready carousel components for your Next.js 15 portfolio:

- `VisualCarousel` (homepage)
- `BlogCarousel` (blog post gallery)

---

## 1. VisualCarousel (Homepage)

**Purpose:**
- Engaging, mobile-first carousel for post discovery
- Renders cards using only the `thumbnail` from MDX frontmatter

**How to Use:**

```
import { VisualCarousel } from "@/components/portfolio/VisualCarousel";
import { getAllPosts } from "@/lib/posts";

const posts = getAllPosts();

<VisualCarousel posts={posts} />
```

- Only posts with `carousel: true` in frontmatter are shown
- Cards link to `/blog/[slug]`
- No gallery or multi-image support in cards

**MDX Frontmatter Example:**
```
---
title: "..."
description: "..."
carousel: true
thumbnail: "/images/your-image.gif"
order: 1
slug: "your-post"
---
```

---

## 2. BlogCarousel (Blog Post Gallery)

**Purpose:**
- Deep-dive storytelling with multi-image gallery
- Renders only if `gallery` array exists in MDX frontmatter

**How to Use:**

```
import { BlogCarousel } from "@/components/portfolio/BlogCarousel";

// Inside your MDX blog post layout:
<BlogCarousel gallery={frontmatter.gallery} />
```

- Each gallery item: `{ src, title?, description? }`
- Controlled navigation (arrows, dots, keyboard)
- Centered, one slide at a time
- Optional: Lightbox on image click

**MDX Frontmatter Example:**
```
---
title: "..."
gallery:
  - src: "/images/slide1.png"
    title: "Step 1"
    description: "..."
  - src: "/images/slide2.png"
---
```

---

## Theming & Performance
- Uses CSS variables (no hardcoded colors)
- Fully theme-aware (adapts to all user-selected themes)
- Uses `next/image` with `unoptimized` for static export
- Animations: Framer Motion only where needed

---

## Optional Enhancements
- Lightbox (BlogCarousel)
- Analytics hooks for engagement tracking
- Auto-fallback: If `gallery` exists but no `thumbnail`, homepage carousel uses first gallery image

---

## File Locations
- `components/portfolio/VisualCarousel.tsx`
- `components/portfolio/BlogCarousel.tsx`
- Types: `components/portfolio/Carousel.types.ts`

---

_Last updated: April 2026_