import { StateCreator } from 'zustand';
import { SimulatorState } from '../useSimulatorStore';

// 1. Definir e EXPORTAR o tipo aqui
export type ValidationStatus = {
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
  paymentMethodError: string | null;
};

export interface UiSlice {
  currentStep: number;
  validationStatus: ValidationStatus;
  
  // Actions
  nextStep: () => void;
  prevStep: () => void;
  setValidationStatus: (status: Partial<ValidationStatus>) => void;
}

const initialValidationStatus: ValidationStatus = {
  fullNameError: null, cpfError: null, emailError: null, phoneError: null,
  stateError: null, birthDateError: null, genderError: null, incomeError: null,
  professionError: null, zipCodeError: null, streetError: null, numberError: null,
  neighborhoodError: null, cityError: null, maritalStatusError: null,
  rgNumberError: null, rgIssuerError: null, rgDateError: null,
  childrenCountError: null, companyError: null, isPPEError: null,
  beneficiariesError: null, paymentMethodError: null,
};

export const createUiSlice: StateCreator<SimulatorState, [], [], UiSlice> = (set) => ({
  currentStep: 1,
  validationStatus: initialValidationStatus,

  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),
  
  setValidationStatus: (status) => set((state) => ({
    validationStatus: { ...state.validationStatus, ...status }
  })),
});