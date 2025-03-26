import Link from 'next/link';
import { redirect } from 'next/navigation';
import { UserGallery } from '@/components/gallery/UserGallery';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Images</h1>
        <Link
          href="/create"
          className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Create New Image
        </Link>
      </div>

      <UserGallery userId={session.user.id} />
    </main>
  );
}