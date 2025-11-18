import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const typographyVariants = cva(
  "text-foreground transition-colors",
  {
    variants: {
      variant: {
        // --- ALTERAÇÃO AQUI: Tipografia Fluida com clamp() ---
        
        // Display: De 2.25rem (36px) a 3.75rem (60px)
        display: "text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-tight tracking-tight",
        
        // H1: De 2rem (32px) a 3rem (48px)
        h1: "text-[clamp(2rem,4vw,3rem)] font-bold leading-tight tracking-tight",
        
        // H2: De 1.5rem (24px) a 2.25rem (36px)
        h2: "text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-snug tracking-wide",
        
        // Mantemos os menores com tamanhos fixos ou responsivos simples para leitura
        h3: "text-2xl font-bold leading-snug tracking-wide",
        h4: "text-xl font-medium leading-7 tracking-wide",
        large: "text-lg font-medium leading-relaxed",
        body: "text-base font-normal leading-6 tracking-wide",
        small: "text-sm font-medium leading-5 tracking-wide",
        muted: "text-sm text-muted-foreground",
      },
      color: {
        default: "text-inherit", // Alterado para herdar ou usar classe base
        primary: "text-primary",
        secondary: "text-secondary",
        muted: "text-muted-foreground",
        white: "text-white",
        accent: "text-accent-foreground",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      }
    },
    defaultVariants: {
      variant: "body",
      color: "default",
      align: "left",
    },
  }
)

// --- AQUI ESTÁ A CORREÇÃO PRINCIPAL ---
// Usamos Omit<..., "color"> para remover a propriedade 'color' nativa do HTML
// e permitir que nossa variante 'color' assuma o controle sem conflitos.
export interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, color, align, as, ...props }, ref) => {
    
    const defaultTags: Record<string, React.ElementType> = {
      display: "h1",
      h1: "h1",
      h2: "h2",
      h3: "h3",
      h4: "h4",
      large: "p",
      body: "p",
      small: "span",
      muted: "span"
    }

    const Component = as || (variant ? defaultTags[variant] : "p") || "p"

    return (
      <Component
        className={cn(typographyVariants({ variant, color, align, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Typography.displayName = "Typography"

export { Typography, typographyVariants }