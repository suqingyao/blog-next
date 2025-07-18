import type { NextConfig } from "next";

export default {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
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
} as NextConfig
