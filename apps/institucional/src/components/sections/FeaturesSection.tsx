import React from "react";
import Link from 'next/link';
import { Button } from '@goldenbear/ui/components/button';
import { cn } from '@goldenbear/ui/lib/utils';

// --- ATUALIZAÇÃO AQUI ---
// O array de features agora usa strings simples, sem <span>s.
// A estilização de "negrito" será controlada pelo Tailwind.
const features = [
    {
      id: 1,
      title: "Especialistas em Militares",
      description: (
        <p>
          Entendemos as <span className="font-semibold">necessidades específicas</span> das 
          Forças Armadas e oferecemos soluções personalizadas.
        </p>
      ),
      backgroundColor: "bg-card", // Traduzido de bg-white
      titleBreak: false,
    },
    {
      id: 2,
      title: "Processo Simplificado",
      description: (
        <p>
          Contratação rápida e descomplicada, sem burocracia.{" "}
          <span className="font-semibold">Tudo pensado para facilitar sua vida.</span>
        </p>
      ),
      backgroundColor: "bg-card", // Traduzido de bg-gray-light-background
      titleBreak: false,
    },
    {
      id: 3,
      title: "Aprovação Rápida",
      description: (
        <p>
          <span className="font-semibold">Análise e aprovação em até 48 horas.</span> Proteção para sua família sem espera.
        </p>
      ),
      backgroundColor: "bg-card", // Traduzido de bg-white
      titleBreak: true,
    },
    {
      id: 4,
      title: "Atendimento Personalizado",
      description: (
        <p>
          Cada militar tem necessidades únicas. Nosso time está pronto para criar a{" "}
          <span className="font-semibold">melhor solução para você.</span>
        </p>
      ),
      backgroundColor: "bg-card", // Traduzido de bg-white
      titleBreak: false,
    },
    {
      id: 5,
      title: "Parceiros da Mag Seguros",
      description: (
        <p>
          Representantes{" "}
          <span className="font-semibold">credenciados de uma das maiores seguradoras do Brasil</span>
          , garantindo segurança e confiabilidade.
        </p>
      ),
      backgroundColor: "bg-card", // Traduzido de bg-white
      titleBreak: false,
    },
];

export const FeaturesSection = () => {
  return (
    // Seção principal com fundo 'accent' (cinza) e padding vertical
    <section className="flex w-full justify-center bg-white py-20 lg:py-28">
      {/* Container (1280px, centralizado) com layout flexível */}
      <div className="container flex flex-col lg:flex-row items-start gap-12 lg:gap-20 px-6">
        
        {/* --- Coluna da Esquerda (Sticky) --- */}
        <div className="inline-flex flex-col items-start gap-12 relative lg:w-[474px] lg:flex-shrink-0 lg:sticky lg:top-32 lg:self-start">
          
          <header className="inline-flex flex-col items-start gap-2 relative self-stretch w-full">
            {/* Título (com classes do Design System) */}
            <h2 className="relative w-fit mt-[-1.00px] font-bold text-primary text-3xl md:text-3xl tracking-tight leading-tight">
              Por que escolher a gente?
            </h2>
            {/* Descrição (com classes do Design System) */}
            <p className="relative w-full text-base text-foreground leading-relaxed">
              Somos especialistas certificados pela Mag Seguros com foco total em
              atender as necessidades específicas dos militares e suas famílias.
            </p>
          </header>

          {/* Botão (com componente e variantes do Design System) */}
          <Button
            asChild
            variant="default" // Cor azul (primary)
            size="hero"      // Padding px-6 py-5
            className="w-full sm:w-auto" // Responsivo
          >
            <Link href="/simulador">
              <span className="relative w-fit font-semibold text-base tracking-[0.48px] leading-[19.2px] whitespace-nowrap">
                Simulação Gratuita e Rápida
              </span>
            </Link>
          </Button>
        </div>

        {/* --- Coluna da Direita (Scroll) --- */}
        <div className="flex flex-col items-start justify-center gap-10 relative flex-1 w-full">
          {features.map((feature) => (
            <article
              key={feature.id}
              className={cn(
                "flex  items-stretch gap-0 relative self-stretch w-full rounded-lg overflow-hidden border",
                "border-border", // Cor da borda do Design System
                feature.backgroundColor // bg-card ou bg-accent
              )}
            >
              {/* Bloco de Título (Azul) */}
              <div
                className={cn(
                  "inline-flex items-center justify-center gap-2.5 px-6 py-10 relative",
                  "bg-primary text-primary-foreground", // Cores do Design System
                  feature.titleBreak ? "h-[118px]" : "" // Altura condicional
                )}
              >
                <h3 className="relative w-52 font-medium text-xl tracking-[0.60px] leading-[24.0px]">
                  {feature.titleBreak ? (
                    <>Aprovação <br /> Rápida</>
                  ) : (
                    feature.title
                  )}
                </h3>
              </div>

              {/* Bloco de Descrição (Branco ou Cinza) */}
              <div className="flex-1 p-6 flex items-center">
                
                {/* --- A CORREÇÃO ESTÁ AQUI --- */}
                {/* Trocamos o <p> por <div> para evitar o erro de <p> dentro de <p> */}
                <div className="relative font-normal text-foreground text-base tracking-[0.48px] leading-[22.4px]">
                  {feature.description}
                </div>

              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};