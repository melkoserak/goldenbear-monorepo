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
import { Anchor } from "lucide-react"; // <-- Ícone Alterado

// Componentes reutilizados
import { PartnerSection } from "@/components/sections/PartnerSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { DigitalCtaSection } from "@/components/sections/DigitalCtaSection";
import { PageHero } from "@/components/layout/PageHero";

// Metadata otimizada para "Marinha"
export const metadata: Metadata = {
  title: "Seguro de Vida para Marinha | Golden Bear Seguros",
  description: "Proteção para Oficiais e Praças da Marinha do Brasil. Cobertura para quem serve nos mares, rios e em terra. Simule online.",
};

// Componente de lista de patentes (Mantido)
const RankList = ({ ranks }: { ranks: string[] }) => (
  <ul className="list-none space-y-1">
    {ranks.map((rank) => (
      <li key={rank}>{rank}</li>
    ))}
  </ul>
);

export default function MarinhaPage() {
  const CtaButton = (
    <Button asChild variant="secondary" size="hero">
      <Link href="/simulador">Simulação Rápida e Gratuita</Link>
    </Button>
  );

  return (
    <>
      {/* Hero Específico para Marinha */}
      <PageHero
        tag="Guardiões dos Mares"
        title="Marinha do Brasil"
        subtitle="Proteção para quem serve nos mares, rios e em terra, garantindo sua segurança e a da sua família em qualquer missão."
        ctaNode={CtaButton}
      />

      {/* --- SEÇÃO DEDICADA --- */}
      <Section variant="default">
        <Container>
          <SectionHeader
            title="Cobertura para todas as patentes"
            subtitle="Nossa proteção abrange Oficiais e Praças da Marinha."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard icon={Anchor} title="Oficiais da Marinha">
              <RankList ranks={[
                "Almirante", "Almirante de Esquadra", "Vice-Almirante", "Contra-Almirante",
                "Capitão de Mar e Guerra", "Capitão de Fragata", "Capitão de Corveta",
                "Capitão-Tenente", "Tenentes", "Guarda-Marinha"
              ]} />
            </FeatureCard>
            <FeatureCard icon={Anchor} title="Praças da Marinha">
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

      {/* --- Seções Reutilizadas para Confiança --- */}
      <PartnerSection />
      <FaqSection />
      <DigitalCtaSection />
    </>
  );
}