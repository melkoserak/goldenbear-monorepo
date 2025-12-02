import { StateCreator } from 'zustand';
import { SimulatorState } from '../useSimulatorStore';

export interface AuthSlice {
  paymentPreAuthCode: string | null;
  reservedProposalNumber: string | null;
  actions: {
    setPaymentPreAuthCode: (code: string | null) => void;
    setReservedProposalNumber: (num: string | null) => void;
    // --- ADICIONADO: Ação de Prefetch ---
    prefetchQuestionnaireTokens: () => Promise<void>;
  };
}

export const createAuthSlice: StateCreator<SimulatorState, [], [], AuthSlice> = (set) => ({
  paymentPreAuthCode: null,
  reservedProposalNumber: null,
  actions: {
    setPaymentPreAuthCode: (code) => set({ paymentPreAuthCode: code }),
    setReservedProposalNumber: (num) => set({ reservedProposalNumber: num }),
    
    // --- IMPLEMENTAÇÃO ---
    prefetchQuestionnaireTokens: async () => {
      try {
        // Faz uma chamada em background para a API de token.
        // O navegador/servidor vai cachear a resposta, tornando o Step 9 instantâneo.
        await fetch('/simulador/api/questionnaire/token', { 
          method: 'POST',
          cache: 'no-store',
          // @ts-ignore - 'priority' é válido em navegadores modernos mas o TS pode reclamar
          priority: 'low' 
        });
      } catch (e) {
        // Erros de prefetch são silenciosos para não atrapalhar o usuário
        console.warn('Prefetch de token falhou (não crítico):', e);
      }
    }
  },
});