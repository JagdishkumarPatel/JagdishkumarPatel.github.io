# Jag Patel — Portfolio

Personal portfolio and technical blog for **Jagdishkumar (Jag) Patel**, Principal AI/ML Engineer with 18+ years designing and delivering scalable, secure, production-grade systems across AI/ML engineering, machine learning, MLOps, cloud architecture, DevSecOps, and platform engineering.

🌐 **Live site**: [jagdishkumarpatel.github.io](https://jagdishkumarpatel.github.io)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, static export) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Content | MDX (blog posts) |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |
| Versioning | Semantic Release |

---

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout — fonts, metadata, theme provider
│   ├── page.tsx                # Homepage — Hero, About, Capabilities, Projects, Blog, Contact
│   ├── blog/
│   │   ├── page.tsx            # /blog listing page with tag filter
│   │   └── [slug]/page.tsx     # Dynamic blog post renderer
│   ├── about/page.tsx
│   ├── certifications/page.tsx
│   ├── contact/page.tsx
│   ├── education/page.tsx
│   └── projects/page.tsx
├── components/
│   ├── layout/
│   │   ├── nav.tsx             # Top navigation bar
│   │   └── footer.tsx
│   └── portfolio/
│       ├── hero.tsx            # Hero section with avatar, CTA, animated tagline
│       ├── about.tsx           # About section (rendered from about.mdx)
│       ├── capabilities.tsx    # 6-card capabilities grid
│       ├── projects.tsx        # Projects with tech filter dropdown
│       ├── blog.tsx            # Homepage blog preview (3 latest posts)
│       ├── blog-page.tsx       # /blog full listing with tag filter
│       ├── filter-dropdown.tsx # Reusable multi-select filter dropdown
│       ├── certifications.tsx
│       ├── education.tsx
│       └── contact.tsx
├── content/
│   ├── about.mdx               # About section content
│   └── publish/                # Published MDX blog posts
├── lib/
│   ├── posts.ts                # Post reading and metadata utilities
│   └── themes.ts               # Theme definitions
├── public/
│   ├── metadata/
│   │   ├── blog-posts.json     # Auto-generated blog index (build-time)
│   │   └── projects.json       # Manually maintained project list
│   ├── images/                 # Blog post feature images
│   ├── avatar/                 # Profile headshot
│   ├── rss/                    # Generated RSS feed
│   └── sitemap.xml             # Generated sitemap
├── scripts/
│   ├── generate-post-index.mjs # Generates blog-posts.json from MDX frontmatter
│   ├── generate-rss.mjs        # Generates RSS 2.0 feed
│   └── generate-sitemap.mjs    # Generates sitemap.xml
└── .github/workflows/
    ├── pages.yml               # Build and deploy to GitHub Pages
    └── release.yml             # Semantic Release on push to main
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Local Development

```bash
git clone https://github.com/JagdishkumarPatel/JagdishkumarPatel.github.io.git
cd JagdishkumarPatel.github.io
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
```

Output goes to `./out/` (static export).

---

## Adding Content

### New Blog Post

1. Create `content/publish/your-post-slug.mdx` with frontmatter:

```mdx
---
slug: your-post-slug
title: "Your Post Title"
date: YYYY-MM-DD
description: "Brief description for SEO and previews."
tags: [AI, MLOps, Python]
feature_image: /images/your-post-slug.png
---

Post content here...
```

2. Add a feature image to `public/images/your-post-slug.png`.
3. Run `npm run build` — the post index is auto-generated at build time.

### Add a New Post to the Homepage Carousel

To feature a blog post in the homepage 3D carousel (and as a related post):

1. **Create your post** in `content/publish/your-post-slug.mdx` with the following frontmatter fields:

```mdx
---
slug: your-post-slug
carousel: true                # <-- Required to show in homepage carousel
order: 1                      # Lower numbers appear first (optional, default: 0)
title: "Your Post Title"
date: YYYY-MM-DD
description: "Short summary for carousel and SEO."
thumbnail: /images/your-post-slug.png
thumbnailLight: /images/your-post-slug-light.png   # (optional, for light theme)
thumbnailDark: /images/your-post-slug-dark.png     # (optional, for dark theme)
---
```

2. **Add your carousel image(s):**
   - Place your main image at `public/images/your-post-slug.png`.
   - (Optional) Add theme-specific images as `your-post-slug-light.png` and `your-post-slug-dark.png` in the same folder.

3. **(Optional) Add a gallery:**
   - To show a 3D image carousel inside the blog post, add a `gallery` array in the frontmatter:

```mdx
---
gallery:
  - src: /images/your-post-slug-1.png
    title: "Step 1"
    description: "Description for image 1."
  - src: /images/your-post-slug-2.png
    title: "Step 2"
    description: "Description for image 2."
---
```

4. **Rebuild the site:**
   - Run `npm run build` to update the homepage carousel and blog post galleries.

**Result:**
- The post will appear in the homepage 3D carousel, in the related posts carousel, and (if a gallery is present) as a 3D image carousel inside the blog post.

### New Project

Edit `public/metadata/projects.json` and add an entry:

```json
{
  "title": "Project Name",
  "description": "Short description.",
  "tech": ["Python", "FastAPI", "Azure"],
  "github": "https://github.com/JagdishkumarPatel/repo",
  "blogSlug": "optional-blog-post-slug"
}
```

---

## Deployment

The site uses `output: "export"` (static HTML) and deploys to GitHub Pages via GitHub Actions on every push to `main`.

- Build output: `./out/`
- Live URL: `https://jagdishkumarpatel.github.io`

> **Note**: Two workflows run on push to `main` — `pages.yml` (build + deploy) and `release.yml` (semantic-release). If a push is rejected due to remote divergence, run `git pull --rebase && git push`.

### GitHub Pages Configuration

If the site shows the README instead of the website:

1. Go to **Settings → Pages**
2. Set **Source** to **GitHub Actions**

---

## Commit Convention

Follows [Conventional Commits](https://www.conventionalcommits.org/) — Semantic Release auto-bumps versions on push to `main`.

| Prefix | Description | Version Bump |
|--------|-------------|-------------|
| `feat:` | New feature | Minor |
| `fix:` | Bug fix | Patch |
| `docs:` | Documentation only | No release |
| `style:` | Formatting | No release |
| `refactor:` | Refactoring | No release |
| `perf:` | Performance | Patch |
| `chore:` | Maintenance | No release |
| `feat!:` / `BREAKING CHANGE:` | Breaking change | Major |

---

## Themes

15 themes across three categories, selectable via the theme switcher in the nav:

| Category | Themes |
|----------|--------|
| Default | Light, Dark, System |
| Developer | Catppuccin, Gruvbox, Rose Pine, Solarized, GitHub Dark, One Dark, Everforest |
| Professional | Corporate Blue, Executive, Slate, Ocean, Minimal |

---

## Contact

**Jag Patel**
- LinkedIn: [linkedin.com/in/jagjpatel](https://www.linkedin.com/in/jagjpatel/)
- GitHub: [github.com/JagdishkumarPatel](https://github.com/JagdishkumarPatel)
- Site: [jagdishkumarpatel.github.io](https://jagdishkumarpatel.github.io)

---

*Built with Next.js 15 · Deployed on GitHub Pages*
