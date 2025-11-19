/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/simulador',
  assetPrefix: '/simulador',
  // --- ALTERAÇÃO AQUI: Reativado para garantir qualidade de código ---
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  async headers() {
    // CSP Específica para o Simulador (Permite Iframes da MAG)
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: https://www.googletagmanager.com;
      font-src 'self' data:;
      frame-src 'self' https://widgetshmg.mag.com.br https://widgetshmg.mongeralaegon.com.br;
      connect-src 'self' https://www.google-analytics.com https://viacep.com.br;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'self' https://www.goldenbearseguros.com.br; 
      block-all-mixed-content;
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-Frame-Options', 
            value: 'SAMEORIGIN', 
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;