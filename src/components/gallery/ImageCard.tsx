'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ImageWithProfile } from '@/types/supabase';

interface ImageCardProps {
  image: ImageWithProfile;
  priority?: boolean;
}

export function ImageCard({ image, priority = false }: ImageCardProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Link href={`/gallery/${image.id}`} className="group block w-full">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={image.url}
          alt={image.prompt}
          fill
          className={`
            object-cover
            duration-700 ease-in-out
            group-hover:scale-105
            ${isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'}
          `}
          onLoadingComplete={() => setIsLoading(false)}
          priority={priority}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 transition-opacity group-hover:bg-opacity-10" />
      </div>
      <div className="mt-2 space-y-1">
        <p className="line-clamp-2 text-sm text-gray-700">{image.prompt}</p>
        <p className="text-xs text-gray-500">
          by {image.profile.name || 'Anonymous'}
        </p>
      </div>
    </Link>
  );
}