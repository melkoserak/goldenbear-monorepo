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
  ShieldCheck,     // <-- Ícone
  Users,           // <-- Ícone
  ClipboardCheck,  // <-- Ícone
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
  title: "Assistência Funeral | Golden Bear Seguros",
  description: "Um ato de cuidado que ampara sua família no momento mais difícil, cuidando de toda a burocracia e despesas. Contrate online de forma simples.",
  openGraph: {
    title: "Assistência Funeral | Golden Bear Seguros",
    description: "Cuidado e respeito para sua família no momento mais difícil."
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


export default function AssistenciaFuneralPage() {
  const CtaButton = (
    <Button asChild variant="secondary" size="hero">
      <Link href="/simulador">Simulação Rápida e Gratuita</Link>
    </Button>
  );

  return (
    <>
      {/* --- 3. Conteúdo do Hero ATUALIZADO --- */}
      <PageHero
        tag="Amparo e Respeito"
        title="Assistência Funeral Familiar"
        subtitle="Um ato de cuidado que ampara sua família no momento mais difícil, cuidando de toda a burocracia e despesas para que possam focar apenas na despedida."
        ctaNode={CtaButton}
      />

      {/* --- 4. Seção de Benefícios Chave ATUALIZADA --- */}
      <Section variant="default">
        <Container>
          <SectionHeader
            title="Por que esta cobertura é um ato de cuidado?"
            subtitle="No momento de luto, questões financeiras e burocráticas são um fardo enorme. A assistência funeral resolve isso de forma imediata."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard icon={ShieldCheck} title="Amparo Burocrático">
              A seguradora cuida de toda a documentação, registros e autorizações necessárias, aliviando a família de processos desgastantes.
            </FeatureCard>
            <FeatureCard icon={Users} title="Cuidado com a Família">
              Garante uma despedida digna, cobrindo custos de sepultamento ou cremação, urna, ornamentação e transporte, em todo o Brasil.
            </FeatureCard>
            <FeatureCard icon={ClipboardCheck} title="Planejamento">
              Contratar em vida é uma forma de planejamento sucessório que evita despesas inesperadas e garante que suas vontades sejam respeitadas.
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
                title="O que a Assistência Funeral cobre?"
                subtitle="Uma cobertura completa para garantir que nada falte, em conformidade com o padrão de serviço contratado."
                className="mb-8"
              />
              <Button asChild size="lg">
                <Link href="/simulador">Simule agora</Link>
              </Button>
            </div>
            
            {/* Coluna Direita: Listas */}
            <div className="space-y-6">
              <div className="p-6 bg-card border border-border rounded-lg shadow-sm">
                <Typography variant="h4" className="mb-4">Serviços Inclusos</Typography>
                <div className="space-y-3">
                  <CheckItem>Urna mortuária (caixão).</CheckItem>
                  <CheckItem>Preparação e higienização do corpo.</CheckItem>
                  <CheckItem>Ornamentação com flores.</CheckItem>
                  <CheckItem>Taxas de sepultamento ou cremação.</CheckItem>
                  <CheckItem>Traslado nacional do corpo (até o município de residência).</CheckItem>
                  <CheckItem>Registro de óbito e documentação.</CheckItem>
                </div>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-lg shadow-sm">
                <Typography variant="h4" className="mb-4">Cobertura Familiar</Typography>
                <div className="space-y-3">
                  <CheckItem>A cobertura pode ser estendida para cônjuge, filhos e pais, conforme o plano contratado.</CheckItem>
                </div>
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

      {/* --- NOVA SEÇÃO 3: DIFERENCIAIS (COMPARATIVO) --- */}
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