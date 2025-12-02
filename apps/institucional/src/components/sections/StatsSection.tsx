import React from "react";
import { cn } from '@goldenbear/ui/lib/utils';
import { Star, Users, Shield } from "lucide-react";
import { Section } from '@goldenbear/ui/components/section';
import { Container } from '@goldenbear/ui/components/container';
import { Typography } from '@goldenbear/ui/components/typography';
// 1. Importação do Grid
import { Grid } from '@goldenbear/ui/components/grid';

const statsData = [
  { id: 1, icon: Star, boldText: "+15 anos", regularText: "de experiência" },
  { id: 2, icon: Users, boldText: "+5mil Militares", regularText: "Atendidos" },
  { id: 3, icon: Shield, boldText: "+190 anos de mercado", regularText: "Seguradora com mais de", isReversed: true },
];

export const StatsSection = () => {
  return (
    <Section variant="accent" padding="sm">
      <Container>
        {/* 2. Substituição por Grid
          - cols={3}: Cria layout responsivo (1->2->3 colunas)
          - gap="lg": Garante espaçamento consistente do design system
          - align="center": Centraliza os itens verticalmente nas células
        */}
        <Grid cols={3} gap="lg" align="center">
          {statsData.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.id} className="flex w-full items-center gap-6 relative justify-start lg:justify-center">
                <div className={cn(
                  "w-12 h-12 justify-center gap-2.5 p-2 rounded-lg overflow-hidden flex items-center relative flex-shrink-0",
                  "bg-primary text-primary-foreground shadow-sm"
                )}>
                  <IconComponent className="!relative !w-6 !h-6" />
                </div>
                
                {/* Tipografia Padronizada */}
                <div className="flex flex-col">
                  {stat.isReversed ? (
                    <Typography variant="large" className="leading-tight">
                      <span className="font-medium block md:inline">{stat.regularText} </span>
                      <span className="font-bold">{stat.boldText}</span>
                    </Typography>
                  ) : (
                    <Typography variant="large" className="w-fit leading-tight">
                      <span className="font-bold block md:inline">{stat.boldText}</span>
                      <span className="font-medium"> {stat.regularText}</span>
                    </Typography>
                  )}
                </div>
              </div>
            );
          })}
        </Grid>
      </Container>
    </Section>
  );
};