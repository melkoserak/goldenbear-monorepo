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

  async headers() {
    // Definição da Política de Segurança (CSP)
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: https://www.googletagmanager.com https://www.google-analytics.com;
      font-src 'self' data:;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      block-all-mixed-content;
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim(); // Remove quebras de linha extras

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
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;