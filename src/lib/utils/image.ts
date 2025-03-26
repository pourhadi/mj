/**
 * Convert a blob to a base64 string
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Convert a base64 string to a blob
 */
export function base64ToBlob(base64: string): Promise<Blob> {
  return fetch(base64).then((res) => res.blob());
}

/**
 * Generate a unique filename for an image
 */
export function generateImageFilename(userId: string, extension = 'png'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${userId}/${timestamp}-${random}.${extension}`;
}

/**
 * Calculate image dimensions based on aspect ratio
 */
export function calculateDimensions(ratio: string): { width: number; height: number } {
  const [w, h] = ratio.split(':').map(Number);
  const baseSize = 1024;

  if (w > h) {
    return {
      width: baseSize,
      height: Math.round((baseSize * h) / w),
    };
  } else {
    return {
      width: Math.round((baseSize * w) / h),
      height: baseSize,
    };
  }
}

/**
 * Validate image size and format
 */
export function validateImage(file: File): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      reject(new Error('Image size exceeds 10MB limit'));
    }

    if (!allowedTypes.includes(file.type)) {
      reject(new Error('Invalid image format. Please use JPEG, PNG, or WebP'));
    }

    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve(true);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Invalid image file'));
    };
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}