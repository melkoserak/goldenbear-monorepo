import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@goldenbear/ui/components/button';
import { ArrowRight } from 'lucide-react';
import { Section } from '@goldenbear/ui/components/section';
import { Container } from '@goldenbear/ui/components/container';
import { Typography } from '@goldenbear/ui/components/typography';
// 1. Importar os componentes do Carrossel
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@goldenbear/ui/components/carousel';

// 2. Atualizar o array com todas as 6 categorias, descrições e links
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
    imageUrl: "/imagens/foto-militar-exercito.png", // TODO: Trocar imagem
    linkUrl: "/seguro-militar/marinha"
  },
  {
    title: "Força Aérea Brasileira",
    description: "Cobertura à altura dos seus voos, de Soldado a Brigadeiro. Proteção completa no ar e em solo.",
    imageUrl: "/imagens/foto-militar-exercito.png", // TODO: Trocar imagem
    linkUrl: "/seguro-militar/aeronautica"
  },
  {
    title: "Policiais Militares",
    description: "Amparo para quem está na linha de frente, de Soldado a Coronel. Segurança para enfrentar os desafios diários.",
    imageUrl: "/imagens/foto-militar-exercito.png", // TODO: Trocar imagem
    linkUrl: "/seguro-militar/policia-militar"
  },
  {
    title: "Bombeiros Militares",
    description: "Proteção robusta para heróis que arriscam a vida para salvar outras, de Soldado a Coronel BM.",
    imageUrl: "/imagens/foto-militar-exercito.png", // TODO: Trocar imagem
    linkUrl: "/seguro-militar/bombeiros"
  }
];

// 3. ForceCard ATUALIZADO para altura consistente
const ForceCard = ({ title, description, imageUrl, linkUrl }: any) => {
  return (
    // 1. Adicione 'relative' e 'group' no container pai
    <div className="flex-1 bg-card rounded-lg hover:shadow-lg overflow-hidden flex flex-col justify-start h-full relative group transition-all duration-300 hover:-translate-y-1">
      <div className="self-stretch h-60 relative flex flex-col justify-start items-start gap-2.5 overflow-hidden">
        {/* ... imagem ... */}
      </div>
      <div className="self-stretch p-6 flex flex-col justify-start items-start gap-6 flex-1">
        <Typography variant="h4" className="self-stretch">
          {title}
        </Typography>
        
        <Typography variant="body" color="muted" className="self-stretch flex-1">
          {description}
        </Typography>
        
        <Button variant="link" asChild className="p-0 h-auto text-foreground font-medium mt-auto">
          <Link href={linkUrl}>
            {/* 2. O truque mágico: esse span expande a área de clique para todo o card pai (relative) */}
            <span className="absolute inset-0 z-10" aria-hidden="true" />
            Saiba mais <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export const ForcesSection = () => {
  return (
    <Section variant="accent">
      <Container className="flex flex-col justify-start items-center gap-10 lg:gap-12">
        
        {/* 4. Carrossel implementado para TODOS os dispositivos */}
        <Carousel
          opts={{
            align: "start",
            loop: false, // <-- Definido como "finito"
          }}
          className="w-full"
        >
          {/* Header com Título e Setas (visíveis em todos os dispositivos) */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
            <Typography variant="h2" color="primary" className="text-left max-w-[474px]">
              Proteção sob medida para todas as forças e corporações
            </Typography>
            
            <div className="flex-shrink-0 flex gap-4">
              <CarouselPrevious className='' />
              <CarouselNext />
            </div>
          </div>

          {/* 5. Conteúdo do Carrossel com classes responsivas */}
          <CarouselContent className="-ml-6">
            {forces.map((force, index) => (
              <CarouselItem 
                key={index} 
                // Define a largura dos itens por breakpoint
                className="pl-6 basis-4/5 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                {/* Wrapper para garantir altura total */}
                <div className="h-full">
                  <ForceCard {...force} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>


          
        </Carousel>
        
        {/* 6. Botão "Veja todas" apontando para o HUB */}
        <Button variant="link" asChild className="p-0 h-auto text-foreground">
          <Link href="/seguro-militar">
            Veja todas as profissões <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </Container>
    </Section>
  );
};