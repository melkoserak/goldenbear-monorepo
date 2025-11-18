// src/stores/useSimulatorStore.ts
import { create } from 'zustand';
import { reserveProposalNumber, getQuestionnaireToken, getPaymentToken } from '@/services/apiService';

// 1. CRIADA UMA TIPAGEM PARA O RESPONSÁVEL LEGAL (CAMPOS SIMILARES)
type LegalRepresentative = {
  fullName: string;
  rg: string;
  cpf: string;
  birthDate: string;
  relationship: string;
};

// Tipagem para um Beneficiário (sem alterações)
export type Beneficiary = {
  id: string;
  fullName: string;
  rg: string;
  cpf: string;
  birthDate: string;
  relationship: string;
  legalRepresentative?: Partial<LegalRepresentative>;
};

// Tipagens de Erro e FormData (sem alterações)
type ValidationStatus = {
  fullNameError: string | null;
  cpfError: string | null;
  emailError: string | null;
  phoneError: string | null;
  stateError: string | null;
  birthDateError: string | null;
  genderError: string | null;
  incomeError: string | null;
  professionError: string | null;
  zipCodeError: string | null;
  streetError: string | null;
  numberError: string | null;
  neighborhoodError: string | null;
  cityError: string | null;
  maritalStatusError: string | null;
  rgNumberError: string | null;
  rgIssuerError: string | null;
  rgDateError: string | null;
  childrenCountError: string | null;
  companyError: string | null;
  isPPEError: string | null;
  beneficiariesError: string | null;
  paymentMethodError: string | null;      // <-- NOVO
};

type FormData = {
  fullName: string;
  cpf: string;
  email: string;
  phone: string;
  state: string;
  consent: boolean;
  birthDate: string;
  gender: string;
  income: string;
  profession: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  maritalStatus: string;
  homePhone: string;
  rgNumber: string;
  rgIssuer: string;
  rgDate: string;
  childrenCount: string;
  company: string;
  isPPE: string;
  beneficiaries: Beneficiary[];
 dpsAnswers?: Record<string, unknown>; // Substitui 'any' por um tipo mais seguro
  reservedProposalNumber?: string;
  questionnaireToken?: string;
  isPrefetchingTokens: boolean;
  paymentToken?: string;
  isPrefetchingPaymentToken: boolean;
  paymentMethod: 'credit' | 'debit' | '';
  paymentPreAuthCode?: string;
};

type UpdateBeneficiaryData = Partial<Omit<Beneficiary, 'id' | 'legalRepresentative'>> & {
  legalRepresentative?: Partial<LegalRepresentative>;
};

type SimulatorState = {
  currentStep: number;
  formData: FormData;
  validationStatus: ValidationStatus;
  // wpNonce: string | null; // <-- REMOVA ESTA LINHA
  actions: {
    nextStep: () => void;
    prevStep: () => void;
    setFormData: (data: Partial<FormData>) => void;
    setValidationStatus: (status: Partial<ValidationStatus>) => void;
    reset: () => void;
    hydrateFromStorage: () => void;
    addBeneficiary: () => void;
    removeBeneficiary: (id: string) => void;
    updateBeneficiary: (id: string, data: UpdateBeneficiaryData) => void;
    resetDpsAnswers: () => void;
    prefetchQuestionnaireTokens: () => Promise<void>;
    prefetchPaymentToken: () => Promise<void>;
    // setWpNonce: (nonce: string | null) => void; // <-- REMOVA ESTA LINHA
    // fetchWpNonce: () => Promise<void>; // <-- REMOVA ESTA LINHA
  }
};

// --- INÍCIO DA CORREÇÃO ---
const initialState: Omit<SimulatorState, 'actions'> = {
  currentStep: 1,
  formData: {
    fullName: "", cpf: "", email: "", phone: "", state: "", consent: false,
    birthDate: "", gender: "", income: "", profession: "",
    zipCode: "", street: "", number: "", complement: "", neighborhood: "",
    city: "", maritalStatus: "", homePhone: "", rgNumber: "", rgIssuer: "",
    rgDate: "", childrenCount: "0", company: "", isPPE: "",
    questionnaireToken: undefined, // <-- Adicionado
    isPrefetchingTokens: false, // <-- Adicionado
    paymentMethod: '',
    paymentPreAuthCode: undefined,
    paymentToken: undefined, // <-- Adicionado
    isPrefetchingPaymentToken: false, // <-- Adicionado
    dpsAnswers: undefined,
    reservedProposalNumber: undefined,
    beneficiaries: [{
      id: Date.now().toString(),
      fullName: '', rg: '', cpf: '', birthDate: '', relationship: '',
      legalRepresentative: { fullName: '', rg: '', cpf: '', birthDate: '', relationship: '' }
    }],
  },
  validationStatus: {
    fullNameError: null, cpfError: null, emailError: null, phoneError: null,
    stateError: null, birthDateError: null, genderError: null, incomeError: null,
    professionError: null, zipCodeError: null, streetError: null, numberError: null,
    neighborhoodError: null, cityError: null, maritalStatusError: null,
    rgNumberError: null, rgIssuerError: null, rgDateError: null,
    childrenCountError: null, companyError: null, isPPEError: null,
    beneficiariesError: null, paymentMethodError: null,
  },
};
// --- FIM DA CORREÇÃO ---

const STORAGE_KEY = 'simulator-form-data';

// URL base da API REST do WordPress (SEU SITE ONLINE)
const WP_API_BASE_URL = 'https://www.goldenbearseguros.com.br/wp-json/mag-simulator/v1';

// A URL base agora é sempre a de produção
const API_BASE_URL = WP_API_BASE_URL;

// A função getApiUrl agora sempre constrói a URL direta
const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};
// --- FIM DA CORREÇÃO DE ESCOPO ---

export const useSimulatorStore = create<SimulatorState>((set, get) => ({ // <-- 'get' é passado aqui
  ...initialState,
  actions: {
    nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
    prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),

    setFormData: (data) => set((state) => {
      const newFormData = { ...state.formData, ...data };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newFormData));
      }
      return { formData: newFormData };
    }),
    
    setValidationStatus: (status) => set((state) => ({ validationStatus: { ...state.validationStatus, ...status } })),
    
    reset: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
      set({ ...initialState, actions: get().actions }); // Reset state, keep actions
    },

    hydrateFromStorage: () => {
      if (typeof window === 'undefined') return;
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          set((state) => ({ formData: { ...state.formData, ...JSON.parse(savedData) } }));
        }
      } catch (error) {
        console.error("Falha ao carregar dados do localStorage", error);
      }
    },

    addBeneficiary: () => set((state) => {
      const newBeneficiary: Beneficiary = { 
        id: Date.now().toString(), 
        fullName: '', rg: '', cpf: '', birthDate: '', relationship: '',
        legalRepresentative: { fullName: '', rg: '', cpf: '', birthDate: '', relationship: '' }
      };
      const newFormData = { ...state.formData, beneficiaries: [...state.formData.beneficiaries, newBeneficiary] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFormData));
      return { formData: newFormData };
    }),

    removeBeneficiary: (id) => set((state) => {
      const newBeneficiaries = state.formData.beneficiaries.filter(b => b.id !== id);
      const newFormData = { ...state.formData, beneficiaries: newBeneficiaries };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFormData));
      return { formData: newFormData };
    }),
    
    updateBeneficiary: (id, data) => set((state) => {
      const newBeneficiaries = state.formData.beneficiaries.map(b => {
        if (b.id === id) {
          const updatedBeneficiary = { ...b, ...data };
          if (data.legalRepresentative) {
            updatedBeneficiary.legalRepresentative = {
              ...(b.legalRepresentative as LegalRepresentative),
              ...data.legalRepresentative
            };
          }
          return updatedBeneficiary;
        }
        return b;
      });
      const newFormData = { ...state.formData, beneficiaries: newBeneficiaries };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFormData));
      return { formData: newFormData };
    }),


    resetDpsAnswers: () => set((state) => {
      const newFormData = { ...state.formData, dpsAnswers: undefined };
      // Atualiza também o localStorage para remover as respostas salvas
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newFormData));
      }
      return { formData: newFormData };
    }),
// --- 4. ADICIONAR LÓGICA DE PREFETCHING ---
    prefetchQuestionnaireTokens: async () => {
      // Evita múltiplas chamadas
      if (get().formData.isPrefetchingTokens || get().formData.questionnaireToken) {
        return;
      }

      set((state) => ({ formData: { ...state.formData, isPrefetchingTokens: true } }));
      
      try {
        console.log("[Prefetch] Iniciando busca de tokens...");
        const { proposalNumber } = await reserveProposalNumber();
        const { token } = await getQuestionnaireToken();
        
        set((state) => ({
          formData: {
            ...state.formData,
            reservedProposalNumber: proposalNumber,
            questionnaireToken: token,
            isPrefetchingTokens: false,
          }
        }));
        console.log("[Prefetch] Tokens armazenados no estado.");
      } catch (error) {
        console.error("[Prefetch] Falha ao buscar tokens:", error);
        set((state) => ({ formData: { ...state.formData, isPrefetchingTokens: false } }));
      }
    },

    
  // --- 4. IMPLEMENTAR A NOVA AÇÃO ---
    prefetchPaymentToken: async () => {
      if (get().formData.isPrefetchingPaymentToken || get().formData.paymentToken) {
        return; // Já buscou ou está a buscar
      }

      set((state) => ({ formData: { ...state.formData, isPrefetchingPaymentToken: true } }));
      
      try {
        console.log("[Prefetch] Iniciando busca de Payment Token...");
        const { token } = await getPaymentToken();
        
        set((state) => ({
          formData: {
            ...state.formData,
            paymentToken: token,
            isPrefetchingPaymentToken: false,
          }
        }));
        console.log("[Prefetch] Payment Token armazenado no estado.");
      } catch (error) {
        console.error("[Prefetch] Falha ao buscar Payment Token:", error);
        set((state) => ({ formData: { ...state.formData, isPrefetchingPaymentToken: false } }));
      }
    },
  }
}));