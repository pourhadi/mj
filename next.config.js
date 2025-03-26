/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      // Add domains for image hosting here
      'localhost',
    ],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig