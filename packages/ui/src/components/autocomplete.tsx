"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { useDebounce } from "../hooks/useDebounce"

import { cn, removeAccents } from "../lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./command"
import { Input } from "./input"

export type AutocompleteOption = {
  value: string
  label: string
}

// 1. Atualizamos a interface para estender as props do Input
// Omitimos 'value' e 'onChange' porque o Autocomplete lida com eles de forma específica
interface AutocompleteProps extends Omit<React.ComponentPropsWithoutRef<typeof Input>, "value" | "onChange"> {
  options: AutocompleteOption[]
  value?: string
  onChange: (value: string) => void
  emptyText?: string
  isLoading?: boolean
}

export function Autocomplete({
  options,
  value,
  onChange,
  placeholder = "Selecione uma opção...",
  emptyText = "Nenhuma opção encontrada.",
  className,
  isLoading = false,
  ...props // 2. Capturamos as props restantes (id, aria-*, etc.)
}: AutocompleteProps) {
  const [inputValue, setInputValue] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const debouncedInputValue = useDebounce(inputValue, 300);

  React.useEffect(() => {
    const selectedLabel = options.find((option) => option.value === value)?.label
    setInputValue(selectedLabel || "")
  }, [value, options])

  const filteredOptions = React.useMemo(() => {
    const normalizedInput = removeAccents(debouncedInputValue.toLowerCase());
    return options.filter(option => 
      removeAccents(option.label.toLowerCase()).includes(normalizedInput)
    );
  }, [debouncedInputValue, options]);

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value)
          if (!isOpen) setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        placeholder={placeholder}
        className={cn(
            "h-12 px-4 py-3", // Garanta que o h-12 está aqui também para sobrescrever se necessário
            className
        )}
        autoComplete="off"
        disabled={isLoading}
        {...props} // 3. Repassamos as props para o Input interno (Aqui a mágica acontece)
      />

      {isOpen && (
        <div className="absolute top-full z-10 mt-1 w-full rounded-md border bg-white text-card-foreground shadow-md">
          <Command>
            <CommandList>
              {isLoading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">Carregando...</div>
              ) : (
                <>
                  <CommandEmpty>{emptyText}</CommandEmpty>
                  <CommandGroup>
                    {filteredOptions.map((option, index) => (
                      <CommandItem
                        key={`${option.value}-${index}`}
                        onSelect={() => {
                          onChange(option.value)
                          setInputValue(option.label)
                          setIsOpen(false)
                          inputRef.current?.blur()
                        }}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === option.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  )
}