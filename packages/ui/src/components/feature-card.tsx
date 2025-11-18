import * as React from 'react';
import { cn } from '../lib/utils';
import { Typography } from './typography';

// Omit<..., 'title'> já está aqui da nossa correção anterior
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
        "flex-1 self-stretch p-8 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow",
        "inline-flex flex-col justify-start items-start gap-6", // flex-col
        className
      )}
      {...props}
    >
      {/* Ícone */}
      <div className="p-2 bg-muted rounded-lg inline-flex justify-start items-center gap-2.5">
        <Icon className="w-6 h-6 text-primary" />
      </div>

      {/* Título */}
      <Typography variant="h4" color="primary">
        {title}
      </Typography>

      {/* --- CORREÇÃO APLICADA AQUI --- */}
      {/* Adicionamos 'flex flex-col w-full' para garantir que o 'flex-1' funcione
        e que o 'mt-auto' no Link (filho) possa empurrar-se para o fundo.
      */}
      <Typography variant="body" color="muted" as="div" className="flex-1 flex flex-col w-full">
        {children}
      </Typography>
    </div>
  );
});
FeatureCard.displayName = 'FeatureCard';

export { FeatureCard };