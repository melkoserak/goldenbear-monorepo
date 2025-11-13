import React from "react";
import { cn } from '@goldenbear/ui/lib/utils';
import { Star, Users, Shield } from "lucide-react"; // Ícones do Design System

// Dados dos stats, agora com os ícones corretos
const statsData = [
  {
    id: 1,
    icon: Star,
    boldText: "+15 anos",
    regularText: "de experiência",
  },
  {
    id: 2,
    icon: Users, // Ícone mais apropriado para "Militares Atendidos"
    boldText: "+5mil Militares",
    regularText: "Atendidos",
  },
  {
    id: 3,
    icon: Shield,
    boldText: "+190 anos de mercado",
    regularText: "Seguradora com mais de",
    isReversed: true,
  },
];

export const StatsSection = () => {
  return (
    // Fundo "bg-accent" (tradução de bg-gray-light-background)
    <section className="flex flex-col items-center justify-center gap-2.5 relative bg-accent">
      {/* Container de 1280px do seu Design System */}
      <div className="container w-full justify-between px-6 py-12 flex flex-col md:flex-row items-center gap-8 md:gap-0">
        
        {statsData.map((stat) => {
          const IconComponent = stat.icon;

          return (
            <div
              key={stat.id} 
              className="flex max-w-[348px]  md:w-auto items-center gap-6 relative"
            >
              {/* Ícone com bg-primary (tradução de bg-blue-principal) */}
              <div className={cn(
                "w-12 h-12 justify-center gap-2.5 p-2 rounded-lg overflow-hidden",
                "flex items-center relative flex-shrink-0",
                "bg-primary text-primary-foreground" // Cores do Design System
              )}>
                <IconComponent className="!relative !w-6 !h-6" />
              </div>

              {/* Lógica de texto (Reversed vs. Normal) */}
              {stat.isReversed ? (
                // "Seguradora com mais de +190 anos de mercado"
                <p className="relative text-foreground text-lg leading-tight">
                  <span className="font-medium">{stat.regularText} </span>
                  <span className="font-bold">{stat.boldText}</span>
                </p>
              ) : (
                // "+15 anos de experiência"
                <p className="relative w-fit text-foreground text-lg leading-tight whitespace-nowrap">
                  <span className="font-bold">{stat.boldText}</span>
                  <span className="font-medium"> {stat.regularText}</span>
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};