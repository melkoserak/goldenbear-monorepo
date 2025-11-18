import * as React from "react"

import { cn } from "../lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        // ADICIONE: 'transition-all duration-200'
        "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-all duration-200",
        "placeholder:text-muted-foreground",
        "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "min-h-[120px]",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }