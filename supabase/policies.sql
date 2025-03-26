-- Enable Row Level Security
alter table profiles enable row level security;
alter table images enable row level security;

-- Profiles table policies
-- 1. Allow users to read their own profile
create policy "Users can read own profile"
on profiles for select
using (auth.uid() = id);

-- 2. Allow users to update their own profile
create policy "Users can update own profile"
on profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- 3. Allow users to insert their profile (during registration)
create policy "Users can insert own profile"
on profiles for insert
with check (auth.uid() = id);

-- 4. Allow users to delete their own profile
create policy "Users can delete own profile"
on profiles for delete
using (auth.uid() = id);

-- Images table policies
-- 1. Allow all authenticated users to view all images (for the public gallery)
create policy "Anyone can view images"
on images for select
using (true);

-- 2. Allow users to insert their own images
create policy "Users can insert own images"
on images for insert
with check (auth.uid() = user_id);

-- 3. Allow users to update their own images
create policy "Users can update own images"
on images for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- 4. Allow users to delete their own images
create policy "Users can delete own images"
on images for delete
using (auth.uid() = user_id);

-- Create storage bucket for image uploads
insert into storage.buckets (id, name, public) 
values ('images', 'images', true);

-- Storage policies for the images bucket
-- 1. Allow authenticated users to view all images
create policy "Anyone can view images"
on storage.objects for select
using (bucket_id = 'images');

-- 2. Allow authenticated users to upload their own images
create policy "Users can upload images"
on storage.objects for insert
with check (
  bucket_id = 'images' AND
  auth.role() = 'authenticated'
);

-- 3. Allow users to update their own images
create policy "Users can update own images"
on storage.objects for update
using (
  bucket_id = 'images' AND
  auth.uid() = owner
);

-- 4. Allow users to delete their own images
create policy "Users can delete own images"
on storage.objects for delete
using (
  bucket_id = 'images' AND
  auth.uid() = owner
);

-- Function to handle user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();