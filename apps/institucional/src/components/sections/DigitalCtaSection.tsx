import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@goldenbear/ui/components/button';
import { Section } from '@goldenbear/ui/components/section';
import { Container } from '@goldenbear/ui/components/container';
import { Typography } from '@goldenbear/ui/components/typography';

export const DigitalCtaSection = () => {
  return (
    <Section variant="accent">
      <Container className="flex flex-col lg:flex-row justify-start items-center gap-20">
        
        <div className="w-full lg:w-[680px] relative hidden lg:flex justify-center items-center">
          <Image 
            className="w-full" 
            src="/imagens/familia-foto-segurados.png"
            alt="Contratação digital do seguro"
            width={680}
            height={696}
          />
        </div>

        <div className="flex-1 inline-flex flex-col justify-center items-start gap-10">
          <Typography variant="h3" color="primary">
            Contratação simplificada e digital
          </Typography>
          <Typography variant="body" className="self-stretch">
            Processo rápido, com menos burocracia, adaptado à sua rotina corrida e sem necessidade de exames complexos na maioria dos casos.
          </Typography>
          <Button asChild variant="default" size="hero">
            <Link href="/simulador">Simulação Gratuita e Rápida</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
};