import * as React from "react"
import { cn } from "../lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
  fluid?: boolean // Se true, remove o max-width mas mantém o padding
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, as: Component = "div", fluid = false, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "w-full mx-auto px-6", // Padding lateral base (mobile first)
          !fluid && "container", // Classe 'container' do Tailwind (max-w-7xl centralizado)
          className
        )}
        {...props}
      />
    )
  }
)
Container.displayName = "Container"

export { Container }