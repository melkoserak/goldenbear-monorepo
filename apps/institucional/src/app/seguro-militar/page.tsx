import { Metadata } from "next";
import Link from "next/link";
import { 
  Section, 
  Container, 
  FeatureCard,
  SectionHeader 
} from "@goldenbear/ui";
import { 
  Shield,     
  Anchor,     
  Plane,      
  Flame,
  ArrowRight
} from "lucide-react";

import { PartnerSection } from "@/components/sections/PartnerSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { DigitalCtaSection } from "@/components/sections/DigitalCtaSection";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Seguro Militar | Golden Bear",
  description: "Proteção especializada para Exército, Marinha, Aeronáutica, PM e Bombeiros.",
};

const forces = [
  { 
    icon: Shield, 
    title: "Exército Brasileiro", 
    href: "/seguro-militar/exercito",
    subtitle: "Proteção completa para quem serve em solo, seja em guarnição, treinamento ou missão."
  },
  { 
    icon: Anchor, 
    title: "Marinha do Brasil", 
    href: "/seguro-militar/marinha",
    subtitle: "Proteção para quem serve nos mares, rios e em terra, do Oiapoque ao Chuí."
  },
  { 
    icon: Plane, 
    title: "Força Aérea Brasileira", 
    href: "/seguro-militar/aeronautica",
    subtitle: "Segurança à altura dos seus voos. Proteção completa em solo e no ar."
  },
  { 
    icon: Shield, 
    title: "Polícia Militar", 
    href: "/seguro-militar/policia-militar",
    subtitle: "Proteção robusta para quem enfrenta os desafios diários na proteção da sociedade."
  },
  { 
    icon: Flame, 
    title: "Corpo de Bombeiros Militar", 
    href: "/seguro-militar/bombeiros",
    subtitle: "O amparo necessário para heróis que arriscam a vida para salvar outras."
  }
];

export default function SeguroMilitarHubPage() {
  return (
    <>
      <PageHero
        tag="Para Militares"
        title="Proteção sob medida para sua carreira"
        subtitle="Entendemos os riscos únicos da sua profissão. Oferecemos coberturas específicas para cada Força. Selecione a sua para ver os detalhes."
      />

      <Section variant="default" padding="lg">
        <Container>
          <SectionHeader
            title="Para qual força você serve?"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {forces.map((force) => (
              <FeatureCard 
                key={force.title} 
                icon={force.icon} 
                title={force.title}
                // 1. Classes para tornar o card relativo e animado no hover
                className="relative group transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                {force.subtitle}
                
                {/* Link empurrado para o rodapé do card */}
                <Link 
                  href={force.href} 
                  className="inline-flex items-center text-foreground hover:underline font-medium text-sm mt-auto pt-4"
                >
                  {/* 2. Span estendido que cobre todo o card pai */}
                  <span className="absolute inset-0 z-10" aria-hidden="true" />
                  Ver detalhes <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </FeatureCard>
            ))}
          </div>
        </Container>
      </Section>

      <PartnerSection />
      <FaqSection />
      <DigitalCtaSection />
    </>
  );
}