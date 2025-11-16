import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@goldenbear/ui/components/button';
import { 
  DollarSign, 
  ShieldCheck, 
  HeartHandshake, 
  Gem, 
  Plane, 
  GraduationCap
} from 'lucide-react';
import { Section } from '@goldenbear/ui/components/section';
import { Container } from '@goldenbear/ui/components/container';
import { Typography } from '@goldenbear/ui/components/typography';

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

const BenefitCard = ({ icon: Icon, title, description }: any) => (
  <div className="flex-1 px-6 py-10 bg-accent rounded-lg inline-flex flex-col justify-start items-start gap-6">
    <div className="p-2 bg-muted rounded-lg inline-flex justify-start items-center gap-2.5">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <Typography variant="h4" color="primary">
      {title}
    </Typography>
    <Typography variant="body">
      {description}
    </Typography>
  </div>
);

export const Vantagens = () => {
  return (
    <Section variant="default">
      <Container className="flex flex-col justify-center items-start gap-20">
        
        <div className="inline-flex flex-col md:flex-row justify-start items-center gap-12 self-stretch">
          <Typography variant="h2" color="primary" className="w-full md:w-[474px]">
            Benefícios Pensados para Quem Protege o País
          </Typography>
          <Typography variant="body" className="w-full md:w-64 font-medium">
            Oferecemos muito mais do que um seguro de vida tradicional.
          </Typography>
        </div>

        {/* Resto do layout (imagem + grid) */}
        <div className="self-stretch inline-flex flex-col lg:flex-row justify-center items-start gap-0 lg:gap-4">
          <div className="flex-1 self-stretch relative rounded-lg inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden min-h-[400px]">
            <Image className="self-stretch flex-1 w-full h-full object-cover rounded-lg" src="/imagens/imagem-familia-call-out.png" alt="Proteja quem você ama" width={644} height={673} />
            <div className="left-[10%] top-[45%] absolute">
              <Typography variant="h3" color="white">Proteja quem você ama</Typography>
            </div>
          </div>
          
          <div className="inline-flex flex-col justify-center items-start gap-4 lg:w-[620px]">
             {/* Manter a estrutura de grid manual ou refatorar para grid CSS puro */}
             <div className="w-full inline-flex flex-col sm:flex-row justify-start items-start gap-4">
              <BenefitCard {...benefits[0]} />
              <BenefitCard {...benefits[1]} />
            </div>
            <div className="w-full inline-flex flex-col sm:flex-row justify-start items-start gap-4">
              <BenefitCard {...benefits[2]} />
              <BenefitCard {...benefits[3]} />
            </div>
            <div className="w-full inline-flex flex-col sm:flex-row justify-start items-start gap-4">
              <BenefitCard {...benefits[4]} />
              <BenefitCard {...benefits[5]} />
            </div>
          </div>
        </div>

        <div className="self-stretch flex flex-col justify-center items-center gap-10">
          <Typography variant="h4" className="text-center">
            Não espere pelo dia de amanhã, esteja seguro o tempo todo.
          </Typography>
          <Button asChild variant="default" size="hero">
            <Link href="/simulador">Simulação Gratuita e Rápida</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
};