import { StateCreator } from 'zustand';
import { SimulatorState } from '../useSimulatorStore';

export interface UiSlice {
  currentStep: number;
  isLoading: boolean;
  // --- CORREÇÃO: Definir explicitamente 'actions' ---
  actions: {
    nextStep: () => void;
    prevStep: () => void;
    setStep: (step: number) => void;
    setLoading: (loading: boolean) => void;
  };
}

export const createUiSlice: StateCreator<SimulatorState, [], [], UiSlice> = (set) => ({
  currentStep: 1,
  isLoading: false,
  actions: {
    nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
    prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),
    setStep: (step) => set({ currentStep: step }),
    setLoading: (loading) => set({ isLoading: loading }),
  },
});