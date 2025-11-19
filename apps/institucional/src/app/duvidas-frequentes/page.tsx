import { Metadata } from "next";
import { FaqSection } from "@/components/sections/FaqSection";
import { DigitalCtaSection } from "@/components/sections/DigitalCtaSection";
import { PageHero } from "@/components/layout/PageHero";
// 1. Importe os dados
import { faqData } from '@/lib/data/faqs';

export const metadata: Metadata = {
  title: "Dúvidas Frequentes | Golden Bear Seguros",
  description: "Tire suas dúvidas sobre seguro de vida para militares, coberturas, carências, contratação e mais.",
};

export default function DuvidasFrequentesPage() {
  // 2. Gere o JSON-LD estruturado
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <>
      {/* 3. Injete o Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        tag="FAQ"
        title="Dúvidas Frequentes"
        subtitle="Encontre aqui as respostas para as perguntas mais comuns sobre nossos seguros, coberturas e processo de contratação."
      />

      <FaqSection />
      <DigitalCtaSection />
    </>
  );
}