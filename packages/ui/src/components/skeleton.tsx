import { cn } from "../lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted", // Usa o nosso token --muted
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }