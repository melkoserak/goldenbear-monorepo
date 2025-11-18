import { Metadata } from "next";
import Image from "next/image";
import { 
  Section, 
  Container, 
  Typography,
  FeatureCard,
  SectionHeader // <-- Importado
} from "@goldenbear/ui";
import { ShieldCheck, Target, Award } from "lucide-react";

// --- CORREÇÃO: IMPORTS EM FALTA ADICIONADOS ---
import { PartnerSection } from "@/components/sections/PartnerSection";
import { DigitalCtaSection } from "@/components/sections/DigitalCtaSection";
import { PageHero } from "@/components/layout/PageHero";

// 1. SEO Otimizado para a página "Sobre"
export const metadata: Metadata = {
  title: "Quem Somos | Golden Bear Seguros",
  description: "Conheça a Golden Bear Seguros, especialistas em seguro de vida para militares e parceiros oficiais da MAG Seguros. Nossa missão é proteger quem protege o Brasil.",
  openGraph: {
    title: "Quem Somos | Golden Bear Seguros",
    description: "Nossa missão é proteger quem protege o Brasil."
  }
};

// Estrutura da Página
export default function QuemSomosPage() {
  return (
    <>
      <PageHero
        tag="Nossa História"
        title="Especialistas em proteger quem protege o Brasil"
        subtitle="A Golden Bear nasceu com um propósito claro: oferecer a segurança e a tranquilidade que a família militar merece, com a dignidade e o respeito que sua carreira exige."
      />

      {/* Seção de Missão e Imagem */}
      <Section padding="lg">
        <Container className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
          {/* Imagem */}
          <div className="relative w-full h-80 lg:h-[450px] rounded-lg overflow-hidden shadow-md">
            <Image
              src="/imagens/foto-militar-exercito.png" //
              alt="Militar do Exército Brasileiro em formação"
              layout="fill"
              objectFit="cover"
              className="grayscale"
            />
            <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
          </div>

          {/* Texto da Missão */}
          <div className="space-y-6">
            <Typography variant="h2" color="primary">
              Nossa Missão
            </Typography>
            <Typography variant="large" className="font-medium">
              Entendemos a realidade do militar. A rotina de missões, os riscos da profissão e a importância de ter um porto seguro não são apenas detalhes de uma apólice; são o centro da nossa operação.
            </Typography>
            <Typography variant="body" color="muted">
              Por isso, nos especializamos em desburocratizar o acesso ao seguro de vida, oferecendo um processo 100% digital, rápido e transparente, garantindo que você e sua família tenham a melhor proteção, sem surpresas e com a solidez de um dos maiores grupos seguradores do país.
            </Typography>
          </div>
        </Container>
      </Section>

{/* Seção de Valores */}
      <Section variant="accent" padding="lg">
        <Container>
          
          <SectionHeader
            title="Nossos Valores"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard icon={Target} title="Propósito">
              Nossa vocação é servir quem serve ao Brasil. Colocamos a segurança da família militar acima de tudo.
            </FeatureCard>
            <FeatureCard icon={ShieldCheck} title="Transparência">
              Processos claros, sem letras miúdas. A confiança é a base do nosso relacionamento com você.
            </FeatureCard>
            <FeatureCard icon={Award} title="Excelência">
              Oferecemos apenas produtos de elite, com a garantia da MAG Seguros e um atendimento especializado.
            </FeatureCard>
          </div>
        </Container>
      </Section>

      {/* Reutilização da Seção de Parceiros */}
      <PartnerSection />

      {/* Reutilização da Seção de CTA */}
      <DigitalCtaSection />
    </>
  );
}