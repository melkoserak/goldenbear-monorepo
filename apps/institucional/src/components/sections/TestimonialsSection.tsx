import React from 'react';
import { cn } from '@goldenbear/ui/lib/utils';
import { Button } from '@goldenbear/ui/components/button';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react'; 

// Data for testimonials
const testimonials = [
  {
    quote: "Desde que contratei o seguro, trabalho mais tranquilo sabendo que minha esposa e filhos estão amparados. O processo foi muito mais simples do que eu imaginava.",
    author: "Sgt. Oliveira",
    unit: "Exército Brasileiro"
  },
  {
    quote: "A cobertura para doenças graves me deu a segurança que eu precisava. O atendimento da Golden Bear foi impecável e muito humano.",
    author: "Ten. Amanda",
    unit: "Força Aérea"
  },
  
  {
    quote: "Ninguém espera o pior, mas estar preparado é nossa obrigação. A Golden Bear entende a realidade do militar e oferece um plano justo.",
    author: "Suboficial B. Costa",
    unit: "Marinha do Brasil"
  }
];

export const TestimonialsSection = () => {
  return (
    // Seção principal com fundo bg-accent (cinza claro)
    <section className="self-stretch w-full py-32 bg-accent inline-flex flex-col justify-center items-center gap-20">
      {/* Container de 1280px */}
      <div className="container w-full flex flex-col justify-start items-center gap-20 px-6">
        
        {/* Cabeçalho */}
        <div className="self-stretch inline-flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="flex-1 inline-flex flex-col justify-start items-start gap-6">
            {/* Título (com classes do Design System) */}
            <h2 className="w-full lg:w-[469px] justify-start text-primary text-3xl font-bold leading-8 tracking-wide">
              A confiança de quem vive a mesma realidade
            </h2>
          </div>
          
          {/* Botões de Navegação (traduzidos para o Design System) */}
          <div className="size- flex justify-start items-start gap-4">
            <Button variant="secondary" size="icon" className="opacity-30" disabled>
              <ArrowLeft className="w-6 h-6 text-secondary-foreground" />
            </Button>
            <Button variant="secondary" size="icon">
              <ArrowRight className="w-6 h-6 text-secondary-foreground" />
            </Button>
          </div>
        </div>

        {/* Grid de Cards de Depoimentos */}
        <div className="self-stretch grid grid-cols-1 md:grid-cols-3 items-start gap-10">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className={cn(
                "flex-1 p-10 h-full inline-flex flex-col justify-start items-start gap-10",
                "bg-card rounded-lg border border-border shadow-lg" // Cores e Sombra do Design System
              )}
            >
              {/* Citação (com classes do Design System) */}
              <p className="self-stretch text-muted-foreground text-xl font-medium leading-7 tracking-wide">
                "{testimonial.quote}"
              </p>
              {/* Autor (com classes do Design System) */}
              <p className="self-stretch text-foreground text-base font-normal leading-6 tracking-wide">
                <span className="font-semibold">{testimonial.author}</span>, {testimonial.unit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};