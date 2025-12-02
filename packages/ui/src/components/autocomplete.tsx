"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";

export interface AutocompleteProps {
  options: { value: string; label: string }[];
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function Autocomplete({ 
  options, 
  placeholder = "Selecione...", 
  value, 
  onChange, 
  disabled, 
  className,
  emptyMessage = "Nenhum resultado encontrado.",
  isLoading = false
}: AutocompleteProps) {
  const [open, setOpen] = React.useState(false);

  // Garante que selectedLabel nunca seja undefined
  const selectedLabel = React.useMemo(() => {
    return options.find((option) => option.value === value)?.label || "";
  }, [options, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled || isLoading}
        >
          {value ? selectedLabel : placeholder}
          
          {isLoading ? (
            <Loader2 className="ml-2 h-4 w-4 animate-spin opacity-50" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label} // Usa label para busca
                  onSelect={() => {
                    onChange(option.value); // Retorna o ID/CBO
                    setOpen(false);
                  }}
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
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}