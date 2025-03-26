import { createClient } from '@supabase/supabase-js';
import type { Database, Profile, Image, ImageWithProfile } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export async function getCurrentUser(): Promise<Profile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return profile;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function getUserProfile(userId: string): Promise<Profile | null> {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*, images(count)')
      .eq('id', userId)
      .single();

    return profile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

export async function getPublicImages(page = 1, limit = 12): Promise<ImageWithProfile[]> {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  try {
    const { data: images } = await supabase
      .from('images')
      .select('*, profile:profiles(*)')
      .order('created_at', { ascending: false })
      .range(start, end);

    return images || [];
  } catch (error) {
    console.error('Error getting public images:', error);
    return [];
  }
}

export async function getUserImages(userId: string, page = 1, limit = 12): Promise<Image[]> {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  try {
    const { data: images } = await supabase
      .from('images')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(start, end);

    return images || [];
  } catch (error) {
    console.error('Error getting user images:', error);
    return [];
  }
}

export async function createImage(userId: string, prompt: string, url: string): Promise<Image | null> {
  try {
    const { data: image, error } = await supabase
      .from('images')
      .insert([
        {
          user_id: userId,
          prompt,
          url,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return image;
  } catch (error) {
    console.error('Error creating image:', error);
    return null;
  }
}

export async function updateImage(imageId: string, updates: Partial<Image>): Promise<Image | null> {
  try {
    const { data: image, error } = await supabase
      .from('images')
      .update(updates)
      .eq('id', imageId)
      .select()
      .single();

    if (error) throw error;
    return image;
  } catch (error) {
    console.error('Error updating image:', error);
    return null;
  }
}

export async function deleteImage(imageId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('images')
      .delete()
      .eq('id', imageId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return profile;
  } catch (error) {
    console.error('Error updating profile:', error);
    return null;
  }
}