// packages/ui/src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
// REMOVA a importação do DOMPurify daqui

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function removeAccents(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function formatCurrency(value: number): string {
  if (isNaN(value)) {
    value = 0;
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// REMOVA as funções stripHtml e sanitizeHtml deste arquivo