import * as React from 'react';
import { cn } from '../lib/utils';
import { Typography } from './typography';

// --- CORREÇÃO AQUI ---
// Usamos Omit<..., 'title'> para remover a prop 'title' nativa do HTML
interface SectionHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * O título principal (H2) da seção.
   */
  title: React.ReactNode;
  /**
   * O subtítulo (parágrafo) opcional abaixo do título.
   */
  subtitle?: React.ReactNode;
}

/**
 * Componente padronizado para cabeçalhos de seção,
 * com alinhamento à esquerda e espaçamento inferior.
 */
const SectionHeader = React.forwardRef<
  HTMLDivElement,
  SectionHeaderProps
>(({ className, title, subtitle, ...props }, ref) => {
  return (
    <div
      ref={ref}
      // Padrão de espaçamento (mb) e max-w para legibilidade
      // Sempre alinhado à esquerda, conforme sua diretiva.
      className={cn("w-full max-w-2xl mb-12 lg:mb-16", className)}
      {...props}
    >
      <Typography variant="h2" color="primary">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="large" color="muted" className="mt-4">
          {subtitle}
        </Typography>
      )}
    </div>
  );
});
SectionHeader.displayName = 'SectionHeader';

export { SectionHeader };