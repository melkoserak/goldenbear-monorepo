/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,

  // Correção do Erro de Rewrite
  async rewrites() {
    // Define um valor padrão (http://localhost:3001) se a variável não existir
    const SIMULATOR_URL = process.env.NEXT_PUBLIC_SIMULATOR_URL || 'http://localhost:3001';

    return [
      {
        source: '/simulador/:path*',
        destination: `${SIMULATOR_URL}/simulador/:path*`,
      },
    ];
  },

  // Agora 'headers' está DENTRO do objeto nextConfig
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Ou SAMEORIGIN se precisar de iframes
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;