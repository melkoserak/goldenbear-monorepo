import {
  Shield,
  Award,
  HeartHandshake,
  Phone,
  FileCheck,
  Clock,
} from 'lucide-react';
import { cn } from '@goldenbear/ui/lib/utils'; // Importe o cn

// Lista de features da sua referência
const features = [
  {
    icon: Shield,
    title: 'Especialistas em Militares',
    description:
      'Entendemos as necessidades específicas das Forças Armadas e oferecemos soluções personalizadas.',
    color: 'text-primary bg-primary/10', // Adaptado para seu tema
  },
  {
    icon: Award,
    title: 'Parceiros da Mag Seguros',
    description:
      'Representantes credenciados de uma das maiores seguradoras do Brasil, garantindo segurança e confiabilidade.',
    color: 'text-secondary bg-secondary/10', // Adaptado para seu tema
  },
  {
    icon: HeartHandshake,
    title: 'Atendimento Personalizado',
    description:
      'Cada militar tem necessidades únicas. Nosso time está pronto para criar a melhor solução para você.',
    color: 'text-green-600 bg-green-500/10', // Mantido verde para variedade
  },
  {
    icon: Phone,
    title: 'Suporte 24/7',
    description:
      'Estamos disponíveis para você e sua família a qualquer momento, inclusive em emergências.',
    color: 'text-purple-600 bg-purple-500/10', // Mantido roxo
  },
  {
    icon: FileCheck,
    title: 'Processo Simplificado',
    description:
      'Contratação rápida e descomplicada, sem burocracia. Tudo pensado para facilitar sua vida.',
    color: 'text-destructive bg-destructive/10', // Adaptado para seu tema
  },
  {
    icon: Clock,
    title: 'Aprovação Rápida',
    description:
      'Análise e aprovação em até 48 horas. Proteção para sua família sem espera.',
    color: 'text-indigo-600 bg-indigo-500/10', // Mantido indigo
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-20 bg-accent"> {/* Usa a cor de fundo 'accent' do seu tema */}
      <div className="container"> {/* Usa a classe 'container' (1280px) */}
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full mb-4 font-medium">
            Por que escolher a gente?
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Especialistas Mag Seguros para Militares
          </h2>
          <p className="text-xl text-muted-foreground">
            Somos especialistas certificados pela Mag Seguros com foco total em
            atender as necessidades específicas dos militares e suas famílias.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              // Componente <Card> recriado com <div> e classes do seu tema
              <div
                key={index}
                className="bg-card text-card-foreground rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center mb-4',
                      feature.color
                    )}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust section */}
        <div className="mt-16 bg-primary rounded-2xl p-8 md:p-12 text-primary-foreground text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Parceiros Oficiais Mag Seguros
          </h3>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-6">
            A Mag Seguros é uma das seguradoras mais respeitadas do Brasil, e
            somos especialistas credenciados com foco exclusivo em atender
            militares das Forças Armadas.
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">A+</div>
              <div className="text-primary-foreground/80">Rating S&P</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">60+</div>
              <div className="text-primary-foreground/80">Anos no Mercado</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">Top 5</div>
              <div className="text-primary-foreground/80">
                Seguradoras do Brasil
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};