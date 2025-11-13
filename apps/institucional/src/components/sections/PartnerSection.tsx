import React from 'react';
import { cn } from '@goldenbear/ui/lib/utils';

// Dados dos stats
const stats = [
  {
    value: "A+",
    label: "Rating S&P"
  },
  {
    value: "+190",
    label: "anos de mercado"
  },
  {
    value: "Top 5",
    label: "seguradora do brasil"
  }
];

export const PartnerSection = () => {
  return (
    // Seção principal com fundo radial azul (o mesmo da Hero)
    <section className={cn(
      "self-stretch w-full py-32 inline-flex flex-col justify-center items-center gap-2.5",
      "bg-primary text-primary-foreground", // Cor base
      "[background:radial-gradient(50%_50%_at_65%_52%,rgba(2,102,232,1)_0%,rgba(0,74,172,1)_100%)]"
    )}>
      {/* Container de 1280px */}
      <div className="container rounded-lg inline-flex flex-col lg:flex-row justify-center items-center gap-10 px-6">
        
        {/* Coluna da Esquerda (Texto) */}
        <div className="flex-1 inline-flex flex-col justify-center items-start gap-8">
          <h2 className="self-stretch text-primary-foreground text-5xl font-bold leading-tight">
            Parceiros Oficiais Mag Seguros
          </h2>
          <p className="self-stretch text-primary-foreground/90 text-base font-normal leading-6 tracking-wide">
            A Mag Seguros é uma das seguradoras mais respeitadas do Brasil, e somos especialistas credenciados com foco exclusivo em atender militares das Forças Armadas.
          </p>
        </div>

        {/* Coluna da Direita (Stats) */}
        <div className="inline-flex flex-col sm:flex-row justify-center items-center gap-4">
          {stats.map((stat) => (
            <div 
              key={stat.label}
              // Cards com o fundo azul mais escuro (primary-hover)
              className="w-52 p-6 bg-primary-hover rounded-lg inline-flex flex-col justify-start items-center gap-2"
            >
              {/* Stat (Amarelo) */}
              <div className="justify-start text-secondary text-5xl font-bold leading-tight">
                {stat.value}
              </div>
              {/* Legenda (Branco) */}
              <div className="justify-start text-primary-foreground text-base font-normal text-center leading-6 tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};