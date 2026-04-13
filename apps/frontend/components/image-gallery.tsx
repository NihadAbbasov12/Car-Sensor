"use client";

import { useState } from "react";
import { ImageWithFallback } from "./image-with-fallback";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  return (
    <div className="space-y-4">
      <div className="relative h-[320px] overflow-hidden rounded-3xl bg-slate-100 md:h-[480px]">
        <ImageWithFallback
          src={activeImage ?? null}
          alt={title}
          className="object-cover"
        />
      </div>

      <div className="grid grid-cols-4 gap-3 md:grid-cols-6">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`relative h-20 overflow-hidden rounded-2xl border ${index === activeIndex ? "border-amber-500" : "border-transparent"}`}
          >
            <ImageWithFallback src={image} alt={`${title} ${index + 1}`} className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
