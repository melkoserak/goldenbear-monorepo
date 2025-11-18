import React from "react";
import Link from 'next/link';
import { Button } from '@goldenbear/ui/components/button';
import { cn } from '@goldenbear/ui/lib/utils';
import { Section } from '@goldenbear/ui/components/section';
import { Container } from '@goldenbear/ui/components/container';
import { Typography } from '@goldenbear/ui/components/typography';
import { FadeInOnScroll } from '@/components/layout/FadeInOnScroll'; // 2. Importe o componente

const steps = [
    {
      number: "1",
      title: "Simule",
      description: (
        <>
          Use nosso simulador online para{" "}
          <span className="font-semibold">encontrar o plano ideal</span>{" "}
          para suas necessidades.
        </>
      ),
    },
    {
      number: "2",
      title: "Personalize",
      description: (
        <>
          <span className="font-semibold">Ajuste as coberturas e valores</span>{" "}
          para que o seguro se encaixe perfeitamente em seu orçamento.
        </>
      ),
    },
    {
      number: "3",
      title: "Contrate",
      description: (
        <>
          Finalize a contratação de forma 100% digital,{" "}
          <span className="font-semibold">com segurança e sem burocracia.</span>
        </>
      ),
    },
];

export const HowToSection = () => {
  return (
    <Section variant="primary">
      <Container className="flex flex-col items-center gap-10 lg:gap-20">
        
        <header className="flex flex-col md:flex-row items-center gap-6 relative self-stretch w-full text-primary-foreground">
          <div className="flex flex-col flex-1 items-start gap-6 w-full relative">
            <Typography variant="h2" color="white" className="mt-[-1.00px]">
              Simples, rápido e digital
            </Typography>
            <Typography variant="h3" as="p" color="white" className="font-normal leading-snug">
              Contratar seu seguro de vida nunca foi tão fácil.
            </Typography>
          </div>
          
          <Typography variant="body" color="white" className="w-full md:w-[318px] opacity-80">
            Siga os passos e garanta sua proteção
          </Typography>
        </header>

        <div className="flex flex-col md:flex-row items-start gap-10 relative self-stretch w-full">
          {steps.map((step, index) => ( // 3. Adicione 'index'
            <FadeInOnScroll 
              key={step.number}
              delay={index * 150} // 4. Aplique o atraso sequencial
              threshold={0.3}     // Garante que o card esteja um pouco visível
              className="flex-1 w-full"
            >
              <article
                className={cn(
                  "flex flex-col items-start gap-6 p-6 relative w-full h-full", // Adicionado h-full
                  "bg-card text-card-foreground", 
                  "rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow"
                )}
              >

              <div className="inline-flex flex-col items-start gap-4 relative">
                <div
                  className="inline-flex items-center justify-center w-12 h-12 p-4 relative rounded-full bg-primary"
                  aria-label={`Passo ${step.number}`}
                >
                  <Typography variant="h3" color="white">
                    {step.number}
                  </Typography>
                </div>
                
                <Typography variant="h3" color="primary" className="whitespace-nowrap">
                  {step.title}
                </Typography>
              </div>
              
              <Typography variant="body">
                {step.description}
              </Typography>
            </article>
            </FadeInOnScroll>
          ))}
        </div>

        <Button asChild variant="secondary" size="hero" className="w-full sm:w-auto">
          <Link href="/simulador">
            Simulação Gratuita e Rápida
          </Link>
        </Button>
      </Container>
    </Section>
  );
};