'use client'

import Image from 'next/image'
import Link from 'next/link'

interface ImageData {
  id: string
  url: string
  prompt: string
  createdAt: string
  userId: string
}

export default function ImageGallery({ images = [] }: { images?: ImageData[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {images.length > 0 ? (
        images.map((image) => (
          <Link 
            key={image.id} 
            href={`/gallery/${image.id}`}
            className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
          >
            <Image
              src={image.url}
              alt={image.prompt}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity" />
          </Link>
        ))
      ) : (
        // Loading placeholders
        Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i}
            className="aspect-square bg-gray-100 rounded-lg animate-pulse"
          />
        ))
      )}
    </div>
  )
}