import type NextConfig from 'next';

const config: NextConfig = {
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
  webpack(config: any) {
    // https://github.com/kkomelin/isomorphic-dompurify/issues/54
    // Fix isomorphic-dompurify in app router
    config.externals = [...(config.externals || []), 'jsdom', 'sharp'];

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
};

export default config;
