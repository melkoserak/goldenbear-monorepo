"use client";

import { useTheme } from "next-themes";
import { useAccessibilityStore } from "@/stores/useAccessibilityStore";
// 1. Importe o componente de UI "burro" do seu PACOTE DE UI
import { ControlsContent } from "@goldenbear/ui/components/accessibility-controls";

// 2. Este é o componente "inteligente" que conecta o estado à UI
export const AccessibilityController = () => {
  const { theme, setTheme } = useTheme();
  const { 
    increaseFontSize, 
    decreaseFontSize, 
    resetFontSize 
  } = useAccessibilityStore();

  return (
    <ControlsContent
      theme={theme}
      onSetTheme={setTheme}
      onIncreaseFontSize={increaseFontSize}
      onDecreaseFontSize={decreaseFontSize}
      onResetFontSize={resetFontSize}
    />
  );
};