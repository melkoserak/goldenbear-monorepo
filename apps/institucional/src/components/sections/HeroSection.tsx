import React from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@goldenbear/ui/components/button';
import { Award, Shield, ClipboardCheck } from 'lucide-react'; // 1. Ícones do Design System
import { cn } from '@goldenbear/ui/lib/utils';

export const HeroSection = () => {
  return (
    <section className={cn(
      "flex flex-col items-center justify-center gap-2.5 relative w-full overflow-hidden",
      "text-white", // Cor de texto base para a seção
      // 2. Background radial aplicado
      "[background:radial-gradient(50%_50%_at_65%_52%,rgba(2,102,232,1)_0%,rgba(0,74,172,1)_100%)]"
    )}>
      {/* 3. Container centralizado (max-w-screen-xl e px-6) */}
      <div className="flex flex-col lg:flex-row max-w-screen-xl w-full items-center lg:items-end gap-20 px-6">
        
        {/* Coluna da Esquerda */}
        <div className="inline-flex flex-col items-start justify-center gap-10 py-[88px] relative self-stretch">
          
          <header className="flex flex-col items-start gap-6 relative self-stretch w-full">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 relative bg-neutral-700 rounded-[100px]">
              {/* Ícone 'Award' (prêmio) com a cor amarela (secondary) do tema */}
              <Award
                className="!relative !w-4 !h-4 !aspect-[1] text-secondary"
                aria-hidden="true"
              />
              <p className="relative w-fit text-sm font-normal leading-5 tracking-wide whitespace-nowrap">
                Especialistas em Seguros para Militares
              </p>
            </div>
            
            {/* Título */}
            <h1 className="relative self-stretch font-bold text-white text-5xl tracking-[0] leading-[48px]">
              Seguro de vida exclusivo para Militares
            </h1>
          </header>

          {/* Parágrafo */}
          <p className="relative self-stretch font-normal text-white text-base tracking-[0.48px] leading-6 max-w-lg">
            <span className="font-semibold">
              Proteja quem você ama com as melhores condições do mercado.
            </span>
            <span> Somos </span>
            <span className="font-bold">
              especialistas da Mag Seguros
            </span>
            <span>
               com atendimento personalizado para os militares.
            </span>
          </p>

          {/* Botões */}
          <div className="inline-flex flex-col sm:flex-row items-start gap-4 relative">
            
            {/* Botão 1: Usando variant="secondary" e size="hero" do Design System */}
            <Button
              asChild
              variant="secondary"
              size="hero"
            >
              <Link href="/simulador">
                <span className="relative w-fit font-semibold text-base tracking-[0.48px] leading-[19.2px] whitespace-nowrap">
                  Simulação Gratuita e Rápida
                </span>
              </Link>
            </Button>
            
            {/* Botão 2: Usando variant="outline-hero" e size="hero" do Design System */}
            <Button
              asChild
              variant="outline-hero"
              size="hero"
            >
              <Link href="/contato">
                <span className="relative w-fit font-semibold text-base tracking-[0.48px] leading-[19.2px] whitespace-nowrap">
                  Falar com especialista
                </span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Coluna da Direita (Imagem) */}
        <div
          className="relative w-full lg:w-[100%] hidden lg:block"
          role="img"
          aria-label="Militar protegido com seguro de vida"
        >
          {/* Imagem principal (do seu projeto) */}
          <Image
            className="w-[100%] object-cover rounded-lg"
            alt="Militar profissional das Forças Armadas"
            src="/imagens/foto-banner-casal-escudo.png"
            width={598}
            height={494}
            priority
          />

          {/* Card Flutuante */}
          <div className={cn(
            "inline-flex items-start gap-2 p-4 absolute top-[113px] left-[-50px]",
            "rounded-2xl border border-solid shadow-lg",
            "bg-background border-primary" // Cores do tema: Fundo branco, borda azul
          )}>
            {/* Ícone 'Shield' (escudo) com cor azul (primary) do tema */}
            <ClipboardCheck
              className="!relative !w-6 !h-6 text-primary flex-shrink-0"
              aria-hidden="true"
            />
            <div className="flex w-[148px] items-center gap-2.5 relative">
              <p className="relative w-[148px] font-normal text-primary text-sm tracking-[0.42px] leading-[19.6px]">
                <span className="font-normal">
                  Cobertura{" "}
                </span>
                <span className="font-semibold">
                  até <br />
                  R$ 1 Milhão Com condições especiais
                </span>
                <span className="font-normal">
                  {" "}
                  para militares
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};