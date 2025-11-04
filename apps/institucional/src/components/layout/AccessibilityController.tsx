"use client";

import { useTheme } from "next-themes";
import { useAccessibilityStore } from "@/stores/useAccessibilityStore";
import { ControlsContent } from "@goldenbear/ui/components/accessibility-controls";
import { useEffect } from "react"; // 1. IMPORTE O useEffect

export const AccessibilityController = () => {
  const { theme, setTheme } = useTheme();
  const { 
    increaseFontSize, 
    decreaseFontSize, 
    resetFontSize 
  } = useAccessibilityStore();

  // 2. ADICIONE ESTE EFEITO
  // Este log vai disparar sempre que o tema mudar
  useEffect(() => {
    console.log("O tema ATUAL é:", theme);
  }, [theme]);

  // 3. ADICIONE ESTE WRAPPER PARA LOGAR O CLIQUE
  const handleSetTheme = (newTheme: 'light' | 'dark') => {
    console.log("Tentando mudar o tema para:", newTheme);
    setTheme(newTheme);
  };

  return (
    <ControlsContent
      theme={theme}
      onSetTheme={handleSetTheme} // 4. USE A FUNÇÃO WRAPPER AQUI
      onIncreaseFontSize={increaseFontSize}
      onDecreaseFontSize={decreaseFontSize}
      onResetFontSize={resetFontSize}
    />
  );
};