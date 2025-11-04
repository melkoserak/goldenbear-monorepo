// packages/config-tailwind/tailwind.config.ts
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate"; // <-- CORREÇÃO 1: Importe aqui

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
            DEFAULT: "var(--primary)", // <-- CORRIGIDO
            // 'dark' aqui é um tom, não o modo. 
            // Você nomeou 'bluedark-color' no config antigo, mas não está no CSS.
            // Removi por enquanto, a menos que você adicione ao CSS.
            // dark: "var(--bluedark-color, #004aac)", 
            foreground: "var(--primary-foreground)", // <-- CORRIGIDO
          },
          secondary: {
            DEFAULT: "var(--secondary)", // <-- CORRIGIDO
            foreground: "var(--secondary-foreground)", // <-- CORRIGIDO
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
             header: "1600px",
           },
        },
        borderRadius: {
          lg: "var(--radius)", // Use a variável de 'tailwind-base.css'
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
      },
    },
    plugins: [tailwindcssAnimate], // <-- CORREÇÃO 2: Use a variável importada
};

export default config;