import type { NextConfig } from 'next';

export default {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack(config) {
    // https://github.com/kkomelin/isomorphic-dompurify/issues/54
    // Fix isomorphic-dompurify in app router
    config.externals = [...config.externals, 'jsdom', 'sharp'];

    return config;
  },
  transpilePackages: ['react-lottie'],
  experimental: {
    optimizePackageImports: ['react-lottie'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  bundlePagesRouterDependencies: true,
} as NextConfig;
