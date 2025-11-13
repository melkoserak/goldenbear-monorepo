import React from "react";
import Link from 'next/link';
import { Button } from '@goldenbear/ui/components/button';
import { cn } from '@goldenbear/ui/lib/utils';

// Array de "steps" do seu novo código
const steps = [
    {
      number: "1",
        title: "Simule",
        description: (
            <p>
          Use nosso simulador online para{" "}
          <span className="font-semibold">
          encontrar o plano ideal</span>{" "} para suas necessidades.
 </p>
 ),
 },
    {
      number: "2",
      title: "Personalize",
      description: (
        <p>
          <span className="font-semibold">
            Ajuste as coberturas e valores</span>{" "}para que o seguro se encaixe perfeitamente em seu orçamento.
        </p>
      ),
    },
    {
      number: "3",
      title: "Contrate",
      description: (
        <p>
       Finalize a contratação de forma 100% digital,{" "} <span className="font-semibold"> com segurança e sem burocracia.
          </span>
        </p>
      ),
    },
];

export const HowToSection = () => {
  return (
    // Seção principal com fundo azul (primary)
    <section className="flex flex-col items-center gap-20 pt-20 pb-[124px] px-6 relative bg-primary text-primary-foreground">
      {/* Container de 1280px */}
      <div className="flex flex-col container items-center gap-20 relative w-full">
        
        {/* Cabeçalho */}
        <header className="flex flex-col md:flex-row items-center gap-6 relative self-stretch w-full">
          <div className="flex flex-col flex-1 items-start gap-6 relative">
            {/* Título (com classes do Design System) */}
            <h1 className="relative w-fit mt-[-1.00px] font-bold text-3xl md:text-3xl tracking-tight leading-tight whitespace-nowrap">
              Simples, rápido e digital
            </h1>
            {/* Subtítulo (com classes do Design System) */}
            <p className="relative self-stretch text-xm md:text-2xl leading-snug">
              Contratar seu seguro de vida nunca
              foi tão fácil.
            </p>
          </div>
          
          {/* Texto auxiliar (com classes do Design System) */}
          <p className="relative w-full md:w-[318px] text-base text-primary-foreground/80">
            Siga os passos e garanta sua proteção
          </p>
        </header>

        {/* Grid de 3 Colunas (Cards) */}
        <div className="flex flex-col md:flex-row items-start gap-10 relative self-stretch w-full">
          {steps.map((step, index) => (
            <article
              key={step.number}
              className={cn(
                "flex flex-col items-start gap-6 p-6 relative flex-1 w-full",
                "bg-card rounded-lg border-2 border-dashed border-secondary" // Cores do Design System
              )}
            >
              <div className="inline-flex flex-col items-start gap-4 relative">
                {/* Círculo do número (com cores do Design System) */}
                <div
                  className="inline-flex items-center justify-center w-12 h-12 p-4 relative rounded-full bg-primary"
                  aria-label={`Passo ${step.number}`}
                >
                  <div className="relative font-bold text-primary-foreground text-2xl">
                    {step.number}
                  </div>
                </div>
                
                {/* Título do Card (com cores do Design System) */}
                <h2 className="relative w-fit font-bold text-primary text-2xl whitespace-nowrap">
                  {step.title}
                </h2>
              </div>
              
              {/* Descrição do Card (com cores do Design System) */}
              <div className="relative self-stretch font-normal text-foreground text-base leading-[22.4px]">
                {step.description}
              </div>
            </article>
          ))}
        </div>

        {/* Botão Final (usando Design System) */}
        <Button
          asChild
          variant="secondary" // Amarelo
          size="hero" // Padding customizado
        >
          <Link href="/simulador">
            <span className="relative w-fit mt-[-1.00px] font-semibold text-base tracking-[0.48px] leading-[19.2px] whitespace-nowrap">
              Simulação Gratuita e Rápida
            </span>
          </Link>
        </Button>
      </div>
    </section>
  );
};