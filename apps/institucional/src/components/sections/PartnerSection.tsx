"use client";

import React, { useState } from 'react';
import { Section } from '@goldenbear/ui/components/section';
import { Container } from '@goldenbear/ui/components/container';
import { Typography } from '@goldenbear/ui/components/typography';
import { cn } from '@goldenbear/ui/lib/utils';
import { ChevronDown } from 'lucide-react';

// Dados enriquecidos (Mantidos)
const stats = [
  { 
    value: "A+", 
    label: "Rating S&P", 
    description: "Classificação máxima de solidez financeira pela Standard & Poor's. Segurança total de que sua indenização será paga."
  },
  { 
    value: "+190", 
    label: "anos de mercado", 
    description: "Desde 1835 cuidando de vidas. A MAG Seguros atravessou séculos de história com solidez inabalável."
  },
  { 
    value: "Top 5", 
    label: "seguradora do brasil", 
    description: "Entre as 5 maiores independentes do país em Vida e Previdência, reconhecida pela excelência no atendimento."
  }
];

const StatCard = ({ stat }: { stat: typeof stats[0] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={cn(
        // Layout Base
        "relative w-full sm:w-64 p-6 rounded-lg transition-all duration-500 ease-out",
        "bg-primary-hover flex flex-col justify-start items-center",
        // Desktop Hover: Aumenta sombra, sobe levemente e ativa o grupo
        "hover:shadow-xl md:hover:-translate-y-1 group cursor-default md:cursor-help",
        // Mobile Active: Feedback de toque
        "active:scale-[0.98]"
      )}
      // Ação apenas no mobile
      onClick={() => setIsOpen(!isOpen)}
    >
      
      {/* --- CONTEÚDO PRINCIPAL (Fixo) --- */}
      <div className="flex flex-col items-center gap-2 w-full z-10">
        <Typography variant="display" color="secondary" className="leading-none">
          {stat.value}
        </Typography>
        <Typography variant="body" color="white" align="center" className="font-medium leading-tight">
          {stat.label}
        </Typography>
      </div>

      {/* --- CONTEÚDO EXPANSÍVEL (Descrição) --- */}
      <div className={cn(
        "w-full overflow-hidden transition-all duration-500 ease-out",
        // Mobile: Controlado pelo State 'isOpen'
        "md:max-h-0 md:opacity-0 md:mt-0", // Reset para desktop base
        isOpen ? "max-h-48 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0",
        
        // Desktop: Controlado pelo 'group-hover'
        // Sobrepõe as classes mobile quando em tela md+
        "md:group-hover:max-h-48 md:group-hover:opacity-100 md:group-hover:mt-4"
      )}>
        <div className="h-px w-full bg-white/20 mb-3" /> {/* Linha separadora suave */}
        <Typography variant="body" color="white" className="text-sm leading-relaxed text-center">
          {stat.description}
        </Typography>
      </div>

      {/* --- BOTÃO "SAIBA MAIS" (Apenas Mobile) --- */}
      <div className={cn(
        "md:hidden mt-4 flex items-center gap-2 text-white transition-all duration-300",
      )}>
        <span className="text-[10px] font-bold uppercase tracking-widest">Saiba mais</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isOpen && "rotate-180")} />
      </div>

    </div>
  );
};

export const PartnerSection = () => {
  return (
    <Section variant="primary-gradient">
      <Container className="rounded-lg flex flex-col lg:flex-row justify-center items-center gap-10">
        
        {/* Texto Introdutório */}
        <div className="flex-1 flex flex-col justify-center items-start gap-8 w-full lg:w-auto">
          <Typography variant="display" color="white">
            Parceiros Oficiais Mag Seguros
          </Typography>
          <Typography variant="body" color="white" className="opacity-90 text-lg">
            A MAG Seguros é uma das seguradoras mais respeitadas do Brasil, e somos especialistas credenciados com foco exclusivo em atender militares das Forças Armadas.
          </Typography>
        </div>

        {/* Cards Grid */}
        {/* 'items-start' no desktop para que os cards cresçam individualmente sem afetar o layout inteiro drasticamente, 
            ou 'items-stretch' se quiser que todos cresçam juntos (o que pode ficar estranho com conteúdo vazio).
            Optei por 'items-start' dentro de um container flex row para comportamento natural de "Accordion Horizontal". 
        */}
        <div className="flex flex-col sm:flex-row justify-center items-start gap-4 w-full lg:w-auto">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </Container>
    </Section>
  );
};