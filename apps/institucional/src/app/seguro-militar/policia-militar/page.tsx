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


// Metadata otimizada para "Polícia Militar"
export const metadata: Metadata = {
  title: "Seguro de Vida para Polícia Militar | Golden Bear Seguros",
  description: "Proteção para Oficiais e Praças da Polícia Militar. Cobertura robusta para quem enfrenta os desafios diários na proteção da sociedade. Simule online.",
};

// Componente de lista de patentes (Mantido)
const RankList = ({ ranks }: { ranks: string[] }) => (
  <ul className="list-none space-y-1">
    {ranks.map((rank) => (
      <li key={rank}>{rank}</li>
    ))}
  </ul>
);

export default function PoliciaMilitarPage() {
  const CtaButton = (
    <Button asChild variant="secondary" size="hero">
      <Link href="/simulador">Simulação Rápida e Gratuita</Link>
    </Button>
  );

  return (
    <>
      {/* Hero Específico para PM */}
      <PageHero
        tag="Força e Honra"
        title="Polícia Militar"
        subtitle="Proteção robusta para quem arrisca a vida diariamente na proteção da sociedade. Cobertura para todos os momentos, em serviço ou de folga."
        ctaNode={CtaButton}
      />

      {/* --- SEÇÃO DEDICADA --- */}
      <Section variant="default">
        <Container>
          <SectionHeader
            title="Cobertura para todas as patentes"
            subtitle="Nossa proteção abrange Oficiais e Praças da Polícia Militar."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard icon={Shield} title="Oficiais da Polícia Militar">
              <RankList ranks={[
                "Coronel PM", "Tenente-Coronel PM", "Major PM",
                "Capitão PM", "1º Tenente PM", "2º Tenente PM"
              ]} />
            </FeatureCard>
            <FeatureCard icon={Shield} title="Praças da Polícia Militar">
              <RankList ranks={[
                "Subtenente PM", "Sargentos PM",
                "Cabo PM", "Soldado PM"
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