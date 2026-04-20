// Carousel.types.ts
// Types for Visual Carousel component

export interface CarouselPostMeta {
  slug: string;
  title: string;
  description?: string;
  excerpt?: string;
  order?: number;
  carousel?: boolean;
  thumbnail?: string;
  thumbnailLight?: string;
  thumbnailDark?: string;
}

export interface CarouselProps {
  posts: CarouselPostMeta[];
  className?: string;
}
