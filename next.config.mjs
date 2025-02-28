/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
    optimizePackageImports: ['react-lottie']
  }
};

export default nextConfig;
