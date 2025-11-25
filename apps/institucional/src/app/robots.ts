import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Bloqueia áreas privadas e API para não gastar "crawl budget" do Google
      disallow: ['/simulador/api/', '/private/', '/minha-conta/'],
    },
    sitemap: 'https://www.goldenbearseguros.com.br/sitemap.xml',
  };
}