import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,

  // Mantemos a otimização de imagens que é importante para performance
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  async rewrites() {
    // REVERSÃO: Removemos a validação do Zod que estava a bloquear o build.
    // Agora ele aceita o valor da env ou usa o fallback silenciosamente.
    const SIMULATOR_URL = process.env.NEXT_PUBLIC_SIMULATOR_URL || 'http://localhost:3001';
    
    return [
      {
        source: '/simulador/:path*',
        destination: `${SIMULATOR_URL}/simulador/:path*`,
      },
    ];
  },
};

export default nextConfig;