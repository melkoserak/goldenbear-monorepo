import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createAuthSlice, AuthSlice } from './slices/createAuthSlice';
import { createFormSlice, FormSlice, initialFormData } from './slices/createFormSlice';
import { createUiSlice, UiSlice } from './slices/createUiSlice';

// Combinação de tipos: OMITIMOS 'actions' individuais para redefini-las no objeto combinado
// Isso evita conflitos de tipo e o erro "Property actions does not exist"
export type SimulatorState = 
  Omit<AuthSlice, 'actions'> & 
  Omit<FormSlice, 'actions'> & 
  Omit<UiSlice, 'actions'> & {
    actions: AuthSlice['actions'] & FormSlice['actions'] & UiSlice['actions'] & {
      reset: () => void;
      hydrateFromStorage: () => void;
      initialize: () => void;
    };
    isInitialized: boolean;
    // Garantir que aceitam null
    paymentPreAuthCode: string | null;
    reservedProposalNumber: string | null;
  };

export const useSimulatorStore = create<SimulatorState>()(
  persist(
    (set, get, api) => ({
      // Estado Inicial (Spread dos slices)
      ...createAuthSlice(set, get, api),
      ...createFormSlice(set, get, api),
      ...createUiSlice(set, get, api),
      
      isInitialized: false,
      // Redundância necessária para o TS entender o tipo inicial
      paymentPreAuthCode: null, 
      reservedProposalNumber: null,

      // Actions Combinadas
      actions: {
        ...createAuthSlice(set, get, api).actions,
        ...createFormSlice(set, get, api).actions,
        ...createUiSlice(set, get, api).actions,

        reset: () => {
          set({
            currentStep: 1,
            formData: initialFormData,
            paymentPreAuthCode: null,
            reservedProposalNumber: null,
          });
          if (typeof window !== 'undefined') {
            localStorage.removeItem('goldenbear-coverage-storage');
          }
        },

        hydrateFromStorage: () => {
          const stored = localStorage.getItem('simulator-storage');
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              // Validar se o estado salvo tem a forma esperada
              if (parsed && parsed.state) {
                set(parsed.state);
              }
            } catch (e) {
              console.error("Erro ao hidratar store:", e);
            }
          }
        },

        initialize: () => {
          set({ isInitialized: true });
        }
      },
    }),
    {
      name: 'simulator-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        formData: state.formData,
        currentStep: state.currentStep,
        paymentPreAuthCode: state.paymentPreAuthCode,
        reservedProposalNumber: state.reservedProposalNumber,
      }),
    }
  )
);