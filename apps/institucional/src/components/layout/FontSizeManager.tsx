"use client";

import { useEffect } from 'react';
import { useAccessibilityStore } from '@/stores/useAccessibilityStore';

const stepToPercentage: { [key: number]: string } = {
  [-1]: '87.5%',
  [0]: '100%',
  [1]: '112.5%',
  [2]: '125%',
};

export const FontSizeManager = () => {
  const fontSizeStep = useAccessibilityStore((state) => state.fontSizeStep);

  useEffect(() => {
    const percentage = stepToPercentage[fontSizeStep] || '100%';
    document.documentElement.style.fontSize = percentage;
  }, [fontSizeStep]);

  return null;
};