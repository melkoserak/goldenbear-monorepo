// apps/simulador/src/stores/slices/createAuthSlice.ts
import { StateCreator } from 'zustand';
import { SimulatorState } from '../useSimulatorStore';
import { reserveProposalNumber, getQuestionnaireToken, getPaymentToken } from '@/services/apiService';

export interface AuthSlice {
  questionnaireToken?: string;
  paymentToken?: string;
  paymentPreAuthCode?: string;
  reservedProposalNumber?: string;
  isPrefetchingTokens: boolean;
  isPrefetchingPaymentToken: boolean;
  
  // Actions
  prefetchQuestionnaireTokens: () => Promise<void>;
  prefetchPaymentToken: () => Promise<void>;
  setAuthData: (data: Partial<Omit<AuthSlice, 'actions'>>) => void;
}

export const createAuthSlice: StateCreator<SimulatorState, [], [], AuthSlice> = (set, get) => ({
  questionnaireToken: undefined,
  paymentToken: undefined,
  paymentPreAuthCode: undefined,
  reservedProposalNumber: undefined,
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