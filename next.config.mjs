/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  output: 'standalone',    // Produces minimal build for Docker (no node_modules needed)
  compress: true,           // Enable gzip compression
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.mypangandaran.com',
      },
    ],
  },
  experimental: {
    // Tree-shake large packages to reduce JS bundle size & TBT
    optimizePackageImports: ['@reduxjs/toolkit', 'react-redux'],
  },
};

export default nextConfig;
