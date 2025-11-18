import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import Script from 'next/script';
import "./globals.css";
// 1. Importe os providers
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { FontSizeManager } from "@/components/layout/FontSizeManager";

const noto = Noto_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "Simulador de Seguro de Vida | Golden Bear",
  description: "Simule e contrate o seu seguro de vida para militares em poucos passos.",
};

// Remova o 'force-static' que tínhamos aqui
// export const dynamic = 'force-static'; 

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX';

  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head>
        {/* ... (script GTM) ... */}
      </head>
      {/* --- CORREÇÃO APLICADA --- */}
      {/* Trocado bg-[#F0F2F5] pelo token semântico bg-accent */}
      <body className={`${noto.className} bg-accent min-h-screen`}> 
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
        <ThemeProvider>
          <FontSizeManager />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}