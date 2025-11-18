/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath e assetPrefix removidos anteriormente, o que está correto.

  output: 'standalone', 
  reactStrictMode: true,
  // Bloco 'images: { unoptimized: true }' removido.
  // Isso reativa a otimização automática de imagens do Next.js (AVIF/WebP).
};

module.exports = nextConfig;