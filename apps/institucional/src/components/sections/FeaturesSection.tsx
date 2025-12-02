import React from "react";
import Link from 'next/link';
import { Button } from '@goldenbear/ui/components/button';
import { cn } from '@goldenbear/ui/lib/utils';
import { Section } from '@goldenbear/ui/components/section';
import { Container } from '@goldenbear/ui/components/container';
import { Typography } from '@goldenbear/ui/components/typography';
import { FadeInOnScroll } from '@/components/layout/FadeInOnScroll';
// 1. Importação do Grid
import { Grid } from '@goldenbear/ui/components/grid';

const features = [
  {
    id: 1,
    title: "Especialistas em Militares",
    description: (
      <>
        Entendemos as <span className="font-semibold text-foreground">necessidades específicas</span> das 
        Forças Armadas e oferecemos soluções personalizadas.
      </>
    ),
  },
  {
    id: 2,
    title: "Processo Simplificado",
    description: (
      <>
        Contratação rápida e descomplicada, sem burocracia.{" "}
        <span className="font-semibold text-foreground">Tudo pensado para facilitar sua vida.</span>
      </>
    ),
  },
  {
    id: 3,
    title: "Aprovação Rápida",
    description: (
      <>
        <span className="font-semibold text-foreground">Análise e aprovação em até 48 horas.</span> 
        Proteção para sua família sem espera.
      </>
    ),
  },
  {
    id: 4,
    title: "Atendimento Personalizado",
    description: (
      <>
        Cada militar tem necessidades únicas. Nosso time está pronto para criar a{" "}
        <span className="font-semibold text-foreground">melhor solução para você.</span>
      </>
    ),
  },
  {
    id: 5,
    title: "Parceiros da Mag Seguros",
    description: (
      <>
        Representantes{" "}
        <span className="font-semibold text-foreground">credenciados de uma das maiores seguradoras do Brasil</span>
        , garantindo segurança e confiabilidade.
      </>
    ),
  },
];

export const FeaturesSection = () => {
  return (
    <Section variant="default" padding="default" className="overflow-visible">
      <Container className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">
        
        {/* Coluna da Esquerda (Sticky) - Mantida com flex pois é layout estrutural */}
        <div className="inline-flex flex-col items-start gap-8 lg:gap-12 relative lg:w-[474px] lg:flex-shrink-0 lg:sticky lg:top-32 lg:self-start">
          <FadeInOnScroll>
            <header className="inline-flex flex-col items-start gap-4 relative self-stretch w-full">
              <Typography variant="h2" color="primary">
                Por que escolher a gente?
              </Typography>
              <Typography variant="body" className="w-full text-lg">
                Somos especialistas certificados pela Mag Seguros com foco total em
                atender as necessidades específicas dos militares e suas famílias.
              </Typography>
            </header>
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.2} className="w-full">
            <Button asChild variant="default" size="hero">
              <Link href="/simulador">
                Simulação Gratuita e Rápida
              </Link>
            </Button>
          </FadeInOnScroll>
        </div>

        {/* Coluna da Direita (Lista de Features) - Refatorada com Grid */}
        <div className="relative flex-1 w-full">
          {/* 2. Uso do Grid cols={1} para lista vertical 
             Garante gap consistente (default = 24px/32px) 
          */}
          <Grid cols={1} gap="default">
            {features.map((feature, index) => (
              <FadeInOnScroll key={feature.id} delay={index * 0.1} className="w-full">
                <article
                  className={cn(
                    "group flex flex-col lg:flex-row items-stretch w-full rounded-xl overflow-hidden",
                    "border border-border bg-card",
                    "transition-all duration-300 ease-out",
                    "hover:border-primary/50 hover:shadow-lg hover:-translate-y-1"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-start lg:justify-center",
                      "px-6 pt-6 pb-2 lg:p-8",
                      "bg-transparent lg:bg-primary",
                      "lg:w-52 lg:flex-shrink-0"
                    )}
                  >
                    <Typography 
                      variant="h4" 
                      className={cn(
                        "text-left font-bold leading-tight",
                        "text-primary lg:text-white"
                      )}
                    >
                      {feature.title}
                    </Typography>
                  </div>

                  <div className="flex-1 px-6 pb-6 pt-2 lg:p-8 flex items-center">
                    <Typography variant="body" color="muted" className="leading-relaxed">
                      {feature.description}
                    </Typography>
                  </div>
                </article>
              </FadeInOnScroll>
            ))}
          </Grid>
        </div>
      </Container>
    </Section>
  );
};