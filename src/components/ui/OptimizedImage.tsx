"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

type OptimizedImageProps = Omit<ImageProps, "src"> & {
  src: string;
  fallbackSrc?: string;
};

/** next/image wrapper with optional fallback when the primary src fails to load. */
export default function OptimizedImage({
  src,
  fallbackSrc,
  alt,
  onError,
  ...props
}: OptimizedImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={(event) => {
        if (fallbackSrc && currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
        onError?.(event);
      }}
    />
  );
}
