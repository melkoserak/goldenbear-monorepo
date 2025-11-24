import { Metadata } from "next";
import Link from "next/link";
import { 
  Section, 
  Container, 
  Typography, 
  Button,
  FeatureCard,
  SectionHeader 
} from "@goldenbear/ui";
import { Shield } from "lucide-react"; // <-- Ícone Alterado

// Componentes reutilizados
import { PartnerSection } from "@/components/sections/PartnerSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { DigitalCtaSection } from "@/components/sections/DigitalCtaSection";
import { PageHero } from "@/components/layout/PageHero";
import { RelatedCarouselSection } from "@/components/sections/RelatedCarouselSection"; // <-- NOVO IMPORT


// Metadata otimizada para "Exército"
export const metadata: Metadata = {
  title: "Seguro de Vida para Exército | Golden Bear Seguros",
  description: "Proteção para Oficiais e Praças do Exército Brasileiro. Cobertura completa para quem serve em solo, em guarnição ou missão. Simule online.",
};

// Componente de lista de patentes (Mantido)
const RankList = ({ ranks }: { ranks: string[] }) => (
  <ul className="list-none space-y-1">
    {ranks.map((rank) => (
      <li key={rank}>{rank}</li>
    ))}
  </ul>
);

export default function ExercitoPage() {
  const CtaButton = (
    <Button asChild variant="secondary" size="hero">
      <Link href="/simulador">Simulação Rápida e Gratuita</Link>
    </Button>
  );

  return (
    <>
      {/* Hero Específico para Exército */}
      <PageHero
        tag="Força Terrestre"
        title="Exército Brasileiro"
        subtitle="Proteção completa para quem serve em solo, seja em guarnição, treinamento ou missão."
        ctaNode={CtaButton}
      />

      {/* --- SEÇÃO DEDICADA --- */}
      <Section variant="default">
        <Container>
          <SectionHeader
            title="Cobertura para todas as patentes"
            subtitle="Nossa proteção abrange Oficiais e Praças do Exército."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard icon={Shield} title="Oficiais do Exército">
              <RankList ranks={[
                "Marechal", "General (de Exército, Divisão, Brigada)",
                "Coronel", "Tenente-Coronel", "Major",
                "Capitão", "Tenentes", "Aspirantes"
              ]} />
            </FeatureCard>
            <FeatureCard icon={Shield} title="Praças do Exército">
              <RankList ranks={[
                "Subtenente", "Sargentos",
                "Cabos", "Soldados", "Taifeiros"
              ]} />
            </FeatureCard>
          </div>

          {/* --- CTA DE CONVERSÃO --- */}
          <div className="text-center mt-16">
            <Typography variant="h3" color="default" className="mb-6">
              Pronto para proteger seu futuro?
            </Typography>
            <Button asChild size="hero" variant="default">
              <Link href="/simulador">Simule Agora em 3 Minutos</Link>
            </Button>
          </div>
        </Container>
      </Section>

      {/* 💥 SEÇÃO DE PRODUTOS RELACIONADOS 💥 */}
      <RelatedCarouselSection type="forces" />

      {/* --- Seções Reutilizadas para Confiança --- */}
      <PartnerSection />
      <FaqSection />
      <DigitalCtaSection />
    </>
  );
}