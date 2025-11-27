import React from 'react';
import { cn } from '@goldenbear/ui/lib/utils';

interface StepLayoutProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const StepLayout = ({ 
  title, 
  description, 
  children, 
  className 
}: StepLayoutProps) => {
  return (
    <div className={cn("animate-fade-in w-full", className)}>
      
      {/* Header Padronizado: Controla o espaçamento e tipografia centralmente */}
      <div className="mb-6 md:mb-8 space-y-2">
        <h3 
          tabIndex={-1} 
          className="text-xl md:text-2xl font-medium text-left text-foreground outline-none leading-tight"
        >
          {title}
        </h3>
        
        {description && (
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Área de Conteúdo: Onde entram os inputs dinâmicos */}
      <div className="flex flex-col gap-5 md:gap-6">
        {children}
      </div>
    </div>
  );
};