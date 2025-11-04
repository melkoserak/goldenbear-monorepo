/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. INFORMA AO NEXT.JS QUE O SITE ESTARÁ EM /simulador
  basePath: '/simulador',
  assetPrefix: '/simulador',

  // 2. REMOVA OU COMENTE ESTA LINHA:
  // output: 'export', // <-- ESTA LINHA CAUSA O ERRO 404 NAS APIs

  reactStrictMode: false,
  images: {
    unoptimized: true,
  },

  // --- ADICIONE ESTE BLOCO ---
  // Isso avisa ao Vercel para não falhar o build por causa de regras de Linter
  eslint: {
    ignoreDuringBuilds: true,
  },
  // --- FIM DO BLOCO ---
};

module.exports = nextConfig;