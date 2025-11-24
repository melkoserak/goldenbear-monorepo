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
import { Plane } from "lucide-react"; // <-- Ícone Alterado

// Componentes reutilizados
import { PartnerSection } from "@/components/sections/PartnerSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { DigitalCtaSection } from "@/components/sections/DigitalCtaSection";
import { PageHero } from "@/components/layout/PageHero";
import { RelatedCarouselSection } from "@/components/sections/RelatedCarouselSection"; // <-- NOVO IMPORT


// Metadata otimizada para "Aeronáutica"
export const metadata: Metadata = {
  title: "Seguro de Vida para Aeronáutica | Golden Bear Seguros",
  description: "Proteção para Oficiais e Praças da Força Aérea Brasileira. Segurança à altura dos seus voos, em solo e no ar. Simule online.",
};

// Componente de lista de patentes (Mantido)
const RankList = ({ ranks }: { ranks: string[] }) => (
  <ul className="list-none space-y-1">
    {ranks.map((rank) => (
      <li key={rank}>{rank}</li>
    ))}
  </ul>
);

export default function AeronauticaPage() {
  const CtaButton = (
    <Button asChild variant="secondary" size="hero">
      <Link href="/simulador">Simulação Rápida e Gratuita</Link>
    </Button>
  );

  return (
    <>
      {/* Hero Específico para Aeronáutica */}
      <PageHero
        tag="Sentinelas do Espaço Aéreo"
        title="Força Aérea Brasileira"
        subtitle="Segurança à altura dos seus voos. Oferecemos proteção completa que entende os riscos da sua rotina em solo e no ar."
        ctaNode={CtaButton}
      />

      {/* --- SEÇÃO DEDICADA --- */}
      <Section variant="default">
        <Container>
          <SectionHeader
            title="Cobertura para todas as patentes"
            subtitle="Nossa proteção abrange Oficiais e Praças da Aeronáutica."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard icon={Plane} title="Oficiais da Aeronáutica">
              <RankList ranks={[
                "Marechal-do-Ar", "Tenente-Brigadeiro-do-Ar", "Major-Brigadeiro", "Brigadeiro",
                "Coronel", "Tenente-Coronel", "Major",
                "Capitão", "Tenentes", "Aspirantes"
              ]} />
            </FeatureCard>
            <FeatureCard icon={Plane} title="Praças da Aeronáutica">
              <RankList ranks={[
                "Suboficial", "Sargentos",
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