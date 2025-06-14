/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'dmcvfgimtayxisldwmne.supabase.co',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['framer-motion', 'react-type-animation'],
  },
};

module.exports = nextConfig;
