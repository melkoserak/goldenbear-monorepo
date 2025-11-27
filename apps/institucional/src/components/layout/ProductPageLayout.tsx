"use client";

import React from "react";
import Link from "next/link";
import { 
  Section, 
  Container, 
  Typography, 
  Button,
  FeatureCard,
  SectionHeader 
} from "@goldenbear/ui";
import { CheckCircle, Zap, Briefcase, Wallet } from "lucide-react";

import { PartnerSection } from "@/components/sections/PartnerSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { DigitalCtaSection } from "@/components/sections/DigitalCtaSection";
import { PageHero } from "@/components/layout/PageHero";
import { RelatedCarouselSection } from "@/components/sections/RelatedCarouselSection";
import { ComparisonSection } from '@/components/sections/ComparisonSection';

type Feature = {
  icon: React.ElementType;
  title: string;
  description: string;
};

type CoverageList = {
  title: string;
  items: string[];
};

type ProductPageLayoutProps = {
  hero: {
    tag: string;
    title: string;
    subtitle: string;
  };
  keyBenefits: {
    title: string;
    subtitle: string;
    features: Feature[];
  };
  coverage: {
    title: string;
    subtitle: string;
    lists: CoverageList[];
  };
};

const CheckItem = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-3">
    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
    <Typography variant="body" color="muted">{children}</Typography>
  </div>
);

export function ProductPageLayout({ hero, keyBenefits, coverage }: ProductPageLayoutProps) {
  const CtaButton = (
    <Button asChild variant="secondary" size="hero">
      <Link href="/simulador">Simulação Rápida e Gratuita</Link>
    </Button>
  );

  return (
    <>
      {/* --- Hero Section --- */}
      <PageHero
        tag={hero.tag}
        title={hero.title}
        subtitle={hero.subtitle}
        ctaNode={CtaButton}
      />

      {/* --- Key Benefits Section --- */}
      <Section variant="default">
        <Container>
          <SectionHeader
            title={keyBenefits.title}
            subtitle={keyBenefits.subtitle}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {keyBenefits.features.map((feature) => (
              <FeatureCard key={feature.title} icon={feature.icon} title={feature.title}>
                {feature.description}
              </FeatureCard>
            ))}
          </div>
        </Container>
      </Section>

      {/* --- Coverage Section --- */}
      <Section variant="accent">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="max-w-xl">
              <SectionHeader
                title={coverage.title}
                subtitle={coverage.subtitle}
                className="mb-8"
              />
              <Button asChild size="lg">
                <Link href="/simulador">Simule agora</Link>
              </Button>
            </div>
            
            <div className="space-y-6">
              {coverage.lists.map((list) => (
                <div key={list.title} className="p-6 bg-card border border-border rounded-lg shadow-sm">
                  <Typography variant="h4" className="mb-4">{list.title}</Typography>
                  <div className="space-y-3">
                    {list.items.map((item, index) => (
                      <CheckItem key={index}>{item}</CheckItem>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* --- Shared Sections --- */}
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