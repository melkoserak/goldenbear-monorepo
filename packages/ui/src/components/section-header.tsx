// packages/ui/src/components/section-header.tsx
import * as React from 'react';
import { cn } from '../lib/utils';
import { Typography } from './typography';

interface SectionHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  // Nova prop para controlar a tag HTML (padrão 'h2')
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, title, subtitle, as = 'h2', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("w-full max-w-2xl mb-12 lg:mb-16", className)}
        {...props}
      >
        {/* Passamos a prop 'as' para o Typography, que já suporta mudança de tag */}
        <Typography variant="h2" as={as} color="primary">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="large" color="muted" className="mt-4">
            {subtitle}
          </Typography>
        )}
      </div>
    );
  }
);
SectionHeader.displayName = 'SectionHeader';

export { SectionHeader };