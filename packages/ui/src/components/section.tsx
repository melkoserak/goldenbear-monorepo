import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const sectionVariants = cva(
  "w-full flex flex-col items-center justify-center relative overflow-hidden", 
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        accent: "bg-accent text-accent-foreground",
        primary: "bg-primary text-primary-foreground",
        "primary-gradient": "bg-primary text-primary-foreground [background:radial-gradient(50%_50%_at_65%_52%,rgba(2,102,232,1)_0%,rgba(0,74,172,1)_100%)]",
      },
      padding: {
        none: "py-0",
        sm: "py-12 md:py-16",
        default: "py-16 md:py-28", // Padrão atual aproximado
        lg: "py-32", // Seu padrão de 128px
        hero: "pt-32 pb-40", // Especial para Hero
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
)

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: React.ElementType
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, variant, padding, as: Component = "section", ...props }, ref) => {
    return (
      <Component
        className={cn(sectionVariants({ variant, padding, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Section.displayName = "Section"

export { Section, sectionVariants }