
"use client";
// Visual Carousel component for Next.js 15 App Router
// Mobile-first, theme-aware, Framer Motion, TypeScript, Tailwind CSS v4

import React, { useRef, useState, useEffect } from 'react';
import { CarouselProps, CarouselPostMeta } from './Carousel.types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import clsx from 'clsx';

// Helper: Get theme (light/dark) from document
function useTheme(): 'light' | 'dark' {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(mq.matches ? 'dark' : 'light');
    const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return theme;
}

export const Carousel: React.FC<CarouselProps> = ({ posts, className }) => {
  const router = useRouter();
  const theme = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState({ left: 0, width: 0, scrollWidth: 0 });

  // Sort and filter posts
  const carouselPosts = posts
    .filter((p) => p.carousel)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Scroll progress
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScroll({ left: el.scrollLeft, width: el.clientWidth, scrollWidth: el.scrollWidth });
    el.addEventListener('scroll', onScroll);
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // Keyboard scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        el.scrollBy({ left: e.key === 'ArrowLeft' ? -el.clientWidth * 0.8 : el.clientWidth * 0.8, behavior: 'smooth' });
      }
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, []);

  // Card width matches Capabilities: 50% minus gap on desktop, 100% on mobile
  const cardWidth = 'w-full sm:w-[calc(50%-0.75rem)] max-w-full';

  return (
    <div className={clsx('relative w-full max-w-4xl mx-auto px-6', className)}>
      {/* Desktop navigation arrows */}
      <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 z-20">
        <button
          className="rounded-full bg-bg-card shadow border border-border p-2 hover:bg-accent/10 focus:outline-none"
          aria-label="Scroll left"
          onClick={() => {
            const el = scrollRef.current;
            if (el) el.scrollBy({ left: -el.clientWidth * 0.8, behavior: 'smooth' });
          }}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
        </button>
      </div>
      <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 right-0 z-20">
        <button
          className="rounded-full bg-bg-card shadow border border-border p-2 hover:bg-accent/10 focus:outline-none"
          aria-label="Scroll right"
          onClick={() => {
            const el = scrollRef.current;
            if (el) el.scrollBy({ left: el.clientWidth * 0.8, behavior: 'smooth' });
          }}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      {/* Horizontally scrollable flex container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-hide"
        tabIndex={0}
        aria-label="Blog post carousel"
        style={{ WebkitOverflowScrolling: 'touch', maxWidth: '100%' }}
      >
        {carouselPosts.map((post, i) => {
          // Theme-based image
          const imgSrc = (
            (theme === 'dark' && post.thumbnailDark) ? post.thumbnailDark :
            (theme === 'light' && post.thumbnailLight) ? post.thumbnailLight :
            post.thumbnail
          ) || '/images/placeholder.png'; // fallback to a placeholder image
          return (
            <motion.div
              key={post.slug}
              className={clsx(
                'snap-center shrink-0 rounded-xl shadow-lg border border-border bg-bg-card text-text-primary',
                cardWidth,
                'transition-colors duration-300',
                'flex flex-col cursor-pointer',
                'hover:shadow-2xl',
                'focus:outline-none focus:ring-2 focus:ring-accent',
              )}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              tabIndex={0}
              aria-label={`Read post: ${post.title}`}
              onClick={() => router.push(`/blog/${post.slug}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') router.push(`/blog/${post.slug}`);
              }}
            >
              <div className="relative h-48 w-full rounded-t-2xl overflow-hidden">
                <Image
                  src={imgSrc}
                  alt={post.title}
                  fill
                  className="object-cover"
                  unoptimized
                  priority={i < 2}
                  sizes="(max-width: 600px) 100vw, 400px"
                />
              </div>
              <div className="p-4 flex flex-col gap-2">
                <h3 className="font-semibold text-lg line-clamp-2">{post.title}</h3>
                <p className="text-sm text-text-secondary line-clamp-3">{post.description || post.excerpt}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;
