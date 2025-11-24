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
  ShieldAlert,     // <-- Novo Ícone
  TrendingUp,      // <-- Novo Ícone
  ClipboardCheck,  // <-- Novo Ícone
  CheckCircle,
  XCircle,
  Zap,
  Briefcase,
  Wallet
} from "lucide-react";

// Componentes reutilizados
import { PartnerSection } from "@/components/sections/PartnerSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { DigitalCtaSection } from "@/components/sections/DigitalCtaSection";
import { PageHero } from "@/components/layout/PageHero";
import { RelatedCarouselSection } from "@/components/sections/RelatedCarouselSection"; // <-- NOVO IMPORT
import { ComparisonSection } from '@/components/sections/ComparisonSection';

// 1. Metadata ATUALIZADA
export const metadata: Metadata = {
  title: "Seguro Invalidez por Acidente | Golden Bear Seguros",
  description: "Garanta seu recomeço. Receba o capital em vida para se reestruturar financeiramente após um acidente. Proteção para militares em serviço ou fora dele.",
  openGraph: {
    title: "Seguro Invalidez por Acidente | Golden Bear Seguros",
    description: "Garanta seu recomeço com uma indenização paga em vida."
  }
};

// 2. Componentes locais MANTIDOS
const CheckItem = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-3">
    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
    <Typography variant="body" color="muted">{children}</Typography>
  </div>
);

const ComparisonItem = ({ isGoldenBear, children }: { isGoldenBear: boolean; children: React.ReactNode }) => (
  <div className="flex items-start gap-3">
    {isGoldenBear ? (
      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
    ) : (
      <XCircle className="w-5 h-5 text-muted flex-shrink-0 mt-1" />
    )}
    <Typography variant="body" color={isGoldenBear ? "default" : "muted"}>
      {children}
    </Typography>
  </div>
);


export default function InvalidezAcidentePage() {
  const CtaButton = (
    <Button asChild variant="secondary" size="hero">
      <Link href="/simulador">Simulação Rápida e Gratuita</Link>
    </Button>
  );

  return (
    <>
      {/* --- 3. Conteúdo do Hero ATUALIZADO --- */}
      <PageHero
        tag="Proteção e Recomeço"
        title="Seguro Invalidez por Acidente"
        subtitle="Receba o capital em vida para se reestruturar financeiramente após um acidente, garantindo sua independência e adaptação."
        ctaNode={CtaButton}
      />

      {/* --- 4. Seção de Benefícios Chave ATUALIZADA --- */}
      <Section variant="default">
        <Container>
          <SectionHeader
            title="Por que esta cobertura é crucial?"
            subtitle="Um acidente pode mudar sua vida e sua capacidade de gerar renda. Esta proteção garante os recursos para um recomeço digno."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard icon={ShieldAlert} title="Proteção Militar">
              Cobertura essencial para a carreira militar, válida para acidentes ocorridos em serviço, em missão ou fora dele.
            </FeatureCard>
            <FeatureCard icon={TrendingUp} title="Independência Financeira">
              Recurso para adaptar sua residência, cobrir tratamentos de reabilitação ou investir em novas capacidades profissionais.
            </FeatureCard>
            <FeatureCard icon={ClipboardCheck} title="Indenização em Vida">
              Receba 100% do capital contratado em caso de invalidez total e permanente por acidente (IPTA) ou parcial (IPPA) conforme tabela.
            </FeatureCard>
          </div>
        </Container>
      </Section>

      {/* --- 5. Seção "O que cobre" ATUALIZADA --- */}
      <Section variant="accent">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Coluna Esquerda: Título e CTA */}
            <div className="max-w-xl">
              <SectionHeader
                title="Como funciona a cobertura?"
                subtitle="Focada em acidentes pessoais que resultem em perda ou incapacidade funcional de membros ou órgãos, de forma permanente."
                className="mb-8"
              />
              <Button asChild size="lg">
                <Link href="/simulador">Simule agora</Link>
              </Button>
            </div>
            
            {/* Coluna Direita: Listas */}
            <div className="space-y-6">
              <div className="p-6 bg-card border border-border rounded-lg shadow-sm">
                <Typography variant="h4" className="mb-4">O seguro de invalidez cobre:</Typography>
                <div className="space-y-3">
                  <CheckItem>Invalidez Permanente Total por Acidente (IPTA).</CheckItem>
                  <CheckItem>Invalidez Permanente Parcial por Acidente (IPPA), com indenização proporcional.</CheckItem>
                  <CheckItem>Cobre acidentes ocorridos 24h por dia, em serviço ou lazer.</CheckItem>
                </div>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-lg shadow-sm">
                <Typography variant="h4" className="mb-4">Carência</Typography>
                <div className="space-y-3">
                  <CheckItem>Sem carência para acidentes. A proteção é válida imediatamente após a vigência da apólice.</CheckItem>
                </div>
              </div>

              <div className="p-6 bg-card border border-border rounded-lg shadow-sm">
                <Typography variant="h4" className="mb-4">Valor da cobertura</Typography>
                <CheckItem>Até R$ 1 Milhão na contratação 100% digital.</CheckItem>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* --- 6. Seções Estruturais MANTIDAS --- */}
      {/* O processo de contratação e os diferenciais são os mesmos */}

      {/* Seção Benefícios do Processo (MANTIDA) */}
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

      {/* Seção Diferenciais (MANTIDA) */}
      {/* Nova Seção Aqui */}
      <ComparisonSection />

      {/* 💥 SEÇÃO DE PRODUTOS RELACIONADOS 💥 */}
      <RelatedCarouselSection type="products" />


      {/* Seção de Prova Social (Reutilizada) */}
      <PartnerSection />

      {/* Seção de Perguntas Frequentes (Reutilizada) */}
      <FaqSection />

      {/* Seção de CTA Final (Reutilizada) */}
      <DigitalCtaSection />
    </>
  );
}