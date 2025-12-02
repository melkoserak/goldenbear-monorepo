import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { FontSizeManager } from "@/components/layout/FontSizeManager";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";

// Importe o DevToolbar
import { DevToolbar } from "@/components/shared/DevToolbar";

const noto = Noto_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "Simulador de Seguro de Vida | Golden Bear",
  description: "Simule e contrate o seu seguro de vida para militares em poucos passos.",
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX';

  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head>
        {/* ... */}
      </head>
      <body className={`${noto.className} bg-accent min-h-screen`}> 
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
        <ReactQueryProvider>
          <ThemeProvider>
            <FontSizeManager />
            {children}
            {/* Adicione o Toolbar aqui. Ele se auto-gerencia para não aparecer em prod */}
            <DevToolbar />
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}