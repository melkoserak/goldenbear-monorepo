"use client"

import * as React from "react" // <-- CORREÇÃO DO ERRO DE DIGITAÇÃO
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils"

const labelVariants = cva(
  // Estilos do ShadCN/UI para Label, usando nossos tokens
  "text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      color: {
        default: "text-foreground", // Usa nosso token --foreground
        muted: "text-muted-foreground",
      },
    },
    defaultVariants: {
      color: "default",
    },
  }
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, color, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ color, className }))}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }