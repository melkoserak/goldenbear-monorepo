"use client";

import { useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { cn } from '@goldenbear/ui/lib/utils';

type FadeInOnScrollProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Atraso em milissegundos
  threshold?: number; // Quanto do item precisa estar visível (0.0 a 1.0)
};

export const FadeInOnScroll = ({
  children,
  className,
  delay = 0,
  threshold = 0.1, // Começa a animação quando 10% do item está visível
}: FadeInOnScrollProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true, // Anima apenas uma vez
    threshold: threshold,
  });

  // Estilo de atraso inline
  const style = {
    transitionDelay: `${delay}ms`,
  };

  return (
    <div
      ref={ref}
      style={style}
      className={cn(
        // Estado inicial: Apenas invisível, sem movimento (corrige CLS)
        "opacity-0",
        // Estado final (visível)
        inView && "opacity-100",
        // Classes de transição (duração e suavização)
        "transition-all duration-700 ease-out",
        className
      )}
    >
      {children}
    </div>
  );
};