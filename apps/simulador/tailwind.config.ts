import type { Config } from "tailwindcss";
// Importa a configuração compartilhada
import sharedConfig from "../../packages/config-tailwind/tailwind.config";

const config: Config = {
  ...sharedConfig, // Herda toda a configuração compartilhada
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // Aponta para o pacote de UI
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}", 
  ],
};

export default config;