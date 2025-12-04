import { Metadata } from "next";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { 
  Section, Container, Typography, Button,
  FeatureCard, SectionHeader 
} from "@goldenbear/ui";
import { 
  DollarSign, HeartHandshake, ShieldCheck,
  CheckCircle, Zap, Briefcase, Wallet 
} from "lucide-react";

// Componentes críticos (Mantidos)
import { PartnerSection } from "@/components/sections/PartnerSection";
import { PageHero } from "@/components/layout/PageHero";
import { ComparisonSection } from '@/components/sections/ComparisonSection';


const RelatedCarouselSection = dynamic(
  () => import('@/components/sections/RelatedCarouselSection').then(mod => mod.RelatedCarouselSection)
);

const FaqSection = dynamic(
  () => import('@/components/sections/FaqSection').then(mod => mod.FaqSection)
);

const DigitalCtaSection = dynamic(
  () => import('@/components/sections/DigitalCtaSection').then(mod => mod.DigitalCtaSection)
);

export const metadata: Metadata = {
  title: "Seguro de Vida por Morte | Golden Bear Seguros",
  description: "Proteja o futuro da sua família. O Seguro de Vida (Morte) garante a tranquilidade financeira para quem você ama. Especialistas em militares. Simule agora.",
  alternates: {
    canonical: "https://www.goldenbearseguros.com.br/produtos/seguro-vida-morte"
  },
  openGraph: {
    title: "Seguro de Vida por Morte | Golden Bear Seguros",
    description: "Garanta a tranquilidade financeira da sua família com a cobertura essencial.",
    url: "https://www.goldenbearseguros.com.br/produtos/seguro-vida-morte",
    type: "website"
  }
};

const jsonLdString = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FinancialProduct",
  "name": "Seguro de Vida (Morte)",
  "description": "Proteção financeira fundamental para garantir o padrão de vida da sua família na sua ausência. Cobertura de até R$ 1 Milhão.",
  "provider": {
    "@type": "Organization",
    "name": "Golden Bear Seguros",
    "url": "https://www.goldenbearseguros.com.br"
  },
  "audience": {
    "@type": "Audience",
    "audienceType": "Militares das Forças Armadas"
  },
  "areaServed": "BR",
  "url": "https://www.goldenbearseguros.com.br/produtos/seguro-vida-morte",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "BRL",
    "price": "0",
    "availability": "https://schema.org/InStock"
  }
});

const CheckItem = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-3">
    <CheckCircle 
      className="w-5 h-5 text-primary flex-shrink-0 mt-1" 
      aria-hidden="true"
    />
    <Typography variant="body" color="muted">{children}</Typography>
  </div>
);

export default function SeguroVidaMortePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />

      <PageHero
        tag="Cobertura Essencial"
        title="Seguro de Vida (Morte)"
        subtitle="A proteção fundamental que garante o futuro e a tranquilidade financeira da sua família, permitindo que mantenham o padrão de vida."
        ctaNode={
          <Button asChild variant="secondary" size="hero">
            <Link 
              href="/simulador"
              aria-label="Iniciar simulação de Seguro de Vida (Morte)"
            >
              Simulação Rápida e Gratuita
            </Link>
          </Button>
        }
      />

      {/* AJUSTE 2: Removido role="main" pois já existe no layout.tsx */}
      <Section variant="default">
        <Container>
          <SectionHeader
            title="Por que esta cobertura é vital?"
            subtitle="Esta é a base de todo seguro de vida. Ela garante que, na sua ausência, seus beneficiários recebam o capital contratado para se reestruturarem financeiramente."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* FeatureCard já corrigimos internamente para as="h3" no passo anterior */}
            <FeatureCard icon={DollarSign} title="Tranquilidade Financeira">
              Garante os recursos para despesas imediatas, inventário, educação dos filhos e quitação de dívidas.
            </FeatureCard>
            <FeatureCard icon={HeartHandshake} title="Amparo Imediato">
              O pagamento da indenização é rápido e não entra em inventário, dando liquidez imediata para sua família.
            </FeatureCard>
            <FeatureCard icon={ShieldCheck} title="Proteção do Padrão de Vida">
              Permite que sua família mantenha a estabilidade e o padrão de vida, mesmo após a perda da sua renda.
            </FeatureCard>
          </div>
        </Container>
      </Section>

      <Section variant="accent">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="max-w-xl">
              <SectionHeader
                title="O que o nosso Seguro de Vida cobre?"
                subtitle="Viva sem se preocupar. Proteja o futuro de quem você ama com o Seguro de Vida Golden Bear, garantido pela solidez da MAG Seguros."
                className="mb-8"
              />
              <Button asChild size="lg">
                <Link 
                  href="/simulador"
                  aria-label="Simular Seguro de Vida agora"
                >
                  Simule agora
                </Link>
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-card border border-border rounded-lg shadow-sm">
                {/* AJUSTE 3: as="h3" para semântica correta */}
                <Typography variant="h4" as="h3" className="mb-4">O seguro de vida cobre:</Typography>
                <div className="space-y-3">
                  <CheckItem>Morte decorrente de causa natural ou doenças (incluindo COVID-19).</CheckItem>
                  <CheckItem>Morte decorrente de acidente pessoal.</CheckItem>
                  <CheckItem>Suicídio (após o período de carência).</CheckItem>
                </div>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-lg shadow-sm">
                {/* AJUSTE 3 */}
                <Typography variant="h4" as="h3" className="mb-4">Carência</Typography>
                <div className="space-y-3">
                  <CheckItem>120 dias para morte natural e por doenças.</CheckItem>
                  <CheckItem>2 anos para suicídio.</CheckItem>
                  <CheckItem>Sem carência para morte acidental.</CheckItem>
                </div>
              </div>

              <div className="p-6 bg-card border border-border rounded-lg shadow-sm">
                {/* AJUSTE 3 */}
                <Typography variant="h4" as="h3" className="mb-4">Valor da cobertura</Typography>
                <CheckItem>Até R$ 1 Milhão na contratação 100% digital.</CheckItem>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Seção "Benefits" reutilizada - Manter estrutura */}
      <Section variant="default">
        <Container>
          <SectionHeader
            title="Se preparar para o futuro ficou mais fácil"
            subtitle="Conheça os benefícios do nosso processo de contratação."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard icon={Zap} title="Aprovação em até 1 dia útil">
              Apólices aprovadas rapidamente, sem exames médicos na maioria dos casos e nada de papelada. Com o uso da tecnologia, entregamos agilidade!
            </FeatureCard>
            <FeatureCard icon={Briefcase} title="Sem restrição por profissão">
              O seguro de vida não possui restrição para nenhuma profissão, incluindo atividades de risco, como a carreira militar.
            </FeatureCard>
            <FeatureCard icon={Wallet} title="Coberturas que cabem no bolso">
              Oferecemos seguros acessíveis, sem letras miúdas e burocracias, com ótimo atendimento e coberturas que vão até R$ 1 Milhão.
            </FeatureCard>
          </div>
        </Container>
      </Section>

      <ComparisonSection />

      <RelatedCarouselSection type="products" />
      <PartnerSection />
      <FaqSection />
      <DigitalCtaSection />
    </>
  );
}