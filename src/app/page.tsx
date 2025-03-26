import Link from 'next/link';
import { GalleryView } from '@/components/gallery/GalleryView';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">AI Image Gallery</h1>
        <div className="space-x-4">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="inline-block rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
              >
                Dashboard
              </Link>
              <Link
                href="/create"
                className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Create Image
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="inline-block rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>

      <GalleryView />
    </main>
  );
}