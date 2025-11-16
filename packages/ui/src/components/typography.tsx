import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const typographyVariants = cva(
  "text-foreground transition-colors",
  {
    variants: {
      variant: {
        display: "text-4xl lg:text-5xl font-bold leading-tight tracking-tight",
        h1: "text-4xl font-bold leading-tight tracking-tight",
        h2: "text-3xl font-bold leading-8 tracking-wide",
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