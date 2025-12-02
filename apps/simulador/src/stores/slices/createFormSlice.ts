import { StateCreator } from 'zustand';
import { SimulatorState } from '../useSimulatorStore';

export interface Beneficiary {
  id: string;
  fullName: string;
  birthDate: string;
  relationship: string;
  percentage: number;
  cpf: string; 
  rg: string;  
  
  legalRepresentative?: {
    fullName: string;
    cpf: string;
    rg?: string;
    birthDate?: string;
    relationship?: string;
  };
}

export type PaymentType = 'CREDIT_CARD' | 'DEBIT_ACCOUNT' | 'PAYROLL_DEDUCTION';

export interface PaymentData {
  method: PaymentType | '';
  creditCard?: {
    number: string;
    holderName: string;
    expirationDate: string;
    cvv: string;
    brand?: string;
  };
  debitAccount?: {
    bankCode: string;
    agency: string;
    accountNumber: string;
    accountDigit: string;
  };
  payroll?: {
    registrationNumber: string;
    orgCode: string;
  };
}

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
  
  isPPE: boolean;
  childrenCount: number;
  company: string;
  
  payment: PaymentData;
  signatureToken?: string;
  
  beneficiaries: Beneficiary[];
  
  dpsAnswers?: Record<string, { value: string; optionId?: number }>;
  questionnaireOriginalData?: any;
}

export interface FormSlice {
  formData: FormDataState;
  actions: {
    setFormData: (data: Partial<FormDataState>) => void;
    setPaymentData: (data: Partial<PaymentData>) => void;
    addBeneficiary: () => void;
    removeBeneficiary: (id: string) => void;
    updateBeneficiary: (id: string, data: Partial<Beneficiary>) => void;
    setBeneficiaries: (data: Beneficiary[]) => void;
  };
}

export const initialFormData: FormDataState = {
  fullName: "", cpf: "", email: "", phone: "", state: "", consent: false,
  birthDate: "", gender: "", income: "", profession: "",
  zipCode: "", street: "", number: "", complement: "", neighborhood: "", city: "",
  maritalStatus: "", homePhone: "",
  rgNumber: "", rgIssuer: "", rgDate: "",
  
  isPPE: false,
  childrenCount: 0,
  company: "",
  
  payment: { method: '' },
  signatureToken: '',
  
  beneficiaries: [],
  
  dpsAnswers: {},
  questionnaireOriginalData: null
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const createFormSlice: StateCreator<SimulatorState, [], [], FormSlice> = (set) => ({
  formData: initialFormData,

  actions: {
    setFormData: (data) => set((state) => ({ 
      formData: { ...state.formData, ...data } 
    })),
    
    setPaymentData: (data) => set((state) => ({
      formData: {
        ...state.formData,
        payment: { ...state.formData.payment, ...data }
      }
    })),

    addBeneficiary: () => set((state) => ({
      formData: {
        ...state.formData,
        beneficiaries: [
          ...state.formData.beneficiaries,
          {
            id: generateId(),
            fullName: '',
            birthDate: '',
            relationship: '',
            percentage: 0,
            cpf: '',
            rg: '',
            legalRepresentative: undefined 
          }
        ]
      }
    })),

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
          b.id === id ? { ...b, ...data } : b
        )
      }
    })),

    setBeneficiaries: (beneficiaries) => set((state) => ({
      formData: { ...state.formData, beneficiaries }
    })),
  }
});