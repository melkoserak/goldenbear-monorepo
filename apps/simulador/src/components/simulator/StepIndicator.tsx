"use client";
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@goldenbear/ui/lib/utils';

type StepIndicatorProps = {
  currentStep: number;
};

const steps = [
  { id: 1, label: "Dados iniciais" },
  { id: 2, label: "Proposta" },
  { id: 3, label: "Complemento" },
  { id: 4, label: "Pagamento" },
];

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  // Calcula a porcentagem de progresso para a barra mobile
  // Garante que não ultrapasse 100%
  const progressPercentage = Math.min(100, Math.max(0, ((currentStep) / (steps.length)) * 100));

  return (
    // --- AJUSTE DE LAYOUT APLICADO AQUI ---
    // mb-10: Aplica margem inferior de 40px para todas as telas (Mobile First)
    // lg:mb-16: Sobrescreve com margem de 64px apenas em telas grandes (Desktop)
   <div className="w-full mb-10 md:mb-14 lg:mb-16">
      
      {/* --- VERSÃO MOBILE (Barra de Progresso) --- */}
      <div className="block md:hidden px-1">
        <div className="flex justify-between items-end mb-2">
          <div>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Passo {currentStep} de {steps.length}
            </span>
            <p className="text-lg font-bold text-foreground leading-none mt-1">
              {steps[currentStep - 1]?.label || "Finalizando"}
            </p>
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        
        {/* Barra de fundo */}
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          {/* Barra de preenchimento animada */}
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* --- VERSÃO DESKTOP (Stepper Horizontal com Conectores) --- */}
      <div className="hidden md:flex w-full items-center justify-center">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Nó do Passo (Círculo) */}
              <div className="flex flex-col items-center relative group">
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 bg-background",
                    // Lógica de Estados
                    isCompleted 
                      ? "bg-primary border-primary text-primary-foreground scale-100" 
                      : isActive
                        ? "border-primary text-primary ring-4 ring-primary/20 scale-110" // Destaque visual no ativo
                        : "border-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 animate-in zoom-in duration-300" strokeWidth={3} />
                  ) : (
                    <span className="text-sm font-bold">{step.id}</span>
                  )}
                </div>
                
                {/* Label Absoluto (para não quebrar o grid) */}
                <div className={cn(
                  "absolute top-12 whitespace-nowrap text-sm font-medium transition-all duration-300",
                  isActive 
                    ? "text-primary translate-y-0 opacity-100 font-bold" 
                    : "text-muted-foreground translate-y-[-2px] opacity-70"
                )}>
                  {step.label}
                </div>
              </div>

              {/* Linha Conectora (Renderiza entre os passos) */}
              {!isLast && (
                <div className="w-16 lg:w-24 h-[2px] mx-2 rounded-full bg-muted overflow-hidden">
                  <div 
                    className={cn(
                      "h-full bg-primary transition-all duration-500 ease-out",
                      // A linha preenche se o passo ATUAL for maior que este passo
                      currentStep > step.id ? "w-full" : "w-0"
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};