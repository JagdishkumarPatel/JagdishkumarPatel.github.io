"use client";
import React, { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

export interface BlogCarouselGalleryItem {
  src: string;
  title?: string;
  description?: string;
}

export interface BlogCarouselProps {
  gallery: BlogCarouselGalleryItem[];
  className?: string;
}



export const BlogCarousel: React.FC<BlogCarouselProps> = ({ gallery, className }) => {
  const [active, setActive] = useState(0);
  if (!gallery || gallery.length === 0) return null;

  const goTo = (idx: number) => {
    setActive(Math.max(0, Math.min(idx, gallery.length - 1)));
  };

  return (
    <div className={clsx("w-full", className)}>
      {/* Image area */}
      <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <Image
          src={gallery[active].src}
          alt={gallery[active].title || `Slide ${active + 1}`}
          fill
          className="object-contain"
          unoptimized
          priority
        />
        {/* Left arrow */}
        {gallery.length > 1 && (
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-bg-card/80 rounded-full p-2 border border-border shadow hover:bg-accent/10 focus:outline-none"
            aria-label="Previous slide"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
          </button>
        )}
        {/* Right arrow */}
        {gallery.length > 1 && (
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-bg-card/80 rounded-full p-2 border border-border shadow hover:bg-accent/10 focus:outline-none"
            aria-label="Next slide"
            onClick={() => goTo(active + 1)}
            disabled={active === gallery.length - 1}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        )}
      </div>

      {/* Dots and index — outside image container so they are never clipped */}
      {gallery.length > 1 && (
        <div className="flex flex-col items-center gap-2 pt-3 pb-1">
          <div className="flex gap-2">
            {gallery.map((_, i) => (
              <button
                key={i}
                className={clsx(
                  "w-3 h-3 rounded-full border-2 transition-colors focus:outline-none",
                  i === active
                    ? "bg-primary border-primary"
                    : "bg-transparent border-muted-foreground/40 hover:border-primary"
                )}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{active + 1} / {gallery.length}</span>
        </div>
      )}

      {/* Caption */}
      {(gallery[active].title || gallery[active].description) && (
        <div className="text-center mt-1">
          {gallery[active].title && <div className="font-semibold text-base mb-0.5">{gallery[active].title}</div>}
          {gallery[active].description && <div className="text-sm text-muted-foreground">{gallery[active].description}</div>}
        </div>
      )}
    </div>
  );
};

export default BlogCarousel;
