import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { FontSizeManager } from "@/components/layout/FontSizeManager";
import { TopBar } from "@/components/layout/TopBar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import type { Metadata, Viewport } from "next";
import { headers } from 'next/headers'; 

const noto = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-sans",
  display: "swap", // Considerar 'optional' para LCP se aceitável
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.goldenbearseguros.com.br'),
  title: {
    default: "Golden Bear Seguros | Seguro de Vida Militar",
    template: "%s | Golden Bear Seguros",
  },
  alternates: {
    canonical: './',
  },
  description: "Especialistas em seguros de vida para militares das Forças Armadas. Simulação 100% digital e segura.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://www.goldenbearseguros.com.br',
    siteName: 'Golden Bear Seguros',
    images: [{
      url: '/imagens/foto-banner-casal-escudo.png',
      width: 1200,
      height: 630,
      alt: 'Golden Bear Seguros - Proteção Militar',
    }],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') || '';

  return (
    // [FIX] Removido suppressHydrationWarning para expor problemas reais
    <html lang="pt-BR">
      <head>
         <link rel="preconnect" href="https://fonts.googleapis.com" />
         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${noto.variable} font-sans bg-background text-foreground antialiased`}>
        <ThemeProvider nonce={nonce}>
          <FontSizeManager />
          <TopBar />
          <Header />
          <main id="content" className="site-content min-h-screen flex flex-col" tabIndex={-1}>
            <Breadcrumbs />
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}