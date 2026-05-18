/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/inner-circle',
  async redirects() {
    return [
      // Redirect bare root → basePath landing page
      { source: '/', destination: '/inner-circle', permanent: false, basePath: false },
    ]
  },
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'www.figma.com' },
      { protocol: 'https', hostname: '*.figma.com' },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
};

export default nextConfig;
