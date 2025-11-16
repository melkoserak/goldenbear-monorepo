import React from "react";
import { cn } from '@goldenbear/ui/lib/utils';
import { Star, Users, Shield } from "lucide-react";
import { Section } from '@goldenbear/ui/components/section';
import { Container } from '@goldenbear/ui/components/container';
import { Typography } from '@goldenbear/ui/components/typography';

const statsData = [
  { id: 1, icon: Star, boldText: "+15 anos", regularText: "de experiência" },
  { id: 2, icon: Users, boldText: "+5mil Militares", regularText: "Atendidos" },
  { id: 3, icon: Shield, boldText: "+190 anos de mercado", regularText: "Seguradora com mais de", isReversed: true },
];

export const StatsSection = () => {
  return (
    <Section variant="accent" padding="sm">
      <Container className="flex flex-col md:flex-row justify-between items-left lg:items-center gap-8 ">
        {statsData.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div key={stat.id} className="flex max-w-[348px] md:w-auto items-center gap-6 relative">
              <div className={cn(
                "w-12 h-12 justify-center gap-2.5 p-2 rounded-lg overflow-hidden flex items-center relative flex-shrink-0",
                "bg-primary text-primary-foreground"
              )}>
                <IconComponent className="!relative !w-6 !h-6" />
              </div>
              
              {/* Tipografia Padronizada */}
              {stat.isReversed ? (
                <Typography variant="large" className="leading-tight">
                  <span className="font-medium">{stat.regularText} </span>
                  <span className="font-bold">{stat.boldText}</span>
                </Typography>
              ) : (
                <Typography variant="large" className="w-fit leading-tight whitespace-nowrap">
                  <span className="font-bold">{stat.boldText}</span>
                  <span className="font-medium"> {stat.regularText}</span>
                </Typography>
              )}
            </div>
          );
        })}
      </Container>
    </Section>
  );
};