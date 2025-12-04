import type { NextConfig } from "next";
import { z } from "zod"; // Certifique-se de instalar: pnpm add zod

// 1. Validação Inline (evita erro de import do ./src/env)
const envSchema = z.object({
  NEXT_PUBLIC_SIMULATOR_URL: z.string().url().optional().default('http://localhost:3001').refine((url) => {
    // Se for produção, não pode ser localhost
    if (process.env.NODE_ENV === 'production') {
      return !url.includes('localhost');
    }
    return true;
  }, { message: "EM PRODUÇÃO: A URL do simulador não pode ser localhost." }),
});

// Valida as variáveis antes de exportar a config
const env = envSchema.parse({
  NEXT_PUBLIC_SIMULATOR_URL: process.env.NEXT_PUBLIC_SIMULATOR_URL,
});

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  async rewrites() {
    return [
      {
        source: '/simulador/:path*',
        destination: `${env.NEXT_PUBLIC_SIMULATOR_URL}/simulador/:path*`,
      },
    ];
  },
};

// 2. Correção do erro "Cannot find name 'module'"
// Em arquivos .ts modernos do Next.js, usamos export default
export default nextConfig;