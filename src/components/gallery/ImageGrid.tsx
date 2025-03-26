'use client';

import { ImageCard } from './ImageCard';
import type { ImageWithProfile } from '@/types/supabase';

interface ImageGridProps {
  images: ImageWithProfile[];
  loading?: boolean;
}

export function ImageGrid({ images, loading = false }: ImageGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square animate-pulse rounded-lg bg-gray-200"
          />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 py-12">
        <p className="text-lg text-gray-500">No images found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {images.map((image, index) => (
        <ImageCard
          key={image.id}
          image={image}
          priority={index < 4} // Load first 4 images with priority
        />
      ))}
    </div>
  );
}