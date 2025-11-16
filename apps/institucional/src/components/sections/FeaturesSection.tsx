import React from "react";
import Link from 'next/link';
import { Button } from '@goldenbear/ui/components/button';
import { cn } from '@goldenbear/ui/lib/utils';
import { Section } from '@goldenbear/ui/components/section';
import { Container } from '@goldenbear/ui/components/container';
import { Typography } from '@goldenbear/ui/components/typography';

const features = [
  {
    id: 1,
    title: "Especialistas em Militares",
    // CORREÇÃO: Substituído <p> por <> (Fragmento)
    description: (
      <>
        Entendemos as <span className="font-semibold">necessidades específicas</span> das 
        Forças Armadas e oferecemos soluções personalizadas.
      </>
    ),
    backgroundColor: "bg-card",
    titleBreak: false,
  },
  {
    id: 2,
    title: "Processo Simplificado",
    // CORREÇÃO: Substituído <p> por <>
    description: (
      <>
        Contratação rápida e descomplicada, sem burocracia.{" "}
        <span className="font-semibold">Tudo pensado para facilitar sua vida.</span>
      </>
    ),
    backgroundColor: "bg-card",
    titleBreak: false,
  },
  {
    id: 3,
    title: "Aprovação Rápida",
    // CORREÇÃO: Substituído <p> por <>
    description: (
      <>
        <span className="font-semibold">Análise e aprovação em até 48 horas.</span> 
        Proteção para sua família sem espera.
      </>
    ),
    backgroundColor: "bg-card",
    titleBreak: true,
  },
  {
    id: 4,
    title: "Atendimento Personalizado",
    // CORREÇÃO: Substituído <p> por <>
    description: (
      <>
        Cada militar tem necessidades únicas. Nosso time está pronto para criar a{" "}
        <span className="font-semibold">melhor solução para você.</span>
      </>
    ),
    backgroundColor: "bg-card",
    titleBreak: false,
  },
  {
    id: 5,
    title: "Parceiros da Mag Seguros",
    // CORREÇÃO: Substituído <p> por <>
    description: (
      <>
        Representantes{" "}
        <span className="font-semibold">credenciados de uma das maiores seguradoras do Brasil</span>
        , garantindo segurança e confiabilidade.
      </>
    ),
    backgroundColor: "bg-card",
    titleBreak: false,
  },
];

export const FeaturesSection = () => {
  return (
    <Section variant="default" padding="default" className="overflow-visible">
      <Container className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">
        
        {/* Coluna da Esquerda */}
        <div className="inline-flex flex-col items-start gap-12 relative lg:w-[474px] lg:flex-shrink-0 lg:sticky lg:top-32 lg:self-start">
          <header className="inline-flex flex-col items-start gap-2 relative self-stretch w-full">
            <Typography variant="h2" color="primary" className="mt-[-1.00px]">
              Por que escolher a gente?
            </Typography>
            <Typography variant="body" className="w-full">
              Somos especialistas certificados pela Mag Seguros com foco total em
              atender as necessidades específicas dos militares e suas famílias.
            </Typography>
          </header>

          <Button asChild variant="default" size="hero" className="w-full sm:w-auto">
            <Link href="/simulador">
              Simulação Gratuita e Rápida
            </Link>
          </Button>
        </div>

        {/* Coluna da Direita */}
        <div className="flex flex-col items-start justify-center gap-10 relative flex-1 w-full">
          {features.map((feature) => (
            <article
              key={feature.id}
              className={cn(
                "flex flex-col lg:flex-row items-stretch gap-0 relative self-stretch w-full rounded-lg overflow-hidden border border-border",
                feature.backgroundColor
              )}
            >
              <div
                className={cn(
                  "inline-flex items-center justify-center gap-2.5 px-6 py-10 relative bg-foreground lg:bg-primary text-primary-foreground",
                  feature.titleBreak ? "h-[118px]" : ""
                )}
              >
                <Typography variant="h4" color="white" className="w-full lg:w-52 text-left tracking-[0.60px] leading-[24.0px]">
                  {feature.titleBreak ? (
                    <>Aprovação Rápida</>
                  ) : (
                    feature.title
                  )}
                </Typography>
              </div>

              <div className="flex-1 p-6 flex items-center">
                {/* O Typography já cria o <p>, então o conteúdo deve ser apenas texto/span */}
                <Typography variant="body" className="tracking-[0.48px]">
                  {feature.description}
                </Typography>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
};