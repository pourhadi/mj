import { notFound } from 'next/navigation';
import { ImageDetail } from '@/components/gallery/ImageDetail';
import { createClient } from '@/lib/supabase/server';

export default async function ImagePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  // Fetch image with profile
  const { data: image } = await supabase
    .from('images')
    .select('*, profile:profiles(*)')
    .eq('id', params.id)
    .single();

  if (!image) {
    notFound();
  }

  return <ImageDetail image={image} />;
}