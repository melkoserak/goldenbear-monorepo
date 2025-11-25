// apps/simulador/src/stores/slices/createFormSlice.ts
import { StateCreator } from 'zustand';
import { SimulatorState, Beneficiary, UpdateBeneficiaryData } from '../useSimulatorStore';

// Tipos auxiliares (movidos do arquivo original)
export interface FormDataState {
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
  paymentMethod: 'credit' | 'debit' | '';
  dpsAnswers?: Record<string, unknown>;
  beneficiaries: Beneficiary[];
}

export interface FormSlice {
  formData: FormDataState;
  
  // Actions
  setFormData: (data: Partial<FormDataState>) => void;
  addBeneficiary: () => void;
  removeBeneficiary: (id: string) => void;
  updateBeneficiary: (id: string, data: UpdateBeneficiaryData) => void;
  resetDpsAnswers: () => void;
}

const initialFormData: FormDataState = {
  fullName: "", cpf: "", email: "", phone: "", state: "", consent: false,
  birthDate: "", gender: "", income: "", profession: "",
  zipCode: "", street: "", number: "", complement: "", neighborhood: "",
  city: "", maritalStatus: "", homePhone: "", rgNumber: "", rgIssuer: "",
  rgDate: "", childrenCount: "0", company: "", isPPE: "",
  paymentMethod: '', dpsAnswers: undefined,
  beneficiaries: [{
    id: 'initial', // ID fixo para evitar mismatch no SSR/Hydration se usar Date.now()
    fullName: '', rg: '', cpf: '', birthDate: '', relationship: '',
    legalRepresentative: { fullName: '', rg: '', cpf: '', birthDate: '', relationship: '' }
  }],
};

export const createFormSlice: StateCreator<SimulatorState, [], [], FormSlice> = (set) => ({
  formData: initialFormData,

  setFormData: (data) => set((state) => ({ 
    formData: { ...state.formData, ...data } 
  })),

  addBeneficiary: () => set((state) => {
    const newBen: Beneficiary = { 
      id: crypto.randomUUID(), // Melhor que Date.now()
      fullName: '', rg: '', cpf: '', birthDate: '', relationship: '',
      legalRepresentative: { fullName: '', rg: '', cpf: '', birthDate: '', relationship: '' }
    };
    return { formData: { ...state.formData, beneficiaries: [...state.formData.beneficiaries, newBen] } };
  }),

  removeBeneficiary: (id) => set((state) => ({
    formData: { 
      ...state.formData, 
      beneficiaries: state.formData.beneficiaries.filter(b => b.id !== id) 
    }
  })),

  updateBeneficiary: (id, data) => set((state) => ({
    formData: {
      ...state.formData,
      beneficiaries: state.formData.beneficiaries.map(b => 
        b.id === id ? { ...b, ...data, legalRepresentative: { ...b.legalRepresentative, ...data.legalRepresentative } } : b
      )
    }
  })),

  resetDpsAnswers: () => set((state) => ({
    formData: { ...state.formData, dpsAnswers: undefined }
  })),
});