# Visual Carousel Component

This file documents the Visual Carousel component in `components/portfolio/Carousel.tsx`.

## Features
- Mobile-first, horizontal scroll, CSS scroll-snap
- Theme-aware (uses theme tokens, supports light/dark images)
- Framer Motion animations (hover, tap, fade-in)
- Desktop navigation arrows, keyboard support
- Scroll progress indicator, gradient edge fade
- Accessible (aria-labels, keyboard navigation)
- Lightweight, static export compatible

## Usage

```
import { Carousel } from './components/portfolio/Carousel';
import posts from 'lib/posts';

<Carousel posts={posts} />
```

- Filters posts with `carousel: true` in frontmatter
- Sorts by `order` field
- Click navigates to `/blog/[slug]`

## TypeScript Types
See `Carousel.types.ts` for prop and post types.

## Customization
- Add or adjust theme tokens in Tailwind config
- Add `thumbnailLight`/`thumbnailDark` to post frontmatter for theme-based images
- Adjust card width or animation in `Carousel.tsx`

---

_Last updated: April 2026_
