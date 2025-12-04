import * as React from "react"
import { cn } from "../lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-md border border-input px-3 py-2 text-sm transition-all duration-200",
          // MUDANÇA AQUI: 
          // Light mode: bg-background (branco)
          // Dark mode: bg-transparent (assume a cor do card) ou bg-secondary/10
          "bg-background dark:bg-zinc-950/50", 
          "placeholder:text-muted-foreground",
          "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }