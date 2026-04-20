import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const PUBLISH_DIR = path.join(process.cwd(), 'content/publish')


export type BlogCarouselGalleryItem = {
  src: string;
  title?: string;
  description?: string;
};

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  feature_image?: string | null;
  tags?: string[];
  description?: string;
  // Carousel fields
  carousel?: boolean;
  thumbnail?: string;
  thumbnailLight?: string;
  thumbnailDark?: string;
  order?: number;
  gallery?: BlogCarouselGalleryItem[];
};

export type Post = PostMeta & {
  content: string;
};

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(PUBLISH_DIR)) return []
  return fs
    .readdirSync(PUBLISH_DIR)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx?$/, ''))
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(PUBLISH_DIR)) return []
  const files = fs.readdirSync(PUBLISH_DIR)
  return files
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((file) => {
      const filePath = path.join(PUBLISH_DIR, file)
      const raw = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(raw)
      const excerpt =
        data.description ||
        content
          .replace(/^#+\s.*/gm, '')
          .replace(/[*_`~]/g, '')
          .split('\n')
          .filter((l) => l.trim().length > 0)
          .slice(0, 2)
          .join(' ')
          .slice(0, 200)
      return {
        slug: data.slug || file.replace(/\.mdx?$/, ''),
        title: data.title || 'Untitled',
        date: data.date || '',
        excerpt,
        feature_image: data.feature_image || null,
        tags: data.tags || [],
        description: (data.description ?? '').toString(),
        carousel: data.carousel ?? false,
        thumbnail: data.thumbnail ?? '',
        thumbnailLight: data.thumbnailLight ?? '',
        thumbnailDark: data.thumbnailDark ?? '',
        order: typeof data.order === 'number' ? data.order : 0,
        gallery: Array.isArray(data.gallery) ? data.gallery : undefined,
      }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): Post | null {
  const extensions = ['.mdx', '.md']
  for (const ext of extensions) {
    const filePath = path.join(PUBLISH_DIR, `${slug}${ext}`)
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(raw)
      return {
        slug: data.slug || slug,
        title: data.title || 'Untitled',
        date: data.date || '',
        content,
        feature_image: data.feature_image || null,
        tags: data.tags || [],
        description: (data.description ?? '').toString(),
        carousel: data.carousel ?? false,
        thumbnail: data.thumbnail ?? '',
        thumbnailLight: data.thumbnailLight ?? '',
        thumbnailDark: data.thumbnailDark ?? '',
        order: typeof data.order === 'number' ? data.order : 0,
        gallery: Array.isArray(data.gallery) ? data.gallery : undefined,
      }
    }
  }
  return null
}
