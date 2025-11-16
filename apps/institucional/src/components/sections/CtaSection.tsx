import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@goldenbear/ui/components/button';
import { Shield } from 'lucide-react';
import { Section } from '@goldenbear/ui/components/section';
import { Container } from '@goldenbear/ui/components/container';
import { Typography } from '@goldenbear/ui/components/typography';

export const CtaSection = () => {
  return (
    <Section variant="default">
      <Container className="flex flex-col lg:flex-row justify-between items-center">
        
        <div className="w-full lg:w-[480px] relative flex justify-center lg:justify-start items-center gap-2.5 mb-12 lg:mb-0">
          <Image 
            className="w-100%" 
            src="/imagens/celular-com-simulador.png" 
            alt="Contratação digital do seguro"
            width={393}
            height={614}
          />
        </div>
        
        <div className="inline-flex flex-col justify-center items-start gap-10 lg:gap-20">
          <div className="flex flex-col justify-start items-start gap-10">
            <div className="w-full lg:w-96 inline-flex justify-start items-center gap-4">
              <div className="p-2 bg-secondary rounded-lg flex justify-start items-center gap-2.5">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 flex justify-center items-center gap-2.5">
                <Typography variant="body" className="font-medium">
                  Tranquilidade financeira e a segurança que você precisa sem burocracia
                </Typography>
              </div>
            </div>
            <Typography variant="display" color="primary" className="w-full lg:w-[663px]">
              Em menos de 5 minutos um seguro perfeito e pronto para deixar sua família segura
            </Typography>
          </div>
          
          <Button asChild variant="default" size="hero">
            <Link href="/simulador">Simulação Gratuita e Rápida</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
};