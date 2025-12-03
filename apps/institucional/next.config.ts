/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,

  async rewrites() {
    const SIMULATOR_URL = process.env.NEXT_PUBLIC_SIMULATOR_URL || 'http://localhost:3001';
    return [
      {
        source: '/simulador/:path*',
        destination: `${SIMULATOR_URL}/simulador/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;