import React from 'react';
import { Section } from '@goldenbear/ui/components/section';
import { Container } from '@goldenbear/ui/components/container';
import { Typography } from '@goldenbear/ui/components/typography';

const stats = [
  { value: "A+", label: "Rating S&P" },
  { value: "+190", label: "anos de mercado" },
  { value: "Top 5", label: "seguradora do brasil" }
];

export const PartnerSection = () => {
  return (
    <Section variant="primary-gradient">
      <Container className="rounded-lg inline-flex flex-col lg:flex-row justify-center items-center gap-10">
        
        <div className="flex-1 inline-flex flex-col justify-center items-start gap-8">
          <Typography variant="display" color="white">
            Parceiros Oficiais Mag Seguros
          </Typography>
          <Typography variant="body" color="white" className="opacity-90">
            A Mag Seguros é uma das seguradoras mais respeitadas do Brasil, e somos especialistas credenciados com foco exclusivo em atender militares das Forças Armadas.
          </Typography>
        </div>

        <div className="inline-flex flex-col sm:flex-row justify-center items-center gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="w-52 p-6 bg-primary-hover rounded-lg inline-flex flex-col justify-start items-center gap-2">
              <Typography variant="display" color="secondary">
                {stat.value}
              </Typography>
              <Typography variant="body" color="white" align="center">
                {stat.label}
              </Typography>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};