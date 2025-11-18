import type { Config } from "tailwindcss";
// --- CORREÇÃO APLICADA ---
// Importa a configuração compartilhada via alias do workspace, não path relativo
import sharedConfig from "@goldenbear/tailwind-config";

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