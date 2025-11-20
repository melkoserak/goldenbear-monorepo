import * as React from 'react';
import { cn } from '../lib/utils';
import { Typography } from './typography';

// Interface estendendo HTMLAttributes, removendo 'title' nativo para usar o nosso
interface FeatureCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  icon: React.ElementType;
  title: React.ReactNode;
}

const FeatureCard = React.forwardRef<
  HTMLDivElement,
  FeatureCardProps
>(({ className, icon: Icon, title, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        // Classes base do container
        "flex-1 self-stretch p-8 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow",
        // Layout flex vertical para alinhar ícone, título e conteúdo
        "inline-flex flex-col justify-start items-start gap-6",
        className
      )}
      {...props}
    >
      {/* Container do Ícone */}
      <div className="p-2 bg-muted rounded-lg inline-flex justify-start items-center gap-2.5">
        <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
      </div>

      {/* Título */}
      <Typography variant="h4" color="primary">
        {title}
      </Typography>

      {/* Conteúdo Principal (Descrição + Link) */}
      {/* CORREÇÃO APLICADA:
          1. `as="div"`: Renderiza como div em vez de p para permitir blocos filhos (links).
          2. `flex-1`: Ocupa todo o espaço vertical disponível.
          3. `flex flex-col`: Permite que os filhos usem mt-auto.
          4. `w-full`: Garante largura total.
      */}
      <Typography 
        variant="body" 
        color="muted" 
        as="div" 
        className="flex-1 flex flex-col w-full"
      >
        {children}
      </Typography>
    </div>
  );
});
FeatureCard.displayName = 'FeatureCard';

export { FeatureCard };