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
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX'; // Use variável de ambiente

  return (
    <html lang="pt-br" suppressHydrationWarning> {/* 2. Adicione suppressHydrationWarning */}
      <head>
        {/* ... (script GTM) ... */}
        <Script
          id="gtm-script-head"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
      </head>
      <body className={`${noto.className} bg-[#F0F2F5] min-h-screen`}>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
        {/* 3. Envolva o children com os providers */}
        <ThemeProvider>
          <FontSizeManager />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}