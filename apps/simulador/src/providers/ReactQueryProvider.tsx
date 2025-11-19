"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Configurações globais para evitar refetching excessivo
        staleTime: 1000 * 60 * 5, // Dados considerados "frescos" por 5 minutos
        retry: 1, // Tenta novamente 1 vez em caso de erro
        refetchOnWindowFocus: false, // Não recarrega ao trocar de aba
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};