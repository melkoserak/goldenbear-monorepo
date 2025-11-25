// apps/simulador/src/stores/slices/createUiSlice.ts
import { StateCreator } from 'zustand';
import { SimulatorState } from '../useSimulatorStore';

export interface UiSlice {
  currentStep: number;
  validationStatus: Record<string, string | null>; // Simplificado
  
  // Actions
  nextStep: () => void;
  prevStep: () => void;
  setValidationStatus: (status: Record<string, string | null>) => void;
}

export const createUiSlice: StateCreator<SimulatorState, [], [], UiSlice> = (set) => ({
  currentStep: 1,
  validationStatus: {},

  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),
  
  setValidationStatus: (status) => set((state) => ({
    validationStatus: { ...state.validationStatus, ...status }
  })),
});