"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageWithFallbackProps {
  src: string | null;
  alt: string;
  className?: string;
}

export function ImageWithFallback({ src, alt, className }: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className={`flex h-full w-full items-center justify-center bg-slate-200 text-sm text-slate-500 ${className ?? ""}`}>
        No image
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className ?? "object-cover"}
      onError={() => setHasError(true)}
      sizes="(max-width: 768px) 100vw, 33vw"
    />
  );
}
