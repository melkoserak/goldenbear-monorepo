import type { Config } from "tailwindcss";

// Este é o seu arquivo original, agora com as variáveis do style.css
const config: Config = {
    // --- ADICIONE ESTA LINHA ---
    darkMode: "class",
    content: [
      // O 'content' será definido nos projetos (apps) que usarem este config
    ],
    theme: {
      extend: {
        // Tradução direta das suas variáveis do style.css
        colors: {
          border: "var(--border, #e0e0e0)",       // --border-color
          input: "var(--input)",
          ring: "var(--ring, #0266e8)",
          background: "var(--white-color, #ffffff)", // --white-color
          foreground: "var(--text-color, #252525)",   // --text-color
          primary: {
            DEFAULT: "var(--primary-color, #0266e8)", // --primary-color
            dark: "var(--bluedark-color, #004aac)",    // --bluedark-color
            foreground: "var(--white-color, #ffffff)",
          },
          secondary: {
            DEFAULT: "var(--secondary-color, #efb700)", // --secondary-color
            foreground: "var(--text-color, #252525)",
          },
          destructive: {
            DEFAULT: "hsl(var(--destructive))",
            foreground: "hsl(var(--destructive-foreground))",
          },
          muted: {
            DEFAULT: "hsl(var(--muted))",
            foreground: "var(--text-light, #555555)", // --text-light
          },
          accent: {
            DEFAULT: "var(--light-gray-color, #f6f6f6)", // --light-gray-color
            foreground: "var(--text-light, #555555)",
          },
          popover: {
            DEFAULT: "var(--white-color, #ffffff)",
            foreground: "var(--text-color, #252525)",
          },
          card: {
            DEFAULT: "var(--white-color, #ffffff)",
            foreground: "var(--text-color, #252525)",
          },
          // Adicionando as cores de texto restantes
          "text-color": "var(--text-color, #252525)",
          "text-light": "var(--text-light, #555555)",
        },
        fontFamily: {
          sans: ["var(--font-noto-sans)", "Noto Sans", "sans-serif"], // --font-primary
        },
        container: {
           center: true,
           padding: "var(--gutter-width, 1.5rem)", // 24px
           screens: {
             DEFAULT: "1280px", // --container-max-width
             header: "1600px",  // --container-header-max-width
           },
        },
        borderRadius: {
          lg: "var(--border-radius, 5px)", // --border-radius
          md: "calc(var(--border-radius, 5px) - 2px)",
          sm: "calc(var(--border-radius, 5px) - 4px)",
        },
      },
    },
    plugins: [require("tailwindcss-animate")],
};

export default config;