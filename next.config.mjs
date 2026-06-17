/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  output: 'standalone',    // Produces minimal build for Docker (no node_modules needed)
  compress: true,           // Enable gzip compression
  images: {
    unoptimized: true,
  formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.mypangandaran.com',
      },
    ],
  },
};

export default nextConfig;
