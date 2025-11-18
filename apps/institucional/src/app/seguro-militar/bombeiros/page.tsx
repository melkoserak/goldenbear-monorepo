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
import { 
  Flame // <-- Ícone específico
} from "lucide-react";

// Componentes reutilizados
import { PartnerSection } from "@/components/sections/PartnerSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { DigitalCtaSection } from "@/components/sections/DigitalCtaSection";
import { PageHero } from "@/components/layout/PageHero";

// Metadata otimizada para "Bombeiros"
export const metadata: Metadata = {
  title: "Seguro de Vida para Bombeiros | Golden Bear Seguros",
  description: "Proteção para Oficiais e Praças do Corpo de Bombeiros Militar. O amparo necessário para heróis que arriscam a vida. Simule online.",
};

// Componente de lista de patentes
const RankList = ({ ranks }: { ranks: string[] }) => (
  <ul className="list-none space-y-1">
    {ranks.map((rank) => (
      <li key={rank}>{rank}</li>
    ))}
  </ul>
);

export default function BombeirosPage() {
  const CtaButton = (
    <Button asChild variant="secondary" size="hero">
      <Link href="/simulador">Simulação Rápida e Gratuita</Link>
    </Button>
  );

  return (
    <>
      {/* Hero Específico para Bombeiros */}
      <PageHero
        tag="Para heróis que arriscam a vida"
        title="Corpo de Bombeiros Militar"
        subtitle="Proteção completa que entende os riscos da sua rotina, garantindo a sua tranquilidade e a da sua família."
        ctaNode={CtaButton}
      />

      {/* --- SEÇÃO DEDICADA (Dissecando a categoria) --- */}
      <Section variant="default">
        <Container>
          <SectionHeader
            title="Cobertura para todas as patentes"
            subtitle="Nossa proteção abrange Oficiais e Praças do Corpo de Bombeiros Militar."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard icon={Flame} title="Oficiais do Corpo de Bombeiros">
              <RankList ranks={[
                "Coronel BM", "Tenente-Coronel BM", "Major BM",
                "Capitão BM", "1º Tenente BM", "2º Tenente BM"
              ]} />
            </FeatureCard>
            <FeatureCard icon={Flame} title="Praças do Corpo de Bombeiros">
              <RankList ranks={[
                "Subtenente BM", "Sargentos BM",
                "Cabo BM", "Soldado BM"
              ]} />
            </FeatureCard>
          </div>

          {/* --- CTA DE CONVERSÃO (Sua ideia) --- */}
          <div className="mt-16">
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