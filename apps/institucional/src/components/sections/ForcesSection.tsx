import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@goldenbear/ui/components/button';
import { cn } from '@goldenbear/ui/lib/utils';
import { ArrowRight } from 'lucide-react';

// Dados dos cards
const forces = [
  {
    title: "Militares do Exército Brasileiro",
    description: "Segurança e tranquilidade para você e sua família, seja em treinamento, em missão ou no dia a dia do quartel.",
    imageUrl: "/imagens/foto-militar-exercito.png", // Imagem do seu projeto
    linkUrl: "/seguro-militar"
  },
  {
    title: "Marinha do Brasil",
    description: "Proteção completa para quem serve nos mares, rios e em terra, garantindo seu futuro e de quem você ama.",
    imageUrl: "/imagens/foto-militar-exercito.png", // Usando placeholder
    linkUrl: "/seguro-militar"
  },
  {
    title: "Força Aérea Brasileira",
    description: "Cobertura à altura dos seus voos, protegendo você no ar e em solo, em qualquer missão pelo país.",
    imageUrl: "/imagens/foto-militar-exercito.png", // Usando placeholder
    linkUrl: "/seguro-militar"
  },
  {
    title: "Policiais Militares",
    description: "O apoio e a segurança que você precisa para enfrentar os desafios diários na proteção da sociedade.",
    imageUrl: "/imagens/foto-militar-exercito.png", // Usando placeholder
    linkUrl: "/seguro-militar"
  },
  {
    title: "Bombeiros Militares",
    description: "Proteção robusta para heróis que arriscam a vida para salvar outras, cobrindo todos os momentos.",
    imageUrl: "/imagens/foto-militar-exercito.png", // Usando placeholder
    linkUrl: "/seguro-militar"
  },
  {
    title: "Outras Forças",
    description: "Temos soluções especializadas para todas as forças de segurança e corporações. Consulte-nos.",
    imageUrl: "/imagens/foto-militar-exercito.png", // Usando placeholder
    linkUrl: "/contato"
  }
];

// Componente para o Card individual
const ForceCard = ({ title, description, imageUrl, linkUrl }: typeof forces[0]) => {
  return (
    <div className="flex-1 bg-card rounded-lg hover:shadow-lg overflow-hidden flex flex-col justify-start">
      <div className="self-stretch h-60 relative flex flex-col justify-start items-start gap-2.5 overflow-hidden">
        <Image 
          className="self-stretch flex-1 w-full h-full object-cover" 
          src={imageUrl} 
          alt={title}
          width={302}
          height={240}
        />
      </div>
      <div className="self-stretch p-6 flex flex-col justify-start items-start gap-6">
        <h3 className="self-stretch text-foreground text-xl font-medium leading-7 tracking-wide">
          {title}
        </h3>
        <p className="self-stretch text-muted-foreground text-base font-normal leading-6 tracking-wide h-24">
          {description}
        </p>
        <Button variant="link" asChild className="p-0 h-auto text-foreground">
          <Link href={linkUrl}>
            Saiba mais
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

// Componente da Seção Principal
export const ForcesSection = () => {
  return (
    <section className="self-stretch w-full py-32 bg-accent inline-flex flex-col justify-start items-center gap-20">
      <div className="container w-full flex flex-col justify-start items-center gap-20 px-6">
        
        {/* Título */}
        <h2 className="self-stretch text-left text-primary text-3xl font-bold leading-8 tracking-wide">
          Proteção sob medida para <br/>todas as forças e corporações
        </h2>

        {/* Grid de Cards (Linha 1) */}
        <div className="self-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {forces.slice(0, 4).map((force) => (
            <ForceCard key={force.title} {...force} />
          ))}
        </div>

        {/* Grid de Cards (Linha 2) - Centralizado */}
        <div className="self-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
          {/* Espaçadores para centralizar os 2 cards */}
          <div className="hidden lg:block"></div> 
          
          {forces.slice(4, 6).map((force) => (
            <ForceCard key={force.title} {...force} />
          ))}
          
          {/* Espaçadores para centralizar os 2 cards */}
          <div className="hidden lg:block"></div>
        </div>
        
        {/* Link Final */}
        <Button variant="link" asChild className="p-0 h-auto text-foreground">
          <Link href="/seguro-militar"> {/* Link "Veja todas as profissões" */}
            Veja todas as profissões
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>
    </section>
  );
};