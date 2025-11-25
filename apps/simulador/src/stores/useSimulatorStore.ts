import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createAuthSlice, AuthSlice } from './slices/createAuthSlice';
import { createFormSlice, FormSlice, FormDataState, Beneficiary, UpdateBeneficiaryData } from './slices/createFormSlice';
import { createUiSlice, UiSlice, ValidationStatus } from './slices/createUiSlice';

// Re-exportar tipos para uso nos componentes
export type { FormDataState, Beneficiary, UpdateBeneficiaryData, ValidationStatus };

// O Estado Global é a união das interfaces
export type SimulatorState = AuthSlice & FormSlice & UiSlice & {
  actions: AuthSlice & Omit<FormSlice, 'formData'> & Omit<UiSlice, 'currentStep' | 'validationStatus'> & {
    reset: () => void;
    hydrateFromStorage: () => void;
  };
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
        
        // Camada de compatibilidade
        actions: {
          ...authSlice,
          ...formSlice,
          ...uiSlice,
          
          reset: () => {
             set({ 
               currentStep: 1, 
               // Usa o initial state dos slices se quiser resetar tudo
               formData: {
                  fullName: "", cpf: "", email: "", phone: "", state: "", consent: false,
                  birthDate: "", gender: "", income: "", profession: "",
                  zipCode: "", street: "", number: "", complement: "", neighborhood: "",
                  city: "", maritalStatus: "", homePhone: "", rgNumber: "", rgIssuer: "",
                  rgDate: "", childrenCount: "0", company: "", isPPE: "",
                  paymentMethod: '', dpsAnswers: undefined,
                  beneficiaries: [{
                    id: 'initial-ben', 
                    fullName: '', rg: '', cpf: '', birthDate: '', relationship: '',
                    legalRepresentative: { fullName: '', rg: '', cpf: '', birthDate: '', relationship: '' }
                  }],
               },
               questionnaireToken: undefined,
               paymentToken: undefined,
               reservedProposalNumber: undefined
             });
             if (typeof window !== 'undefined') {
                localStorage.removeItem('simulator-form-data');
             }
          },
          hydrateFromStorage: () => { }
        }
      };
    },
    {
      name: 'simulator-form-data',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentStep: state.currentStep,
        formData: state.formData, 
      }),
    }
  )
);