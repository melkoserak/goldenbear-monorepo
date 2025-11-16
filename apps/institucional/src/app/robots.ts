import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/simulador/api/', '/_next/'], // Protege rotas de API e internas
    },
    sitemap: 'https://www.goldenbearseguros.com.br/sitemap.xml',
  };
}