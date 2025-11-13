import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@goldenbear/ui/components/button';
import { cn } from '@goldenbear/ui/lib/utils';
import { 
  DollarSign, 
  ShieldCheck, 
  HeartHandshake, 
  Gem, 
  Plane, 
  GraduationCap, 
  Users 
} from 'lucide-react'; // Ícones do Design System

// Dados dos benefícios
const benefits = [
  {
    icon: DollarSign,
    title: "Condições Especiais",
    description: "Valores e coberturas exclusivas para militares ativos e da reserva"
  },
  {
    icon: ShieldCheck,
    title: "Cobertura Ampliada",
    description: "Proteção contra acidentes em serviço e situações de risco"
  },
  {
    icon: HeartHandshake,
    title: "Assistência Funeral",
    description: "Cobertura completa de despesas para você e sua família"
  },
  {
    icon: Gem,
    title: "Proteção Familiar",
    description: "Benefícios estendidos para cônjuge e filhos"
  },
  {
    icon: Plane,
    title: "Cobertura Internacional",
    description: "Proteção válida em missões e viagens ao exterior"
  },
  {
    icon: GraduationCap,
    title: "Auxílio Educação",
    description: "Garantia de continuidade dos estudos dos seus filhos"
  }
];

// Componente de Card de Benefício
const BenefitCard = ({ icon: Icon, title, description }: typeof benefits[0]) => (
  <div className="flex-1 px-6 py-10 bg-accent rounded-lg inline-flex flex-col justify-start items-start gap-6">
    {/* Ícone (SVG genérico substituído) */}
    <div className="size- p-2 bg-muted rounded-lg inline-flex justify-start items-center gap-2.5">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    {/* Título (com classes do Design System) */}
    <h3 className="self-stretch text-primary text-xl font-medium leading-7 tracking-wide">
      {title}
    </h3>
    {/* Descrição (com classes do Design System) */}
    <p className="self-stretch text-foreground text-base font-normal leading-6 tracking-wide">
      {description}
    </p>
  </div>
);


export const Vantagens = () => {
  return (
    // Seção principal com fundo branco (padrão)
    <section className="self-stretch w-full py-32 inline-flex justify-center items-center gap-2.5 bg-background">
      {/* Container de 1280px */}
      <div className="container flex-col flex justify-center items-start gap-20 px-6">
        
        {/* Cabeçalho */}
        <div className="size- inline-flex flex-col md:flex-row justify-start items-center gap-12 self-stretch">
          <div className="w-full md:w-[474px] justify-start text-primary text-3xl font-bold leading-8 tracking-wide">
            Benefícios Pensados para Quem Protege o País
          </div>
          <p className="w-full md:w-64 justify-start text-foreground text-base font-medium leading-5 tracking-wide">
            Oferecemos muito mais do que um seguro de vida tradicional.
          </p>
        </div>

        {/* Layout Principal (Imagem + Grid) */}
        <div className="self-stretch inline-flex flex-col lg:flex-row justify-center items-start gap-4">
          
          {/* Coluna da Imagem */}
          <div className="flex-1 self-stretch relative rounded-lg inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden min-h-[400px]">
            <Image 
              className="self-stretch flex-1 w-full h-full object-cover rounded-lg" 
              src="/imagens/imagem-familia-call-out.png" // Imagem do seu projeto
              alt="Proteja quem você ama"
              width={644}
              height={673}
            />
            <div className="left-[10%] top-[45%] absolute justify-start text-white text-2xl font-bold leading-7 tracking-wide">
              Proteja quem você ama
            </div>
          </div>
          
          {/* Coluna de Cards (Grid) */}
          <div className="size- inline-flex flex-col justify-center items-start gap-4 lg:w-[620px]">
            {/* Linha 1 do Grid */}
            <div className="w-full inline-flex flex-col sm:flex-row justify-start items-start gap-4">
              <BenefitCard {...benefits[0]} />
              <BenefitCard {...benefits[1]} />
            </div>
            {/* Linha 2 do Grid */}
            <div className="w-full inline-flex flex-col sm:flex-row justify-start items-start gap-4">
              <BenefitCard {...benefits[2]} />
              <BenefitCard {...benefits[3]} />
            </div>
            {/* Linha 3 do Grid */}
            <div className="w-full inline-flex flex-col sm:flex-row justify-start items-start gap-4">
              <BenefitCard {...benefits[4]} />
              <BenefitCard {...benefits[5]} />
            </div>
          </div>
        </div>

        {/* Seção de CTA Final */}
        <div className="self-stretch flex flex-col justify-center items-center gap-10">
          <p className="self-stretch text-center justify-start text-foreground text-xl font-medium leading-7 tracking-wide">
            Não espere pelo dia de amanhã, esteja seguro o tempo todo.
          </p>
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