/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/simulador',
  assetPrefix: '/simulador',
  reactStrictMode: true,
  
  // --- CORREÇÃO CRÍTICA: Ativar otimização ---
  images: {
    // unoptimized: true, // <--- REMOVA ESTA LINHA!
    formats: ['image/avif', 'image/webp'], // Força formatos modernos
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.goldenbearseguros.com.br',
      },
    ],
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
      img-src 'self' blob: data: https:;
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
          { key: 'Content-Security-Policy', value: cspHeader },
          // Adicione HSTS como sugerido no relatório
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;