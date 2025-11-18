// packages/config-tailwind/tailwind.config.ts
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate"; // <-- CORREÇÃO 1: Importe aqui
import typography from "@tailwindcss/typography";

const config: Config = {
    // --- ADICIONE ESTA LINHA ---
    darkMode: "class",
    content: [],
    theme: {
      extend: {
        // Tradução direta das suas variáveis DO 'tailwind-base.css'
        colors: {
          border: "var(--border)", // Use a variável correta
          input: "var(--input)",
          ring: "var(--ring)",
          background: "var(--background)", // <-- CORRIGIDO
          foreground: "var(--foreground)", // <-- CORRIGIDO
          primary: {
            DEFAULT: "var(--primary)", 
            hover: "var(--primary-hover)", // <-- ADICIONADO
            foreground: "var(--primary-foreground)", 
          },
          secondary: {
            DEFAULT: "var(--secondary)", 
            hover: "var(--secondary-hover)", // <-- ADICIONADO
            foreground: "var(--secondary-foreground)", 
          },
          destructive: {
            DEFAULT: "var(--destructive)", // <-- CORRIGIDO
            foreground: "var(--destructive-foreground)", // <-- CORRIGIDO
          },
          muted: {
            DEFAULT: "var(--muted)", // <-- CORRIGIDO
            foreground: "var(--muted-foreground)", // <-- CORRIGIDO
          },
          accent: {
            DEFAULT: "var(--accent)", // <-- CORRIGIDO
            foreground: "var(--accent-foreground)", // <-- CORRIGIDO
          },
          popover: {
            DEFAULT: "var(--popover)", // <-- CORRIGIDO
            foreground: "var(--popover-foreground)", // <-- CORRIGIDO
          },
          card: {
            DEFAULT: "var(--card)", // <-- CORRIGIDO
            foreground: "var(--card-foreground)", // <-- CORRIGIDO
          },
          // Essas duas são redundantes se você já mapeou foreground e muted-foreground
          // "text-color": "var(--foreground)",
          // "text-light": "var(--muted-foreground)",
        },
        fontFamily: {
          sans: ["var(--font-noto-sans)", "Noto Sans", "sans-serif"],
        },
        container: {
           center: true,
           padding: "var(--gutter-width, 1.5rem)",
           screens: {
             DEFAULT: "1280px",
             header: "1280px",
           },
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
        // --- ADICIONE ESTE BLOCO ---
        boxShadow: {
          sm: "var(--shadow-sm)",
          md: "var(--shadow-md)",
          lg: "var(--shadow-lg)",
        },
      },
    },
    // 2. Adicione 'typography' na lista de plugins
    plugins: [tailwindcssAnimate, typography],
};

export default config;