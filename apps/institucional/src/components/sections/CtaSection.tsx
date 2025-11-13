import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@goldenbear/ui/components/button';
import { cn } from '@goldenbear/ui/lib/utils';
import { Shield } from 'lucide-react'; // Ícone do Design System

export const CtaSection = () => {
  return (
    // Seção principal (fundo branco por padrão)
    <section className="self-stretch w-full py-32 inline-flex justify-center items-center gap-2.5">
      {/* Container de 1280px */}
      <div className="container flex-col lg:flex-row flex justify-between items-center px-6">
        
        {/* Coluna da Esquerda (Imagem) */}
        <div className="w-full lg:w-[480px] relative flex justify-center lg:justify-start items-center gap-2.5 mb-12 lg:mb-0">
          {/* Imagem (substituída por uma imagem do projeto) */}
          <Image 
            className="w-100%" 
            src="/imagens/celular-com-simulador.png" 
            alt="Contratação digital do seguro"
            width={393} // w-72
            height={614}
          />
        </div>
        
        {/* Coluna da Direita (Texto) */}
        <div className="size- inline-flex flex-col justify-center items-start gap-20">
          <div className="size- flex flex-col justify-start items-start gap-10">
            <div className="w-full lg:w-96 inline-flex justify-start items-center gap-4">
              {/* Ícone (com cores do Design System) */}
              <div className="size- p-2 bg-secondary rounded-lg flex justify-start items-center gap-2.5">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              {/* Texto ao lado do ícone (com cores do Design System) */}
              <div className="flex-1 flex justify-center items-center gap-2.5">
                <p className="flex-1 justify-start text-foreground text-base font-medium leading-5 tracking-wide">
                  Tranquilidade financeira e a segurança que você precisa sem burocracia
                </p>
              </div>
            </div>
            {/* Título (com cores e classes do Design System) */}
            <h2 className="w-full lg:w-[663px] justify-start text-primary text-4xl lg:text-5xl font-bold leading-tight">
              Em menos de 5 minutos um seguro perfeito e pronto para deixar sua família segura
            </h2>
          </div>
          
          {/* Botão (com componente do Design System) */}
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
      </div>
    </section>
  );
};