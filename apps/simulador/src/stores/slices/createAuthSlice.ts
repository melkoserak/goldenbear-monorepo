import { StateCreator } from 'zustand';
import { SimulatorState } from '../useSimulatorStore';
// Importe a nova função do serviço
import { reserveProposalNumber, getQuestionnaireToken, getPaymentToken } from '@/services/apiService';

export interface AuthSlice {
  questionnaireToken?: string;
  reservedProposalNumber?: string;
  
  // Novos campos para pagamento
  paymentToken?: string;
  paymentPreAuthCode?: string; // O código de sucesso que o widget retorna
  
  isPrefetchingTokens: boolean;
  isPrefetchingPaymentToken: boolean; // Loading específico do pagamento
  
  // Actions
  prefetchQuestionnaireTokens: () => Promise<void>;
  prefetchPaymentToken: () => Promise<void>;
  setAuthData: (data: Partial<Omit<AuthSlice, 'actions'>>) => void;
}

export const createAuthSlice: StateCreator<SimulatorState, [], [], AuthSlice> = (set, get) => ({
  questionnaireToken: undefined,
  reservedProposalNumber: undefined,
  paymentToken: undefined,
  paymentPreAuthCode: undefined,
  isPrefetchingTokens: false,
  isPrefetchingPaymentToken: false,

  setAuthData: (data) => set((state) => ({ ...state, ...data })),

  prefetchQuestionnaireTokens: async () => {
    if (get().isPrefetchingTokens || get().questionnaireToken) return;
    
    set({ isPrefetchingTokens: true });
    try {
      const { proposalNumber } = await reserveProposalNumber();
      const { token } = await getQuestionnaireToken();
      set({ reservedProposalNumber: proposalNumber, questionnaireToken: token, isPrefetchingTokens: false });
    } catch (error) {
      console.error("[AuthSlice] Erro ao buscar tokens:", error);
      set({ isPrefetchingTokens: false });
    }
  },

  prefetchPaymentToken: async () => {
    if (get().isPrefetchingPaymentToken || get().paymentToken) return;

    set({ isPrefetchingPaymentToken: true });
    try {
      const { token } = await getPaymentToken();
      set({ paymentToken: token, isPrefetchingPaymentToken: false });
    } catch (error) {
      console.error("[AuthSlice] Erro ao buscar token de pagamento:", error);
      set({ isPrefetchingPaymentToken: false });
    }
  },
});