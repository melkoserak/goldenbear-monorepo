import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type State = {
  fontSizeStep: number;
};

type Actions = {
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
};

const MAX_STEP = 2;
const MIN_STEP = -1;

export const useAccessibilityStore = create<State & Actions>()(
  persist(
    (set) => ({
      fontSizeStep: 0,
      increaseFontSize: () =>
        set((state) => ({
          fontSizeStep: Math.min(state.fontSizeStep + 1, MAX_STEP),
        })),
      decreaseFontSize: () =>
        set((state) => ({
          fontSizeStep: Math.max(state.fontSizeStep - 1, MIN_STEP),
        })),
      resetFontSize: () => set({ fontSizeStep: 0 }),
    }),
    {
      // ESTA É A CHAVE! Usando o mesmo nome, os apps compartilham o estado.
      name: 'goldenbear-accessibility-storage', 
      storage: createJSONStorage(() => localStorage),
    }
  )
);