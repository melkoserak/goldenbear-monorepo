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
  HeartHandshake, 
  ShieldCheck,
  CheckCircle,
  XCircle,
  Zap,
  Briefcase,
  Wallet,
  Activity // <-- Novo Ícone
} from "lucide-react";

// Componentes reutilizados
import { PartnerSection } from "@/components/sections/PartnerSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { DigitalCtaSection } from "@/components/sections/DigitalCtaSection";
import { PageHero } from "@/components/layout/PageHero";

// 1. Metadata ATUALIZADA
export const metadata: Metadata = {
  title: "Seguro Doenças Graves | Golden Bear Seguros",
  description: "Receba o capital em vida para focar na sua recuperação. Cobertura para Câncer, AVC, Infarto e mais. Contratação 100% digital e sem burocracia.",
  openGraph: {
    title: "Seguro Doenças Graves | Golden Bear Seguros",
    description: "Receba o capital em vida para focar na sua recuperação."
  }
};

// 2. Componentes locais MANTIDOS (para consistência estrutural)
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


export default function DoencasGravesPage() {
  const CtaButton = (
    <Button asChild variant="secondary" size="hero">
      <Link href="/simulador">Simulação Rápida e Gratuita</Link>
    </Button>
  );

  return (
    <>
      {/* --- 3. Conteúdo do Hero ATUALIZADO --- */}
      <PageHero
        tag="Proteção em Vida"
        title="Seguro para Doenças Graves"
        subtitle="Receba o capital em vida para focar no que realmente importa: a sua recuperação. Sem burocracia e com a solidez da MAG Seguros."
        ctaNode={CtaButton}
      />

      {/* --- 4. Seção de Benefícios Chave ATUALIZADA --- */}
      <Section variant="default">
        <Container>
          <SectionHeader
            title="Por que esta cobertura é essencial?"
            subtitle="Um diagnóstico de doença grave pode impactar não só a sua saúde, mas toda a sua estrutura financeira. Esta cobertura oferece suporte imediato."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard icon={Wallet} title="Foco na Recuperação">
              Use o dinheiro como quiser: para cobrir custos de tratamento, pagar despesas, adaptar a sua casa ou até mesmo realizar um sonho.
            </FeatureCard>
            <FeatureCard icon={HeartHandshake} title="Proteção da Renda">
              Garante sua estabilidade financeira e da sua família caso você precise se afastar do trabalho para o tratamento.
            </FeatureCard>
            <FeatureCard icon={Activity} title="Recebimento em Vida">
              Diferente do seguro de vida tradicional, esta é uma indenização que você recebe em vida, logo após o diagnóstico.
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
                title="Quais doenças estão cobertas?"
                subtitle="Nossa cobertura abrange as principais doenças e procedimentos, oferecendo um suporte robusto para os momentos mais difíceis."
                className="mb-8"
              />
              <Button asChild size="lg">
                <Link href="/simulador">Simule agora</Link>
              </Button>
            </div>
            
            {/* Coluna Direita: Listas */}
            <div className="space-y-6">
              <div className="p-6 bg-card border border-border rounded-lg shadow-sm">
                <Typography variant="h4" className="mb-4">Principais Coberturas</Typography>
                <div className="space-y-3">
                  <CheckItem>Câncer (incluindo leucemias e linfomas).</CheckItem>
                  <CheckItem>AVC (Acidente Vascular Cerebral).</CheckItem>
                  <CheckItem>Infarto Agudo do Miocárdio.</CheckItem>
                  <CheckItem>Insuficiência Renal Crônica (com diálise).</CheckItem>
                  <CheckItem>Transplante de Órgãos Vitais (Coração, Fígado, Pâncreas, Rim, Pulmão).</CheckItem>
                </div>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-lg shadow-sm">
                <Typography variant="h4" className="mb-4">Carência</Typography>
                <div className="space-y-3">
                  <CheckItem>Apenas 90 dias de carência após a contratação para o diagnóstico.</CheckItem>
                  <CheckItem>Consulte as condições gerais para detalhes completos.</CheckItem>
                </div>
              </div>

              <div className="p-6 bg-card border border-border rounded-lg shadow-sm">
                <Typography variant="h4" className="mb-4">Valor da cobertura</Typography>
                <CheckItem>Até R$ 500.000 na contratação 100% digital.</CheckItem>
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
      <Section variant="accent">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Coluna Esquerda: Título e CTA */}
            <div className="max-w-xl">
              <SectionHeader
                title="Um Seguro de Vida Individual e Moderno"
                subtitle="Conheça os diferenciais do nosso seguro de vida em relação aos produtos tradicionais."
                className="mb-8"
              />
              <Button asChild size="lg">
                <Link href="/simulador">Simule agora</Link>
              </Button>
            </div>
            
            {/* Coluna Direita: Comparativo */}
            <div className="space-y-8 p-8 bg-card border border-border rounded-lg shadow-sm">
              <div>
                <Typography variant="h4" className="mb-4">Seguros Tradicionais</Typography>
                <div className="space-y-3">
                  <ComparisonItem isGoldenBear={false}>Contratação lenta e burocrática, com exames.</ComparisonItem>
                  <ComparisonItem isGoldenBear={false}>Preço baseado na idade, com reajustes anuais.</ComparisonItem>
                  <ComparisonItem isGoldenBear={false}>Muitas vezes embutido em outros produtos (venda casada).</ComparisonItem>
                </div>
              </div>
              
              <div>
                <Typography variant="h4" color="primary" className="mb-4">Golden Bear (com MAG Seguros)</Typography>
                <div className="space-y-3">
                  <ComparisonItem isGoldenBear={true}>Contratação 100% digital e simplificada.</ComparisonItem>
                  <ComparisonItem isGoldenBear={true}>Cobertura de até R$ 1 Milhão online.</ComparisonItem>
                  <ComparisonItem isGoldenBear={true}>Preço justo e reenquadramento por faixa etária (a cada 5 anos).</ComparisonItem>
                  <ComparisonItem isGoldenBear={true}>Você contrata apenas o que precisa, de forma separada.</ComparisonItem>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Seção de Prova Social (Reutilizada) */}
      <PartnerSection />

      {/* Seção de Perguntas Frequentes (Reutilizada) */}
      <FaqSection />

      {/* Seção de CTA Final (Reutilizada) */}
      <DigitalCtaSection />
    </>
  );
}