import React from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@goldenbear/ui/components/button';
import { Award, ClipboardCheck } from 'lucide-react';
import { cn } from '@goldenbear/ui/lib/utils';
import { Section } from '@goldenbear/ui/components/section';
import { Container } from '@goldenbear/ui/components/container';
import { Typography } from '@goldenbear/ui/components/typography';

export const HeroSection = () => {
  return (
    <Section variant="primary-gradient" padding="none">
      <Container className="flex flex-col lg:flex-row items-center lg:items-end gap-0 lg:gap-20 ">
        
        <div className="inline-flex flex-col items-start justify-center gap-10 py-16 relative self-stretch">
          <header className="flex flex-col items-start gap-6 relative self-stretch w-full">
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-2 relative rounded-[100px]",
              "bg-black/20"
            )}>
              <Award className="!relative !w-4 !h-4 text-secondary" aria-hidden="true" />
              <Typography variant="small" color="white">
                Especialistas em Seguros para Militares
              </Typography>
            </div>
            
            <Typography variant="display" color="white">
              Seguro de vida exclusivo para Militares
            </Typography>
          </header>

          <div className="relative self-stretch max-w-lg">
            <Typography variant="body" color="white">
              <span className="font-bold">Proteja quem você ama com as melhores condições do mercado.</span>
              <span> Somos </span>
              <span className="font-bold">especialistas da Mag Seguros</span>
              <span> com atendimento personalizado para os militares.</span>
            </Typography>
          </div>

          <div className="inline-flex flex-col sm:flex-row items-start gap-4 relative w-full sm:w-auto">
            <Button asChild variant="secondary" size="hero" className="w-full sm:w-auto">
              <Link href="/simulador">Simulação Gratuita e Rápida</Link>
            </Button>
            <Button asChild variant="outline-hero" size="hero" className="w-full sm:w-auto">
              <Link href="/contato">Falar com especialista</Link>
            </Button>
          </div>
        </div>

        <div className="relative w-full lg:w-[100%] lg:block">
              <Image
              className="w-[100%] object-cover rounded-lg"
              alt="Família sorridente com um escudo de proteção amarelo ao fundo..."
              src="/imagens/foto-banner-casal-escudo.png"
              width={598}
              height={494}
              priority
              quality={85} // <-- ADICIONADO: Compressão segura para Hero
              // --- OTIMIZAÇÃO DE PERFORMANCE ---
              // Ajustado: Em mobile (max 768px), desconta o padding lateral (aprox 48px)
              sizes="(max-width: 768px) calc(100vw - 48px), (max-width: 1200px) 50vw, 600px"
            />

          <div className={cn(
            "hidden lg:flex items-start gap-2 p-4 absolute top-[113px] left-[-50px]",
            "rounded-2xl border border-solid shadow-lg",
            "bg-background border-primary"
          )}>
            <ClipboardCheck className="w-6 h-6 text-primary flex-shrink-0" />
            <div className="flex w-[148px] items-center gap-2.5">
              <Typography variant="small" color="primary" className="leading-[19.6px]">
                <span className="font-normal">Cobertura </span>
                <span className="font-bold">até <br />R$ 1 Milhão</span>
                <span className="font-normal"> para militares</span>
              </Typography>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};