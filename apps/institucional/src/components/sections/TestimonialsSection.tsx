import React from 'react';
import { cn } from '@goldenbear/ui/lib/utils';
import { Section } from '@goldenbear/ui/components/section';
import { Container } from '@goldenbear/ui/components/container';
import { Typography } from '@goldenbear/ui/components/typography';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@goldenbear/ui/components/carousel';

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
  },
  {
    quote: "Processo 100% digital e muito transparente. Recomendo para todos do batalhão.",
    author: "Cb. Silva",
    unit: "Polícia Militar"
  }
];

export const TestimonialsSection = () => {
  return (
    <Section variant="accent">
      <Container>
        <Carousel
          opts={{
            align: "start",
            loop: false, // Garante que tem fim e os botões ficam disabled
          }}
          className="w-full flex flex-col gap-12"
        >
          {/* Header com Setas de Referência */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex-1">
              <Typography variant="h2" color="primary" className="w-full lg:w-[469px]">
                A confiança de quem vive a mesma realidade
              </Typography>
            </div>
            
            {/* Agora basta chamar os componentes, o estilo global resolve o resto */}
            <div className="flex gap-4">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </div>

          <CarouselContent className="-ml-6">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-6 md:basis-1/2 lg:basis-1/3">
                <div className={cn(
                  "flex flex-col justify-between p-8 h-full min-h-[280px]",
                  // --- CORREÇÃO APLICADA ---
                  // Substituído shadow-lg por tokens e removido hover da borda
                  "bg-card rounded-lg border border-border select-none transition-shadow shadow-sm hover:shadow-md"
                )}>
                  <Typography variant="h4" color="muted" className="italic mb-6 font-normal text-lg">
                    "{testimonial.quote}"
                  </Typography>
                  <div className="mt-auto">
                    <Typography variant="body" className="font-bold text-primary">
                      {testimonial.author}
                    </Typography>
                    <Typography variant="small" color="muted">
                      {testimonial.unit}
                    </Typography>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </Container>
    </Section>
  );
};