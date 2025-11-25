import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@goldenbear/ui/components/button';
import { ArrowRight } from 'lucide-react';
import { Section } from '@goldenbear/ui/components/section';
import { Container } from '@goldenbear/ui/components/container';
import { Typography } from '@goldenbear/ui/components/typography';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@goldenbear/ui/components/carousel';

const forces = [
  {
    title: "Exército Brasileiro",
    description: "Proteção para todas as patentes, de Soldado a General. Cobertura em treinamento, missão ou no dia a dia.",
    imageUrl: "/imagens/foto-militar-exercito.png",
    linkUrl: "/seguro-militar/exercito"
  },
  {
    title: "Marinha do Brasil",
    description: "Segurança para quem serve nos mares e em terra, de Marinheiro a Almirante. Garantia para você e sua família.",
    imageUrl: "/imagens/foto-militar-exercito.png", 
    linkUrl: "/seguro-militar/marinha"
  },
  {
    title: "Força Aérea Brasileira",
    description: "Cobertura à altura dos seus voos, de Soldado a Brigadeiro. Proteção completa no ar e em solo.",
    imageUrl: "/imagens/foto-militar-exercito.png", 
    linkUrl: "/seguro-militar/aeronautica"
  },
  {
    title: "Policiais Militares",
    description: "Amparo para quem está na linha de frente, de Soldado a Coronel. Segurança para enfrentar os desafios diários.",
    imageUrl: "/imagens/foto-militar-exercito.png", 
    linkUrl: "/seguro-militar/policia-militar"
  },
  {
    title: "Bombeiros Militares",
    description: "Proteção robusta para heróis que arriscam a vida para salvar outras, de Soldado a Coronel BM.",
    imageUrl: "/imagens/foto-militar-exercito.png", 
    linkUrl: "/seguro-militar/bombeiros"
  }
];

// --- ForceCard REVISADO (Padrão Robusto) ---
const ForceCard = ({ title, description, imageUrl, linkUrl }: any) => {
  return (
    // 1. O componente principal agora é um Link (Nativo do Next.js)
    // Isso torna toda a área clicável e acessível, sem conflitos de z-index.
    <Link 
      href={linkUrl}
      className="flex-1 bg-card rounded-lg border border-border shadow-sm hover:shadow-lg overflow-hidden flex flex-col justify-start h-full relative group transition-all duration-300 hover:-translate-y-1 outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="self-stretch h-60 relative flex flex-col justify-start items-start gap-2.5 overflow-hidden bg-muted">
        {/* OTIMIZAÇÃO LCP: Adicionado 'sizes' */}
        {/* Mobile: card quase full width (80vw). Desktop: 1/3 ou 1/4 da tela (25vw) */}
        <Image 
          src={imageUrl} 
          alt={title} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 80vw, (max-width: 1200px) 33vw, 25vw" 
        />
      </div>
      
      <div className="self-stretch p-6 flex flex-col justify-start items-start gap-6 flex-1">
        {/* Título reage ao hover do pai (group) */}
        <Typography variant="h4" className="self-stretch group-hover:text-primary transition-colors">
          {title}
        </Typography>
        
        <Typography variant="body" color="muted" className="self-stretch flex-1">
          {description}
        </Typography>
        
        {/* Simulação visual do botão para manter o layout, mas sem HTML inválido */}
        <div className="p-0 h-auto text-foreground font-medium mt-auto inline-flex items-center group-hover:text-foreground transition-colors">
           <span className="underline underline-offset-4 decoration-transparent text-sm group-hover:decoration-foreground transition-all duration-300">
             Saiba mais
           </span>
           <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export const ForcesSection = () => {
  return (
    <Section variant="accent">
      <Container className="flex flex-col justify-start items-center gap-10 lg:gap-12">
        
        <Carousel
          opts={{
            align: "start",
            loop: false, 
          }}
          className="w-full"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
            <Typography variant="h2" color="primary" className="text-left max-w-[474px]">
              Proteção sob medida para todas as forças e corporações
            </Typography>
            
            <div className="flex-shrink-0 flex gap-4">
              <CarouselPrevious variant="secondary" />
              <CarouselNext variant="secondary" />
            </div>
          </div>

          <CarouselContent className="-ml-6 pb-4"> {/* pb-4 para não cortar a sombra */}
            {forces.map((force, index) => (
              <CarouselItem 
                key={index} 
                className="pl-6 basis-4/5 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <div className="h-full">
                  <ForceCard {...force} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
        <Button variant="link" asChild className="p-0 h-auto text-foreground">
          <Link href="/seguro-militar">
            Veja todas as profissões <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </Container>
    </Section>
  );
};