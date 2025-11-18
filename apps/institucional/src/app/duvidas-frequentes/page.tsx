import { Metadata } from "next";
import { 
  Section, 
  Container, 
  Typography
} from "@goldenbear/ui";

// Componentes reutilizados
import { FaqSection } from "@/components/sections/FaqSection";
import { DigitalCtaSection } from "@/components/sections/DigitalCtaSection";
import { PageHero } from "@/components/layout/PageHero";

// 1. Metadata otimizada para "Dúvidas Frequentes"
export const metadata: Metadata = {
  title: "Dúvidas Frequentes | Golden Bear Seguros",
  description: "Tire suas dúvidas sobre seguro de vida para militares, coberturas, carências, contratação e mais. Encontre respostas rápidas aqui.",
};

export default function DuvidasFrequentesPage() {
  return (
    <>
      {/* Hero Padrão da Página */}
      <PageHero
        tag="FAQ"
        title="Dúvidas Frequentes"
        subtitle="Encontre aqui as respostas para as perguntas mais comuns sobre nossos seguros, coberturas e processo de contratação."
      />

      {/* --- SEÇÃO DEDICADA --- */}
      {/* Reutiliza a FaqSection que já tínhamos */}
      <FaqSection />

      {/* --- Seção de CTA (Reutilizada) --- */}
      {/* Opcional: Podemos adicionar mais FAQs aqui no futuro */}
      <DigitalCtaSection />
    </>
  );
}