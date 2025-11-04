import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@goldenbear/ui/components/button';
import { Shield, Award } from 'lucide-react';
import { cn } from '@goldenbear/ui/lib/utils'; // Importe o cn

// O componente agora é um Server Component (melhor performance)
// e usa as props do seu tema (primary, secondary)
export const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-primary text-primary-foreground"
    >
      {/* Background overlay e pattern da sua referência */}
      <div className="absolute inset-0"></div>
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(30deg, transparent 40%, rgba(255,255,255,.1) 40%, rgba(255,255,255,.1) 60%, transparent 60%)',
            backgroundSize: '100px 100px',
          }}
        ></div>
      </div>

      {/* Conteúdo centralizado (1280px) */}
      <div className="container relative z-10 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo da Esquerda */}
          <div className="z-10">
            <div className="inline-flex items-center gap-2 bg-white border border-secondary/30 rounded-full px-4 py-2 mb-6">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium text-secondary">
                Especialistas em Seguros para Militares
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-tight text-primary-foreground md:text-5xl mb-6">
              Seguro de Vida Exclusivo para Militares
            </h1>

            <p className="text-xl text-primary-foreground/90 mb-8">
              Proteja quem você ama com as melhores condições do mercado. Somos
              especialistas da <span className="text-secondary">Mag Seguros</span>{' '}
              com atendimento personalizado para os militares.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" asChild className={cn(
                // Botão de Destaque (Amarelo)
                "bg-secondary text-secondary-foreground hover:bg-secondary/90"
              )}>
                <Link href="/simulador">
                  Fazer Simulação Gratuita
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className={cn(
                  // Botão Vazado (Branco)
                  "border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                )}
              >
                <Link href="/contato">
                  Falar com Especialista
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="border-l-4 border-secondary pl-4">
                <div className="text-3xl font-bold mb-1">+15</div>
                <div className="text-sm text-primary-foreground/80">
                  Anos de Experiência
                </div>
              </div>
              <div className="border-l-4 border-secondary pl-4">
                <div className="text-3xl font-bold mb-1">+5mil</div>
                <div className="text-sm text-primary-foreground/80">
                  Militares Atendidos
                </div>
              </div>
              <div className="border-l-4 border-secondary pl-4">
                <div className="text-3xl font-bold mb-1">100%</div>
                <div className="text-sm text-primary-foreground/80">
                  Satisfação
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo da Direita - Imagem */}
          <div className="relative hidden lg:block">
            <div className="relative z-10">
              <Image
                src="/imagens/foto-militar-exercito.png" // Imagem local
                alt="Militar profissional das Forças Armadas"
                width={800}
                height={700}
                className="rounded-lg shadow-2xl"
                priority
              />
            </div>

            {/* Card Flutuante */}
            <div className="absolute -bottom-6 -left-6 bg-background text-primary p-6 rounded-lg shadow-xl max-w-xs z-20">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8 text-secondary" />
                <div>
                  <div className="text-sm text-muted-foreground">Cobertura até</div>
                  <div className="text-2xl font-bold">R$ 1 Milhão</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Com condições especiais para militares
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};