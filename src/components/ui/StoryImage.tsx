"use client";
import Image from "next/image";

interface StoryImageProps {
  src: string;
  alt: string;
  fallback: string;
}

export default function StoryImage({ src, alt, fallback }: StoryImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover transition-transform duration-700 hover:scale-105"
      onError={(e) => {
        (e.target as HTMLImageElement).src = fallback;
      }}
    />
  );
}
