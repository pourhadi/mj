'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ImageGrid } from './ImageGrid';
import { getPublicImages } from '@/lib/supabase/helpers';
import type { ImageWithProfile } from '@/types/supabase';

export function GalleryView() {
  const [images, setImages] = useState<ImageWithProfile[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  useEffect(() => {
    loadImages();
  }, []);

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
      const newImages = await getPublicImages(1);
      setImages(newImages);
      setHasMore(newImages.length === 12); // Assuming 12 is our page size
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadMoreImages() {
    try {
      setLoading(true);
      const newImages = await getPublicImages(page);
      setImages((prev) => [...prev, ...newImages]);
      setHasMore(newImages.length === 12);
    } catch (error) {
      console.error('Error loading more images:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <ImageGrid images={images} loading={loading && page === 1} />
      
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
    </div>
  );
}