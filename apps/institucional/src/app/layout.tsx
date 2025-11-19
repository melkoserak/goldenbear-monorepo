import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { FontSizeManager } from "@/components/layout/FontSizeManager";
import { TopBar } from "@/components/layout/TopBar"; // 1. Importe o TopBar
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";


const noto = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-sans",
});

// --- ATUALIZAÇÃO DE SEO AQUI ---
export const metadata: Metadata = {
  title: {
    default: "Golden Bear Seguros | Seguro de Vida Exclusivo para Militares",
    template: "%s | Golden Bear Seguros", // Permite títulos dinâmicos em outras páginas (ex: "Sobre | Golden Bear...")
  },
  description: "Especialistas em seguros de vida para militares das Forças Armadas (Exército, Marinha e Aeronáutica). Simule online e proteja sua família com a segurança da MAG Seguros.",
  keywords: [
    "seguro de vida militar",
    "seguro exército",
    "seguro marinha",
    "seguro aeronáutica",
    "golden bear seguros",
    "mag seguros",
    "seguro de vida forças armadas",
    "proteção familiar militar"
  ],
  authors: [{ name: "Golden Bear Seguros" }],
  creator: "Golden Bear Seguros",
  // Define a base para URLs relativas (importante para imagens OG)
  metadataBase: new URL('https://www.goldenbearseguros.com.br'), 
  
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://www.goldenbearseguros.com.br',
    title: "Golden Bear Seguros | Proteção para Família Militar",
    description: "Seguro de vida sob medida para militares. Sem burocracia, 100% digital e com a solidez da MAG Seguros.",
    siteName: 'Golden Bear Seguros',
    images: [
      {
        url: '/imagens/foto-banner-casal-escudo.png', // Usando a imagem principal que você já tem
        width: 1200,
        height: 630,
        alt: 'Família militar protegida pela Golden Bear Seguros',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: "Golden Bear Seguros | Seguro Militar",
    description: "Proteção especializada para quem serve ao Brasil.",
    images: ['/imagens/foto-banner-casal-escudo.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: '/favicon.ico',
  },
};
// --- FIM DA ATUALIZAÇÃO ---

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${noto.variable} font-sans bg-background text-foreground`}>
        <ThemeProvider>
          <FontSizeManager />
          <TopBar /> {/* 2. Adicione o TopBar aqui */}
          <Header />
         <main id="content" className="site-content">
            {/* 2. ADICIONE O BREADCRUMB AQUI */}
            <Breadcrumbs />
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}