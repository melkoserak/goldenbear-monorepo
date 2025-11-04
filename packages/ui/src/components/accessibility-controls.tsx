"use client";

import React from 'react';
import { Button } from "./button";
import { Sun, Moon, ZoomIn, ZoomOut, RefreshCw } from "lucide-react";
// 1. Importe os componentes de Tooltip
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

// Definimos as propriedades que este componente "burro" espera
export type AccessibilityControlsProps = {
  theme: string | undefined; // Tema atual ('light' ou 'dark')
  onSetTheme: (theme: 'light' | 'dark') => void;
  onDecreaseFontSize: () => void;
  onResetFontSize: () => void;
  onIncreaseFontSize: () => void;
};

// 2. Envolva os botões com o TooltipProvider
export const ControlsContent = ({
  theme,
  onSetTheme,
  onDecreaseFontSize,
  onResetFontSize,
  onIncreaseFontSize,
}: AccessibilityControlsProps) => (
  <TooltipProvider delayDuration={100}>
    <div className="p-4">
      <div className="mb-4">
        <p className="font-semibold mb-2 text-foreground">Tema</p>
        <div className="grid grid-cols-2 gap-2">
          {/* Botão Modo Claro */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={theme === 'light' ? 'secondary' : 'ghost'}
                onClick={() => onSetTheme('light')}
                aria-label="Ativar modo claro"
              >
                <Sun className="mr-2 h-4 w-4" />
                Claro
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mudar para tema claro</p>
            </TooltipContent>
          </Tooltip>
          
          {/* Botão Modo Escuro */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={theme === 'dark' ? 'secondary' : 'ghost'}
                onClick={() => onSetTheme('dark')}
                aria-label="Ativar modo escuro"
              >
                <Moon className="mr-2 h-4 w-4" />
                Escuro
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mudar para tema escuro</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div>
        <p className="font-semibold mb-2 text-foreground">Tamanho da Fonte</p>
        <div className="grid grid-cols-3 gap-2">
          {/* Botão Diminuir Fonte */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDecreaseFontSize}
                aria-label="Diminuir fonte"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Diminuir fonte</p>
            </TooltipContent>
          </Tooltip>
          
          {/* Botão Resetar Fonte */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onResetFontSize}
                aria-label="Restaurar fonte"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Restaurar fonte padrão</p>
            </TooltipContent>
          </Tooltip>

          {/* Botão Aumentar Fonte */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onIncreaseFontSize}
                aria-label="Aumentar fonte"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Aumentar fonte</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  </TooltipProvider>
);