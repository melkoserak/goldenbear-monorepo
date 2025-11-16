import React from 'react';
import Link from 'next/link';
import { Button } from '@goldenbear/ui/components/button';
import { ArrowRight, Shield, HeartPulse, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Section } from '@goldenbear/ui/components/section';
import { Container } from '@goldenbear/ui/components/container';
import { Typography } from '@goldenbear/ui/components/typography';

const benefits = [
  { icon: Shield, title: "Morte", description: "Proteção para gastos inesperados em momentos em que a prioridade é a sua saúde. Cobertura de treze doenças, dentre elas, Câncer, AVC, e mais." },
  { icon: HeartPulse, title: "Doenças Graves", description: "Proteção para gastos inesperados em momentos em que a prioridade é a sua saúde. Cobertura de treze doenças, dentre elas, Câncer, AVC, e mais." },
  { icon: ShieldAlert, title: "Acidente", description: "Proteção para gastos inesperados em momentos em que a prioridade é a sua saúde. Cobertura de treze doenças, dentre elas, Câncer, AVC, e mais." },
  { icon: ShieldCheck, title: "Assistência Funeral", description: "Proteção para gastos inesperados em momentos em que a prioridade é a sua saúde. Cobertura de treze doenças, dentre elas, Câncer, AVC, e mais." }
];

export const BenefitsSection = () => {
  return (
    <Section variant="default">
      <Container className="flex flex-col justify-start items-center gap-10 lg:gap-20">
        
        <div className="self-stretch inline-flex flex-col md:flex-row justify-start items-center gap-6">
          <div className="flex-1 inline-flex flex-col justify-start items-start w-full gap-6">
            <Typography variant="h2" color="primary">
              Quais são os principais <br/>tipos de seguro
            </Typography>
            <Typography variant="h4" className="text-foreground font-medium">
              seus beneficários recebam algum valor<br/>em caso de
            </Typography>
          </div>
          <Typography variant="body" color="muted" className="w-full md:w-80 font-medium">
            Te explicamos tudo passo a passo!
          </Typography>
        </div>

        {/* Grid de Cards */}
        <div className="self-stretch grid grid-cols-1 md:grid-cols-2 justify-start items-start gap-10">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="flex-1 self-stretch p-10 bg-accent rounded-lg border-t-4 border-primary inline-flex flex-col justify-start items-start gap-6">
                <div className="p-2 bg-muted rounded-lg inline-flex justify-start items-center gap-2.5">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <Typography variant="h4" color="primary">
                  {benefit.title}
                </Typography>
                <Typography variant="body" color="muted">
                  {benefit.description}
                </Typography>
                <Button variant="link" asChild className="p-0 h-auto text-zinc-700 font-medium">
                  <Link href="#">Saiba mais <ArrowRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </div>
            );
          })}
        </div>

        <Button asChild variant="default" size="hero">
          <Link href="/simulador">Simulação Gratuita e Rápida</Link>
        </Button>
      </Container>
    </Section>
  );
};