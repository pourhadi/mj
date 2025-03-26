'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PromptForm, GenerationOptions } from '@/components/image-generation/PromptForm';
import { GenerationPreview } from '@/components/image-generation/GenerationPreview';
import { supabase } from '@/lib/supabase/client';

export default function CreatePage() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'generating' | 'completed' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | undefined>();
  const [imageUrl, setImageUrl] = useState<string | undefined>();

  const handleGeneration = async (prompt: string, options: GenerationOptions) => {
    setStatus('generating');
    setProgress(0);
    setError(undefined);

    try {
      // Simulate image generation with progress updates
      // Replace this with your actual image generation API call
      await simulateImageGeneration(
        (progress) => setProgress(progress),
        async (url) => {
          // Get the authenticated user
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('User not authenticated');

          // Upload the image to Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('images')
            .upload(`${user.id}/${Date.now()}.png`, await fetch(url).then(r => r.blob()));

          if (uploadError) throw uploadError;

          // Get the public URL for the uploaded image
          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(uploadData.path);

          // Save the image record in the database
          const { error: dbError } = await supabase
            .from('images')
            .insert([
              {
                user_id: user.id,
                prompt,
                url: publicUrl,
              },
            ]);

          if (dbError) throw dbError;

          setImageUrl(publicUrl);
          setStatus('completed');
          
          // Navigate to the image detail page after a short delay
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        }
      );
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate image');
      setStatus('error');
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold">Create New Image</h1>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Left column - Preview */}
          <div className="order-2 md:order-1">
            <GenerationPreview
              status={status}
              imageUrl={imageUrl}
              error={error}
              progress={progress}
            />
          </div>

          {/* Right column - Form */}
          <div className="order-1 md:order-2">
            <PromptForm
              onSubmit={handleGeneration}
              isGenerating={status === 'generating'}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

// Temporary function to simulate image generation
// Replace this with your actual image generation API integration
async function simulateImageGeneration(
  onProgress: (progress: number) => void,
  onComplete: (url: string) => Promise<void>
) {
  // Simulate progress updates
  for (let i = 0; i <= 100; i += 10) {
    onProgress(i);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // Simulate completion with a placeholder image
  // Replace this with the actual generated image URL
  await onComplete('https://picsum.photos/seed/123/1024/1024');
}