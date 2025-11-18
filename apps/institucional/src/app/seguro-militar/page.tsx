import { Metadata } from "next";
import Link from "next/link";
import { 
  Section, 
  Container, 
  Typography, 
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

// Componentes reutilizados
import { PartnerSection } from "@/components/sections/PartnerSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { DigitalCtaSection } from "@/components/sections/DigitalCtaSection";
import { PageHero } from "@/components/layout/PageHero";

// ... (metadata - sem alterações) ...

// Dados para os cartões do Hub (sem alterações)
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

      {/* --- SEÇÃO HUB --- */}
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
              >
                {/* --- CORREÇÃO APLICADA AQUI ---
                  O subtítulo vem primeiro.
                  O Link usa 'mt-auto' para ser empurrado para o fundo do card.
                  'pt-4' adiciona um espaçamento de segurança.
                */}
                {force.subtitle}
                
                <Link 
                  href={force.href} 
                  className="inline-flex items-center text-foreground hover:underline font-medium text-sm mt-auto pt-4"
                >
                  Ver detalhes <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </FeatureCard>
            ))}
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