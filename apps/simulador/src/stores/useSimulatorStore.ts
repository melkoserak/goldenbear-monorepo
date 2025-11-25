// apps/simulador/src/stores/useSimulatorStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createAuthSlice, AuthSlice } from './slices/createAuthSlice';
import { createFormSlice, FormSlice, FormDataState } from './slices/createFormSlice';
import { createUiSlice, UiSlice } from './slices/createUiSlice';

// Exportamos os tipos para uso nos componentes
export type { FormDataState }; // Re-export
// Definição local de Beneficiary para compatibilidade ou importe do slice se preferir
export type Beneficiary = {
  id: string;
  fullName: string;
  rg: string;
  cpf: string;
  birthDate: string;
  relationship: string;
  legalRepresentative?: {
    fullName?: string;
    cpf?: string;
    rg?: string;
    birthDate?: string;
    relationship?: string;
  };
};
// Helper para update (compatibilidade)
export type UpdateBeneficiaryData = Partial<Beneficiary>;

// O Estado Global é a união das interfaces
export type SimulatorState = AuthSlice & FormSlice & UiSlice & {
  actions: AuthSlice & Omit<FormSlice, 'formData'> & Omit<UiSlice, 'currentStep' | 'validationStatus'>;
  // Nota: Mantivemos 'actions' separado por compatibilidade com seus componentes atuais
  // que chamam useSimulatorStore(state => state.actions.metodo)
};

export const useSimulatorStore = create<SimulatorState>()(
  persist(
    (set, get, api) => {
      // Inicializa os slices
      const authSlice = createAuthSlice(set, get, api);
      const formSlice = createFormSlice(set, get, api);
      const uiSlice = createUiSlice(set, get, api);

      return {
        ...authSlice,
        ...formSlice,
        ...uiSlice,
        
        // Camada de compatibilidade para manter a estrutura `state.actions.metodo`
        // que seus componentes já usam.
        actions: {
          ...authSlice, // Métodos de Auth
          ...formSlice, // Métodos de Form (exceto o objeto formData)
          ...uiSlice,   // Métodos de UI
          
          // Métodos wrapper se necessário (ex: reset total)
          reset: () => {
             set({ 
               currentStep: 1, 
               // Reinicia formData usando o initial do formSlice se quiser, 
               // ou limpa manualmente. O persist lidará com o storage.
               formData: formSlice.formData 
             });
             if (typeof window !== 'undefined') {
                localStorage.removeItem('simulator-form-data');
             }
          },
          hydrateFromStorage: () => { /* Automático pelo persist */ }
        }
      };
    },
    {
      name: 'simulator-form-data',
      storage: createJSONStorage(() => localStorage),
      // Segurança (Fase 2 aplicada aqui)
      partialize: (state) => ({
        currentStep: state.currentStep,
        formData: state.formData, // AuthSlice NÃO é salvo
      }),
    }
  )
);