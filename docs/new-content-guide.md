# Adding a New Blog Post or Project

Complete reference for adding content to the portfolio. Follow all steps — skipping any will cause a 404 or missing project card.

---

## Adding a Blog Post

### 1. Create the MDX file

Create a new file in `content/publish/` named after the slug:

```
content/publish/your-slug-here.mdx
```

**Required frontmatter:**

```mdx
---
title: "Your Post Title"
slug: "your-slug-here"
date: "2026-04-12"
description: "One or two sentence summary shown in blog listings and meta tags."
tags: ["Tag1", "Tag2", "Tag3"]
feature_image: "/images/your-slug-here.png"
---

Post content here...
```

> `slug` must exactly match the filename (without `.mdx`) and the `feature_image` path.

### 2. Add the feature image

Copy the image to:

```
public/images/your-slug-here.png
```

Name must match the `feature_image` value in frontmatter exactly (including extension).

### 3. That's it for a blog post

The post index (`public/metadata/blog-posts.json`) is **auto-generated** at build time by `scripts/generate-post-index.mjs`. No manual JSON edits needed for blog posts.

---

## Adding a Project

Projects are driven by a static JSON file — there is no auto-generation.

### 1. Edit `public/metadata/projects.json`

Add a new entry to the array. Order in the file = order on the Projects page.

```json
{
  "title": "Your Project Title",
  "description": "Two to three sentences describing what it does and why it matters.",
  "tech": ["Tech1", "Tech2", "Tech3"],
  "github": "",
  "demo": "",
  "blogSlug": "your-slug-here"
}
```

| Field | Required | Notes |
|---|---|---|
| `title` | Yes | Displayed as card heading |
| `description` | Yes | Shown below the title |
| `tech` | Yes | Rendered as pill tags |
| `github` | No | Leave `""` if not public |
| `demo` | No | Leave `""` if no live demo |
| `blogSlug` | No | Links card to blog post — must match MDX `slug` |

### 2. Include a blog post (recommended)

If `blogSlug` is set, the blog post must exist in `content/publish/`. If the MDX file is missing, the "Read Post" link will 404.

---

## Doing Both at Once (Standard Flow)

When adding a new blog + project together (most common):

```
1. Create  content/publish/<slug>.mdx          ← blog post
2. Save    public/images/<slug>.png             ← feature image
3. Edit    public/metadata/projects.json        ← add project entry
4. Commit and push
```

```bash
git add .
git commit -m "feat: add <title> blog post and project entry"
git push
```

The build pipeline runs `npm run generate` (regenerates blog-posts.json, RSS, sitemap) then `next build` automatically on push via GitHub Actions.

---

## MDX Content Guidelines

- Use `##` and `###` headings — `#` is reserved for the post title (rendered from frontmatter)
- Tables render natively — use for tech stacks and comparisons
- Code blocks use triple backticks with language hints
- Images: `![alt text](/images/filename.png)`
- Keep the `Related Topics` section at the end to aid SEO and internal linking

---

## Checklist Before Pushing

- [ ] Frontmatter `slug` matches the filename
- [ ] `feature_image` path matches the file in `public/images/`
- [ ] Feature image file exists in `public/images/`
- [ ] Project entry added to `projects.json` (if adding a project)
- [ ] `blogSlug` in `projects.json` matches the MDX `slug`
- [ ] No duplicate slugs in `content/publish/`
