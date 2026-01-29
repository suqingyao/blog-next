import type { NextConfig } from 'next';
import process from 'node:process';
import NextBundleAnalyzer from '@next/bundle-analyzer';
import { codeInspectorPlugin } from 'code-inspector-plugin';

const baseConfig: NextConfig = {
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
  turbopack: {
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  webpack(config: Parameters<NonNullable<NextConfig['webpack']>>[0]) {
    // https://github.com/kkomelin/isomorphic-dompurify/issues/54
    // Fix isomorphic-dompurify in app router
    const externals = config.externals ?? [];
    config.externals = Array.isArray(externals)
      ? [...externals, 'jsdom', 'sharp']
      : [externals, 'jsdom', 'sharp'];

    // Code Inspector: click element to jump to IDE code (dev only)
    if (process.env.NODE_ENV === 'development') {
      config.plugins = config.plugins || [];
      config.plugins.push(
        codeInspectorPlugin({
          bundler: 'webpack',
          hotKeys: ['metaKey'], // macOS: ⌘ | Windows/Linux: Ctrl
        }),
      );
    }

    return config;
  },
  transpilePackages: ['react-lottie'],
  experimental: {
    optimizePackageImports: ['react-lottie'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  bundlePagesRouterDependencies: true,
  reactCompiler: true,
};

const nextConfig
  = process.env.ANALYZE === 'true'
    ? NextBundleAnalyzer({
        enabled: true,
      })(baseConfig)
    : baseConfig;

export default nextConfig;
