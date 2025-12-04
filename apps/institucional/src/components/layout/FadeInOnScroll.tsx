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
  threshold = 0.1,
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
        "opacity-0 transition-all duration-700 ease-out",
        // CLS Fix: Garante que o elemento ocupe espaço mesmo invisível ou use min-h
        // A11y: Desativa animação se o usuário preferir movimento reduzido
        "motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:transform-none", 
        inView && "opacity-100",
        className
      )}
    >
      {children}
    </div>
  );
};