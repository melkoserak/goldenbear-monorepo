/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. REMOVA ESTAS DUAS LINHAS:
  // basePath: '/institucional',
  // assetPrefix: '/institucional',

  // 2. Mantenha o resto
  output: 'standalone', 
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;