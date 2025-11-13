import React from 'react';
import Link from 'next/link';
import { Button } from '@goldenbear/ui/components/button';
import { cn } from '@goldenbear/ui/lib/utils';
import { ArrowRight, Shield, HeartPulse, ShieldAlert, ShieldCheck } from 'lucide-react'; // Ícones do Design System

// Dados dos cards de benefícios
const benefits = [
  {
    icon: Shield,
    title: "Morte",
    description: "Proteção para gastos inesperados em momentos em que a prioridade é a sua saúde. Cobertura de treze doenças, dentre elas, Câncer, AVC, e mais."
  },
  {
    icon: HeartPulse,
    title: "Doenças Graves",
    description: "Proteção para gastos inesperados em momentos em que a prioridade é a sua saúde. Cobertura de treze doenças, dentre elas, Câncer, AVC, e mais."
  },
  {
    icon: ShieldAlert,
    title: "Acidente",
    description: "Proteção para gastos inesperados em momentos em que a prioridade é a sua saúde. Cobertura de treze doenças, dentre elas, Câncer, AVC, e mais."
  },
  {
    icon: ShieldCheck,
    title: "Assistência Funeral",
    description: "Proteção para gastos inesperados em momentos em que a prioridade é a sua saúde. Cobertura de treze doenças, dentre elas, Câncer, AVC, e mais."
  }
];


export const BenefitsSection = () => {
  return (
    // Seção principal com padding
    <section className="flex flex-col items-center pt-20 pb-32 relative bg-background">
      {/* Container de 1280px */}
      <div className="container flex flex-col justify-start items-center gap-20 px-6">
        
        {/* Cabeçalho */}
        <div className="self-stretch inline-flex flex-col md:flex-row justify-start items-center gap-6">
          <div className="flex-1 inline-flex flex-col justify-start items-start gap-6">
            <h2 className="self-stretch text-primary text-3xl font-bold leading-8 tracking-wide">
              Quais são os principais <br/>tipos de seguro
            </h2>
            <p className="self-stretch text-foreground text-xl font-medium leading-7 tracking-wide">
              seus beneficários recebam algum valor<br/>em caso de
            </p>
          </div>
          <p className="w-full md:w-80 justify-start text-muted-foreground text-base font-medium leading-5 tracking-wide">
            Te explicamos tudo passo a passo!
          </p>
        </div>

        {/* Grid de Cards (2 colunas) */}
        <div className="self-stretch grid grid-cols-1 md:grid-cols-2 justify-start items-start gap-10">
          
          {/* Card 1 e 2 */}
          {benefits.slice(0, 2).map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="flex-1 self-stretch p-10 bg-accent rounded-lg border-t-4 border-primary inline-flex flex-col justify-start items-start gap-6">
                <div className="size- p-2 bg-muted rounded-lg inline-flex justify-start items-center gap-2.5">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-primary text-xl font-medium leading-7 tracking-wide">
                  {benefit.title}
                </h3>
                <p className="self-stretch text-muted-foreground text-base font-normal leading-6 tracking-wide">
                  {benefit.description}
                </p>
                <Button variant="link" asChild className="p-0 h-auto text-zinc-700">
                  <Link href="#">
                    Saiba mais
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>

        {/* Grid de Cards (2 colunas) */}
        <div className="self-stretch grid grid-cols-1 md:grid-cols-2 justify-start items-start gap-10">
          {benefits.slice(2, 4).map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="flex-1 self-stretch p-10 bg-accent rounded-lg border-t-4 border-primary inline-flex flex-col justify-start items-start gap-6">
                <div className="size- p-2 bg-muted rounded-lg inline-flex justify-start items-center gap-2.5">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-primary text-xl font-medium leading-7 tracking-wide">
                  {benefit.title}
                </h3>
                <p className="self-stretch text-muted-foreground text-base font-normal leading-6 tracking-wide">
                  {benefit.description}
                </p>
                <Button variant="link" asChild className="p-0 h-auto text-zinc-700">
                  <Link href="#">
                    Saiba mais
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>

        {/* Botão Final */}
        <Button
          asChild
          variant="default" // Azul
          size="hero" // Padding px-6 py-5
        >
          <Link href="/simulador">
            Simulação Gratuita e Rápida
          </Link>
        </Button>
      </div>
    </section>
  );
};