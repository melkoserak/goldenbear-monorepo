/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/simulador',
  assetPrefix: '/simulador',
  reactStrictMode: true,
  
  images: {
    formats: ['image/avif', 'image/webp'],
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
    // CSP Ajustada para o Widget V3 da MAG
    const cspHeader = `
      default-src 'self';
      
      script-src 'self' 'unsafe-inline' 'unsafe-eval' 
        https://www.googletagmanager.com 
        https://www.google-analytics.com 
        https://az416426.vo.msecnd.net 
        https://widgetshmg.mongeralaegon.com.br; 
        
      style-src 'self' 'unsafe-inline' 
        https://fonts.googleapis.com;
        
      img-src 'self' blob: data: https:;
      
      font-src 'self' data: 
        https://fonts.gstatic.com 
        https://widgetshmg.mongeralaegon.com.br;
        
      frame-src 'self' 
        https://widgetshmg.mag.com.br 
        https://widgetshmg.mongeralaegon.com.br 
        https://widgets.mongeralaegon.com.br;
        
      connect-src 'self' 
        https://www.google-analytics.com 
        https://viacep.com.br 
        https://apis-stg.mag.com.br 
        https://api.mag.com.br 
        https://dc.services.visualstudio.com; 

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