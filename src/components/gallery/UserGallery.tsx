'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ImageGrid } from './ImageGrid';
import { getUserImages } from '@/lib/supabase/helpers';
import type { Image } from '@/types/supabase';

interface UserGalleryProps {
  userId: string;
}

export function UserGallery({ userId }: UserGalleryProps) {
  const [images, setImages] = useState<Image[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  useEffect(() => {
    loadImages();
  }, [userId]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [inView, hasMore, loading]);

  useEffect(() => {
    if (page > 1) {
      loadMoreImages();
    }
  }, [page]);

  async function loadImages() {
    try {
      setLoading(true);
      const newImages = await getUserImages(userId, 1);
      setImages(newImages);
      setHasMore(newImages.length === 12);
    } catch (error) {
      console.error('Error loading user images:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadMoreImages() {
    try {
      setLoading(true);
      const newImages = await getUserImages(userId, page);
      setImages((prev) => [...prev, ...newImages]);
      setHasMore(newImages.length === 12);
    } catch (error) {
      console.error('Error loading more user images:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <ImageGrid 
        images={images.map(image => ({
          ...image,
          profile: { id: userId, name: '', email: '', created_at: '' }
        }))} 
        loading={loading && page === 1} 
      />
      
      {/* Loading indicator for infinite scroll */}
      <div ref={ref} className="flex justify-center py-4">
        {loading && page > 1 && (
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
        )}
      </div>
      
      {/* End of results message */}
      {!hasMore && images.length > 0 && (
        <p className="text-center text-gray-500">No more images to load</p>
      )}
      
      {/* Empty state */}
      {!loading && images.length === 0 && (
        <div className="flex flex-col items-center justify-center space-y-3 py-12">
          <p className="text-lg text-gray-500">No images created yet</p>
        </div>
      )}
    </div>
  );
}