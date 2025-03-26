# AI Image Gallery

A modern web application for generating and managing AI-generated images. Built with Next.js 14, Supabase, and Tailwind CSS.

## Features

- 🖼️ **Image Gallery**
  - Public gallery of all generated images
  - Personal dashboard for user's images
  - Infinite scroll loading
  - Responsive grid layout

- 🎨 **Image Generation**
  - Text-to-image generation
  - Custom prompts
  - Real-time progress updates

- 👤 **Authentication**
  - Email/password authentication
  - Protected routes
  - User profiles

- 📱 **Responsive Design**
  - Mobile-first approach
  - Optimized image loading
  - Smooth animations

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Hosting**: Vercel (recommended)

## Prerequisites

Before you begin, ensure you have:
- Node.js 18.17 or later
- npm or yarn
- A Supabase account and project

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-image-gallery.git
   cd ai-image-gallery
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a \`.env.local\` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   Run the following SQL commands in your Supabase SQL editor:
   ```sql
   -- Enable UUID extension
   create extension if not exists "uuid-ossp";

   -- Create profiles table
   create table profiles (
     id uuid references auth.users on delete cascade,
     name text,
     email text,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     primary key (id)
   );

   -- Create images table
   create table images (
     id uuid default uuid_generate_v4() primary key,
     user_id uuid references profiles(id) on delete cascade,
     prompt text not null,
     url text not null,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Enable RLS
   alter table profiles enable row level security;
   alter table images enable row level security;
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Visit \`http://localhost:3000\` to see the application.

## Project Structure

\`\`\`
src/
├── app/                   # Next.js app router pages
├── components/           # React components
│   ├── auth/            # Authentication components
│   ├── gallery/         # Gallery components
│   └── ui/              # Shared UI components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and libraries
│   └── supabase/       # Supabase client and helpers
└── types/              # TypeScript type definitions
\`\`\`

## Key Features Explained

### Authentication
The app uses Supabase Authentication with a custom UI. Users can:
- Sign up with email/password
- Sign in with existing account
- View their profile
- Manage their images

### Image Gallery
- Infinite scrolling for efficient loading
- Responsive grid layout
- Image detail view with metadata
- Personal dashboard for user's images

### Image Generation
- Text prompt interface
- Real-time generation status
- Automatic gallery updates
- Image metadata storage

## Development

### Available Scripts

- \`npm run dev\`: Start development server
- \`npm run build\`: Build for production
- \`npm start\`: Run production server
- \`npm run lint\`: Run ESLint

### Environment Variables

Required environment variables:
- \`NEXT_PUBLIC_SUPABASE_URL\`: Your Supabase project URL
- \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`: Your Supabase anonymous key

### Database Schema

The application uses two main tables:

1. **profiles**
   - \`id\`: UUID (references auth.users)
   - \`name\`: Text
   - \`email\`: Text
   - \`created_at\`: Timestamp

2. **images**
   - \`id\`: UUID
   - \`user_id\`: UUID (references profiles)
   - \`prompt\`: Text
   - \`url\`: Text
   - \`created_at\`: Timestamp

## Deployment

1. **Vercel Deployment**
   ```bash
   vercel
   ```

2. **Environment Variables**
   Add the same environment variables to your Vercel project settings.

3. **Database Updates**
   Ensure your Supabase project has the correct tables and policies.

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Supabase team for the backend infrastructure
- Vercel for hosting and deployment
- All contributors and users of the application