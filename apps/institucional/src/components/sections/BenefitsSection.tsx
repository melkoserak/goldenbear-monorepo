import {
  Check,
  Shield,
  Heart,
  Plane,
  GraduationCap,
  Home,
  DollarSign,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@goldenbear/ui/lib/utils';

// Lista de benefícios principais
const mainBenefits = [
  {
    icon: DollarSign,
    title: 'Condições Especiais',
    description:
      'Valores e coberturas exclusivas para militares ativos e da reserva',
  },
  {
    icon: Shield,
    title: 'Cobertura Ampliada',
    description:
      'Proteção contra acidentes em serviço e situações de risco',
  },
  {
    icon: Heart,
    title: 'Assistência Funeral',
    description: 'Cobertura completa de despesas para você e sua família',
  },
  {
    icon: Home,
    title: 'Proteção Familiar',
    description: 'Benefícios estendidos para cônjuge e filhos',
  },
  {
    icon: Plane,
    title: 'Cobertura Internacional',
    description: 'Proteção válida em missões e viagens ao exterior',
  },
  {
    icon: GraduationCap,
    title: 'Auxílio Educação',
    description: 'Garantia de continuidade dos estudos dos seus filhos',
  },
];

// Lista de benefícios adicionais
const additionalBenefits = [
  'Indenização por invalidez permanente',
  'Assistência médica 24h',
  'Sorteios mensais de até R$ 50 mil',
  'Desconto em folha de pagamento',
  'Sem carência para acidentes',
  'Renovação automática garantida',
  'Portabilidade facilitada',
  'Isenção de IOF',
];

export const BenefitsSection = () => {
  return (
    <section className="py-20 bg-background"> {/* Cor de fundo padrão */}
      <div className="container"> {/* Container de 1280px */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Esquerda - Imagem */}
          <div className="relative order-2 lg:order-1">
            <div className="relative">
              <Image
                src="/imagens/imagem-familia-call-out.png" // Imagem local
                alt="Família feliz e protegida"
                width={800}
                height={700}
                className="rounded-2xl shadow-2xl"
              />

              {/* Badge Flutuante (usando cores do tema) */}
              <div className="absolute -top-4 -right-4 bg-secondary text-secondary-foreground p-6 rounded-xl shadow-xl">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">R$ 1M</div>
                  <div className="text-sm opacity-90">de cobertura</div>
                </div>
              </div>
            </div>

            {/* Decoração (usando cores do tema) */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/10 rounded-full -z-10 opacity-50"></div>
            <div className="absolute -top-8 -left-4 w-24 h-24 bg-secondary/10 rounded-full -z-10 opacity-50"></div>
          </div>

          {/* Direita - Conteúdo */}
          <div className="order-1 lg:order-2">
            {/* Badge (recriado com div e cores do tema) */}
            <div className="inline-block bg-green-500/10 text-green-700 px-4 py-2 rounded-full mb-4 font-medium">
              Benefícios Exclusivos
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Benefícios Pensados para Quem Protege o País
            </h2>

            <p className="text-xl text-muted-foreground mb-8">
              Oferecemos muito mais do que um seguro de vida tradicional.
              Nossos planos são especialmente desenvolvidos para atender as
              necessidades únicas dos militares e suas famílias.
            </p>

            {/* Benefícios Principais */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {mainBenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-foreground mb-1">
                        {benefit.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {benefit.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Benefícios Adicionais */}
            <div className="bg-accent rounded-xl p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">
                E ainda mais benefícios:
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {additionalBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};