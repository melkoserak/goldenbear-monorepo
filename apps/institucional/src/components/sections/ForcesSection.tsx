import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@goldenbear/ui/components/button';
import { ArrowRight } from 'lucide-react';
import { Section } from '@goldenbear/ui/components/section';
import { Container } from '@goldenbear/ui/components/container';
import { Typography } from '@goldenbear/ui/components/typography';

const forces = [
  {
    title: "Militares do Exército Brasileiro",
    description: "Segurança e tranquilidade para você e sua família, seja em treinamento, em missão ou no dia a dia do quartel.",
    imageUrl: "/imagens/foto-militar-exercito.png",
    linkUrl: "/seguro-militar"
  },
  {
    title: "Marinha do Brasil",
    description: "Proteção completa para quem serve nos mares, rios e em terra, garantindo seu futuro e de quem você ama.",
    imageUrl: "/imagens/foto-militar-exercito.png",
    linkUrl: "/seguro-militar"
  },
  {
    title: "Força Aérea Brasileira",
    description: "Cobertura à altura dos seus voos, protegendo você no ar e em solo, em qualquer missão pelo país.",
    imageUrl: "/imagens/foto-militar-exercito.png",
    linkUrl: "/seguro-militar"
  },
  {
    title: "Policiais Militares",
    description: "O apoio e a segurança que você precisa para enfrentar os desafios diários na proteção da sociedade.",
    imageUrl: "/imagens/foto-militar-exercito.png",
    linkUrl: "/seguro-militar"
  },
  {
    title: "Bombeiros Militares",
    description: "Proteção robusta para heróis que arriscam a vida para salvar outras, cobrindo todos os momentos.",
    imageUrl: "/imagens/foto-militar-exercito.png",
    linkUrl: "/seguro-militar"
  },
  {
    title: "Outras Forças",
    description: "Temos soluções especializadas para todas as forças de segurança e corporações. Consulte-nos.",
    imageUrl: "/imagens/foto-militar-exercito.png",
    linkUrl: "/contato"
  }
];

const ForceCard = ({ title, description, imageUrl, linkUrl }: any) => {
  return (
    <div className="flex-1 bg-card rounded-lg hover:shadow-lg overflow-hidden flex flex-col justify-start">
      <div className="self-stretch h-60 relative flex flex-col justify-start items-start gap-2.5 overflow-hidden">
        <Image 
          className="self-stretch flex-1 w-full h-full object-cover" 
          src={imageUrl} 
          alt={title}
          fill // Se estiver usando fill, ou width/height responsivos
          // ADICIONE ISTO:
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>
      <div className="self-stretch p-6 flex flex-col justify-start items-start gap-6">
        {/* Substituindo h3 manual */}
        <Typography variant="h4" className="self-stretch">
          {title}
        </Typography>
        
        {/* Substituindo p manual */}
        <Typography variant="body" color="muted" className="self-stretch h-24">
          {description}
        </Typography>
        
        <Button variant="link" asChild className="p-0 h-auto text-foreground font-medium">
          <Link href={linkUrl}>
            Saiba mais <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export const ForcesSection = () => {
  return (
    <Section variant="accent">
      <Container className="flex flex-col justify-start items-center gap-10 lg:gap-20">
        {/* Título da Seção */}
        <Typography variant="h2" color="primary" className="self-stretch text-left max-w-[474px]">
          Proteção sob medida para todas as forças e corporações
        </Typography>
        
        {/* ... Grids de Cards ... */}
        <div className="self-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {forces.slice(0, 4).map((force) => <ForceCard key={force.title} {...force} />)}
        </div>
        <div className="self-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
          <div className="hidden lg:block"></div> 
          {forces.slice(4, 6).map((force) => <ForceCard key={force.title} {...force} />)}
          <div className="hidden lg:block"></div>
        </div>
        
        <Button variant="link" asChild className="p-0 h-auto text-foreground">
          <Link href="/seguro-militar">Veja todas as profissões <ArrowRight className="w-4 h-4 ml-1" /></Link>
        </Button>
      </Container>
    </Section>
  );
};