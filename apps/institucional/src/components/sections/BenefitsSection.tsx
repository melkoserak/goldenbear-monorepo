import React from 'react';
import Link from 'next/link';
import { Button } from '@goldenbear/ui/components/button';
import { ArrowRight, Shield, HeartPulse, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Section } from '@goldenbear/ui/components/section';
import { Container } from '@goldenbear/ui/components/container';
import { Typography } from '@goldenbear/ui/components/typography';
// 1. Importação do componente Grid
import { Grid } from '@goldenbear/ui/components/grid';

const benefits = [
  { 
    icon: Shield, 
    title: "Morte", 
    description: "Proteção financeira essencial para garantir o padrão de vida da sua família na sua ausência.", 
    linkUrl: "/produtos/seguro-vida-morte"
  },
  { 
    icon: HeartPulse, 
    title: "Doenças Graves", 
    description: "Receba o capital em vida para focar na sua recuperação após o diagnóstico (Câncer, AVC, Infarto e mais).", 
    linkUrl: "/produtos/doencas-graves"
  },
  { 
    icon: ShieldAlert, 
    title: "Invalidez por Acidente", 
    description: "Uma indenização para o seu recomeço e adaptação caso um acidente cause invalidez permanente.", 
    linkUrl: "/produtos/invalidez-acidente"
  },
  { 
    icon: ShieldCheck, 
    title: "Assistência Funeral", 
    description: "Um ato de cuidado que ampara sua família no momento mais difícil, cuidando de toda a burocracia e despesas.", 
    linkUrl: "/produtos/assistencia-funeral"
  }
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

        {/* 2. Substituição pelo componente Grid */}
        <Grid cols={2} gap="lg" align="start">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div 
                key={benefit.title} 
                // Removido 'flex-1 self-stretch' pois o Grid já controla isso
                className="relative w-full p-10 bg-card border border-border rounded-lg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md inline-flex flex-col justify-start items-start gap-6 group"
              >
                <div className="p-2 bg-muted rounded-lg inline-flex justify-start items-center gap-2.5 group-hover:bg-primary/10 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                
                <Typography variant="h4" color="primary" className="group-hover:text-primary/80 transition-colors">
                  {benefit.title}
                </Typography>
                
                <Typography variant="body" color="muted">
                  {benefit.description}
                </Typography>
                
                <div className="p-0 h-auto text-accent-foreground font-medium mt-auto inline-flex items-center group-hover:text-foreground transition-colors">
                  <Link href={benefit.linkUrl} className="outline-none" aria-label={`Saiba mais sobre ${benefit.title}`}>
                    <span className="absolute inset-0 z-10" aria-hidden="true" />
                    <span className="underline underline-offset-4 decoration-transparent text-sm group-hover:decoration-foreground transition-all duration-300">
                      Saiba mais
                    </span>
                  </Link>
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </Grid>

        <Button asChild variant="default" size="hero">
          <Link href="/simulador">Simulação Gratuita e Rápida</Link>
        </Button>
      </Container>
    </Section>
  );
};