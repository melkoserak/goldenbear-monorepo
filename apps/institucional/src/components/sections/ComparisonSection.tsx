import React from 'react';
import Link from 'next/link';
import { Check, X, ArrowRight } from 'lucide-react';
import { Section } from '@goldenbear/ui/components/section';
import { Container } from '@goldenbear/ui/components/container';
import { Typography } from '@goldenbear/ui/components/typography';
import { Button } from '@goldenbear/ui/components/button';
import { cn } from '@goldenbear/ui/lib/utils';
import { FadeInOnScroll } from '@/components/layout/FadeInOnScroll';

// Dados do comparativo
const comparisonData = [
  {
    feature: "Cobertura",
    market: "Muitas vezes limitada a morte natural.",
    golden: "Morte, Invalidez, Doenças Graves e Funeral."
  },
  {
    feature: "Atualização de Preço",
    market: "Reajuste anual por idade (fica caro rápido).",
    golden: "Reenquadramento apenas a cada 5 anos."
  },
  {
    feature: "Burocracia",
    market: "Exames médicos e papelada física.",
    golden: "100% Digital, DPS online simplificada."
  },
  {
    feature: "Atendimento",
    market: "Call center genérico.",
    golden: "Especialistas em legislação militar."
  },
  {
    feature: "Capital Segurado",
    market: "Valores baixos pré-fixados.",
    golden: "Até R$ 1 Milhão (personalizável)."
  }
];

export const ComparisonSection = () => {
  return (
    <Section variant="default" className="overflow-visible bg-primary">
      <Container>
        <FadeInOnScroll>
          <div className="text-left mb-16 mx-auto">
            <Typography variant="h2" color="white" className="mb-4 max-w-[474px]">
              Por que somos a escolha nº 1 dos militares?
            </Typography>
            <Typography variant="body" color="white" className='max-w-[474px]'>
              Não somos apenas mais um seguro. Somos especialistas na sua carreira.
              Compare e veja a diferença.
            </Typography>
          </div>
        </FadeInOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Card: O Mercado (O "Vilão") */}
          <FadeInOnScroll delay={100} className="h-full">
            <div className="h-full p-8 rounded-2xl border border-border bg-slate-100 flex flex-col opacity-100 hover:opacity-100 transition-opacity">
              <div className="mb-8 pb-6 border-b border-border">
                <Typography variant="h3" className="text-muted-foreground">
                  Bancos e Associações
                </Typography>
                <Typography variant="small" className="text-muted-foreground mt-2">
                  Soluções genéricas e burocráticas
                </Typography>
              </div>

              <ul className="space-y-6 flex-1">
                {comparisonData.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-1 min-w-[24px]">
                      <X className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                    <div>
                      <Typography variant="small" className="font-bold text-muted-foreground mb-0.5">
                        {item.feature}
                      </Typography>
                      <Typography variant="body" className="text-muted-foreground text-sm leading-snug">
                        {item.market}
                      </Typography>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </FadeInOnScroll>

          {/* Card: Golden Bear (O "Herói") */}
          <FadeInOnScroll delay={300} className="h-full relative">
             {/* Elemento decorativo de fundo (Glow) */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-20" />
            
            <div className="relative h-full p-8 rounded-2xl border border-primary/20 bg-card shadow-xl flex flex-col">
              {/* Badge de Destaque */}
              <div className="absolute top-0 right-0 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                RECOMENDADO
              </div>

              <div className="mb-8 pb-6 border-b border-primary/10">
                <Typography variant="h3" color="primary">
                  Golden Bear
                </Typography>
                <Typography variant="small" color="muted" className="mt-2">
                  Com a solidez da MAG Seguros
                </Typography>
              </div>

              <ul className="space-y-6 flex-1">
                {comparisonData.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-1 min-w-[24px] p-0.5 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" strokeWidth={3} />
                    </div>
                    <div>
                      <Typography variant="small" color="primary" className="font-bold mb-0.5">
                        {item.feature}
                      </Typography>
                      <Typography variant="body" className="text-sm font-medium leading-snug">
                        {item.golden}
                      </Typography>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-10 pt-6 border-t border-primary/10">
                <Button asChild size="lg" className="w-full shadow-lg shadow-primary/20">
                  <Link href="/simulador">
                    Quero a melhor proteção <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Typography variant="small" color="muted" align="center" className="block mt-4 text-xs">
                  Simulação gratuita • Sem compromisso
                </Typography>
              </div>
            </div>
          </FadeInOnScroll>

        </div>
      </Container>
    </Section>
  );
};