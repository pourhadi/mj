'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import type { ImageWithProfile } from '@/types/supabase';
import { deleteImage } from '@/lib/supabase/helpers';
import { useRouter } from 'next/navigation';

interface ImageDetailProps {
  image: ImageWithProfile;
}

export function ImageDetail({ image }: ImageDetailProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isOwner = user?.id === image.user_id;

  const handleDelete = async () => {
    if (!isOwner) return;
    
    setIsLoading(true);
    try {
      const success = await deleteImage(image.id);
      if (success) {
        router.push('/dashboard');
      } else {
        throw new Error('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={image.url}
            alt={image.prompt}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Image Details</h1>
            <p className="mt-2 text-gray-600">{image.prompt}</p>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center space-x-2">
              <div className="text-sm">
                <p className="text-gray-500">Created by</p>
                <p className="font-medium text-gray-900">
                  {image.profile.name || 'Anonymous'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          {isOwner && (
            <div className="space-y-4 border-t border-gray-200 pt-4">
              <button
                onClick={() => router.push(`/gallery/${image.id}/edit`)}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                disabled={isLoading}
              >
                Edit Image
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full rounded-md border border-red-600 px-4 py-2 text-red-600 hover:bg-red-50"
                disabled={isLoading}
              >
                Delete Image
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6">
            <h3 className="text-lg font-medium text-gray-900">Delete Image</h3>
            <p className="mt-2 text-gray-500">
              Are you sure you want to delete this image? This action cannot be undone.
            </p>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-md border px-4 py-2 hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}