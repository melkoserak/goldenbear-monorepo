import { Metadata } from "next";
import Link from "next/link";
import {
  Section,
  Container,
  FeatureCard,
  SectionHeader,
  Button
} from "@goldenbear/ui";
import {
  Shield,         // Vida (Morte)
  HeartPulse,     // Doenças Graves
  ShieldAlert,    // Invalidez
  ShieldCheck,    // Funeral
  ArrowRight
} from "lucide-react";

// Componentes reutilizados para manter a consistência e confiança
import { PartnerSection } from "@/components/sections/PartnerSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { DigitalCtaSection } from "@/components/sections/DigitalCtaSection";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Nossos Produtos | Golden Bear Seguros",
  description: "Conheça nossa linha completa de seguros para militares. Proteção para vida, acidentes, doenças graves e assistência funeral. Simule online.",
  openGraph: {
    title: "Nossos Produtos | Golden Bear Seguros",
    description: "Proteção completa e especializada para você e sua família."
  }
};

// Dados centralizados para facilitar manutenção
const products = [
  {
    icon: Shield,
    title: "Seguro de Vida (Morte)",
    description: "A proteção fundamental. Garante que sua família receba o capital contratado para manter o padrão de vida na sua ausência.",
    href: "/produtos/seguro-vida-morte",
  },
  {
    icon: HeartPulse,
    title: "Doenças Graves",
    description: "Receba o capital em vida. Um apoio financeiro robusto para custear tratamentos e focar na sua recuperação em caso de diagnósticos complexos.",
    href: "/produtos/doencas-graves",
  },
  {
    icon: ShieldAlert,
    title: "Invalidez por Acidente",
    description: "Segurança para o seu recomeço. Indenização paga em vida para apoiar sua reestruturação financeira e adaptação após imprevistos.",
    href: "/produtos/invalidez-acidente",
  },
  {
    icon: ShieldCheck,
    title: "Assistência Funeral",
    description: "Um ato de cuidado. Cobre despesas e resolve burocracias no momento mais difícil, poupando sua família de custos inesperados.",
    href: "/produtos/assistencia-funeral",
  }
];

export default function ProdutosHubPage() {
  const CtaButton = (
    <Button asChild variant="secondary" size="hero">
      <Link href="/simulador">Simulação Rápida e Gratuita</Link>
    </Button>
  );

  return (
    <>
      {/* 1. Hero: Contextualiza o usuário */}
      <PageHero
        tag="Portfólio Completo"
        title="Soluções de proteção para cada momento"
        subtitle="Oferecemos um conjunto de coberturas desenhadas especificamente para as necessidades e riscos da carreira militar."
        ctaNode={CtaButton}
      />

      {/* 2. Grid de Produtos: O coração da página */}
      <Section variant="default" padding="lg">
        <Container>
          <SectionHeader
            title="Escolha a proteção ideal"
            subtitle="Navegue pelas nossas soluções e descubra os detalhes de cada cobertura."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map((product) => (
              <FeatureCard
                key={product.title}
                icon={product.icon}
                title={product.title}
              >
                {/* Descrição do produto */}
                <span className="mb-6 block">
                  {product.description}
                </span>

                {/* Link de ação secundária (Navegação) */}
                <Link
                  href={product.href}
                  className="inline-flex items-center text-foreground hover:text-primary hover:underline font-medium text-sm mt-auto transition-colors"
                >
                  Ver detalhes e coberturas <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </FeatureCard>
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. Seções de Reforço de Marca (Trust signals) */}
      <PartnerSection />
      <FaqSection />
      <DigitalCtaSection />
    </>
  );
}