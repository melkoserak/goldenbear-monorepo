import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@goldenbear/ui/components/button';
import { cn } from '@goldenbear/ui/lib/utils';

export const DigitalCtaSection = () => {
  return (
    // Fundo bg-accent (cinza) e padding vertical
    <section className="self-stretch w-full bg-accent inline-flex justify-center items-center gap-2.5">
      {/* Container de 1280px */}
      <div className="container flex-col lg:flex-row flex justify-start items-center gap-20 px-6">
        
        {/* Coluna da Esquerda (Imagem) */}
        {/* Adicionado 'hidden lg:flex' para esconder em telas pequenas */}
        <div className="w-full lg:w-[680px] relative hidden lg:flex justify-center items-center">
          {/* Imagem (substituída por uma imagem do projeto) */}
          <Image 
            className="w-full" 
            src="/imagens/familia-foto-segurados.png" // Imagem do seu projeto
            alt="Contratação digital do seguro"
            width={680}
            height={696}
          />
        </div>

        {/* Coluna da Direita (Texto) */}
        <div className="flex-1 inline-flex flex-col justify-center items-start gap-10">
          {/* Título (com cores do Design System) */}
          <h2 className="self-stretch text-primary text-2xl font-bold leading-7 tracking-wide">
            Contratação simplificada e digital
          </h2>
          {/* Descrição (com cores do Design System) */}
          <p className="self-stretch text-foreground text-base font-normal leading-6 tracking-wide">
            Processo rápido, com menos burocracia, adaptado à sua rotina corrida e sem necessidade de exames complexos na maioria dos casos.
          </p>
          {/* Botão (com componente do Design System) */}
          <Button
            asChild
            variant="default" // Azul
            size="hero"      // Padding px-6 py-5
          >
            <Link href="/simulador">
              Simulação Gratuita e Rápida
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};