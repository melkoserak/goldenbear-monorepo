"use client";

import { useTheme } from "next-themes";
import { useAccessibilityStore } from "../stores/accessibility-store";
import { ControlsContent } from "./accessibility-controls"; // Reutiliza o UI existente

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