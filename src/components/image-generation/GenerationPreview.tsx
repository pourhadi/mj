'use client';

import Image from 'next/image';

interface GenerationPreviewProps {
  status: 'idle' | 'generating' | 'completed' | 'error';
  imageUrl?: string;
  error?: string;
  progress?: number;
}

export function GenerationPreview({
  status,
  imageUrl,
  error,
  progress = 0,
}: GenerationPreviewProps) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
      {status === 'idle' && (
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-gray-500">
            Your generated image will appear here
          </p>
        </div>
      )}

      {status === 'generating' && (
        <div className="flex h-full flex-col items-center justify-center">
          <div className="mb-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
          <p className="text-sm font-medium text-gray-900">Generating image...</p>
          <div className="mt-4 w-64">
            <div className="relative h-2 w-full rounded-full bg-gray-200">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="mt-2 text-center text-xs text-gray-500">
              {progress}% complete
            </p>
          </div>
        </div>
      )}

      {status === 'completed' && imageUrl && (
        <div className="relative h-full w-full">
          <Image
            src={imageUrl}
            alt="Generated image"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 transition-opacity hover:bg-opacity-10"></div>
        </div>
      )}

      {status === 'error' && (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className="mb-4 rounded-full bg-red-100 p-3">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-red-600">
            {error || 'Failed to generate image'}
          </p>
        </div>
      )}
    </div>
  );
}