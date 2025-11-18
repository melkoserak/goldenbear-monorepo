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
  DollarSign, 
  HeartHandshake, 
  ShieldCheck,
  CheckCircle, // <-- Ícone para listas
  XCircle,      // <-- Ícone para listas
  Zap,          // <-- Ícone para "Aprovação Rápida"
  Briefcase,    // <-- Ícone para "Sem restrição"
  Wallet        // <-- Ícone para "Cabe no bolso"
} from "lucide-react";

// Componentes reutilizados
import { PartnerSection } from "@/components/sections/PartnerSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { DigitalCtaSection } from "@/components/sections/DigitalCtaSection";
import { PageHero } from "@/components/layout/PageHero";

// Metadata (sem alterações)
export const metadata: Metadata = {
  title: "Seguro de Vida por Morte | Golden Bear Seguros",
  description: "Proteja o futuro da sua família. O Seguro de Vida (Morte) garante a tranquilidade financeira para quem você ama. Especialistas em militares. Simule agora.",
  openGraph: {
    title: "Seguro de Vida por Morte | Golden Bear Seguros",
    description: "Garanta a tranquilidade financeira da sua família com a cobertura essencial."
  }
};

// Componente local para listas com ícones
const CheckItem = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-3">
    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
    <Typography variant="body" color="muted">{children}</Typography>
  </div>
);

// Componente local para o comparativo
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


export default function SeguroVidaMortePage() {
  const CtaButton = (
    <Button asChild variant="secondary" size="hero">
      <Link href="/simulador">Simulação Rápida e Gratuita</Link>
    </Button>
  );

  return (
    <>
      <PageHero
        tag="Cobertura Essencial"
        title="Seguro de Vida (Morte)"
        subtitle="A proteção fundamental que garante o futuro e a tranquilidade financeira da sua família, permitindo que mantenham o padrão de vida."
        ctaNode={CtaButton}
      />

      {/* Seção de Benefícios Chave (Existente) */}
      <Section variant="default">
        <Container>
          <SectionHeader
            title="Por que esta cobertura é vital?"
            subtitle="Esta é a base de todo seguro de vida. Ela garante que, na sua ausência, seus beneficiários recebam o capital contratado para se reestruturarem financeiramente."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

      {/* --- NOVA SEÇÃO 1: O QUE COBRE --- */}
      <Section variant="accent">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Coluna Esquerda: Título e CTA */}
            <div className="max-w-xl">
              <SectionHeader
                title="O que o nosso Seguro de Vida cobre?"
                subtitle="Viva sem se preocupar. Proteja o futuro de quem você ama com o Seguro de Vida Golden Bear, garantido pela solidez da MAG Seguros."
                className="mb-8"
              />
              <Button asChild size="lg">
                <Link href="/simulador">Simule agora</Link>
              </Button>
            </div>
            
            {/* Coluna Direita: Listas */}
            <div className="space-y-6">
              <div className="p-6 bg-card border border-border rounded-lg shadow-sm">
                <Typography variant="h4" className="mb-4">O seguro de vida cobre:</Typography>
                <div className="space-y-3">
                  <CheckItem>Morte decorrente de causa natural ou doenças (incluindo COVID-19).</CheckItem>
                  <CheckItem>Morte decorrente de acidente pessoal.</CheckItem>
                  <CheckItem>Suicídio (após o período de carência).</CheckItem>
                </div>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-lg shadow-sm">
                <Typography variant="h4" className="mb-4">Carência</Typography>
                <div className="space-y-3">
                  <CheckItem>120 dias para morte natural e por doenças.</CheckItem>
                  <CheckItem>2 anos para suicídio.</CheckItem>
                  <CheckItem>Sem carência para morte acidental.</CheckItem>
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

      {/* --- NOVA SEÇÃO 2: BENEFÍCIOS DO PROCESSO --- */}
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