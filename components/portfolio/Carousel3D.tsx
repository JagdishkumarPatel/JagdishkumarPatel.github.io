"use client";
import React, { useState, useEffect } from "react";

import { CarouselProps } from "./Carousel.types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";

const useTheme = (): 'light' | 'dark' => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(mq.matches ? 'dark' : 'light');
    const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return theme;
};

const Carousel3D: React.FC<CarouselProps> = ({ posts, className }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const theme = useTheme();

  const carouselPosts = posts
    .filter((p) => p.carousel)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className={className}>
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        loop={true}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 300,
          modifier: 1,
          slideShadows: true,
        }}
        navigation
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Navigation, Pagination]}
        style={{ width: "100%", paddingTop: 32, paddingBottom: 32 }}
        onSlideChange={swiper => setActiveIndex(swiper.realIndex)}
      >
        {carouselPosts.map((post, idx) => {
          const imgSrc = (
            (theme === 'dark' && post.thumbnailDark) ? post.thumbnailDark :
            (theme === 'light' && post.thumbnailLight) ? post.thumbnailLight :
            post.thumbnail
          ) || '/images/placeholder.png';
          return (
            <SwiperSlide key={post.slug || idx} style={{ width: 320, maxWidth: "90vw" }}>
              <div
                tabIndex={0}
                aria-label={`Read post: ${post.title}`}
                style={{
                  padding: 0,
                  borderRadius: 16,
                  background: "#0f172a",
                  boxShadow: "0 4px 32px #0002",
                  transformStyle: "preserve-3d",
                  cursor: "pointer",
                  outline: "none",
                  transition: "box-shadow 0.3s",
                  height: "100%"
                }}
                onClick={() => router.push(`/blog/${post.slug}`)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') router.push(`/blog/${post.slug}`);
                }}
              >
                <div style={{ position: "relative", height: 192, width: "100%", borderTopLeftRadius: 16, borderTopRightRadius: 16, overflow: "hidden" }}>
                  <Image
                    src={imgSrc}
                    alt={post.title}
                    fill
                    className="object-cover"
                    unoptimized
                    priority={idx < 2}
                    sizes="(max-width: 600px) 100vw, 400px"
                  />
                </div>
                <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                  <h3 style={{ fontWeight: 600, fontSize: 18, lineHeight: 1.2, margin: 0 }}>{post.title}</h3>
                  <p style={{ fontSize: 14, color: "#94a3b8", margin: 0 }}>{post.description || post.excerpt}</p>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {/* Progress bar and index */}
      <div style={{ maxWidth: 400, margin: "16px auto 0 auto", textAlign: "center" }}>
        <div style={{ position: "relative", height: 6, background: "#1e293b", borderRadius: 3, overflow: "hidden", marginBottom: 8 }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: `${((activeIndex + 1) / carouselPosts.length) * 100}%`,
              background: "#38bdf8",
              borderRadius: 3,
              transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </div>
        <span style={{ color: "#94a3b8", fontSize: 14 }}>
          {carouselPosts.length === 0 ? "0/0" : `${activeIndex + 1} / ${carouselPosts.length}`}
        </span>
      </div>
    </div>
  );
};

export default Carousel3D;
