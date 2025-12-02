"use client";
import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { StepIndicator } from './StepIndicator';
import { Skeleton } from '@goldenbear/ui/components/skeleton';

// 1. Passo 1 estático (LCP - deve ser instantâneo)
import { Step1 } from './steps/Step1';

// 2. Componente de Loading Leve
const StepLoading = () => (
  <div className="space-y-6 animate-pulse py-4">
    <div className="h-8 bg-muted rounded w-3/4 mb-8"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-12 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
    <div className="flex justify-end mt-8">
       <Skeleton className="h-10 w-32" />
    </div>
  </div>
);

// 3. Importações Dinâmicas (Code Splitting)
const Step2 = dynamic(() => import('./steps/Step2').then(mod => mod.Step2), { loading: () => <StepLoading /> });
const Step3 = dynamic(() => import('./steps/Step3').then(mod => mod.Step3), { loading: () => <StepLoading /> });
const Step4 = dynamic(() => import('./steps/Step4').then(mod => mod.Step4), { loading: () => <StepLoading /> });
const Step5 = dynamic(() => import('./steps/Step5').then(mod => mod.Step5), { loading: () => <StepLoading /> });
const Step6 = dynamic(() => import('./steps/Step6').then(mod => mod.Step6), { loading: () => <StepLoading /> });
const Step7 = dynamic(() => import('./steps/Step7').then(mod => mod.Step7), { loading: () => <StepLoading /> });
const Step8 = dynamic(() => import('./steps/Step8').then(mod => mod.Step8), { loading: () => <StepLoading /> });
const Step9 = dynamic(() => import('./steps/Step9').then(mod => mod.Step9), { loading: () => <StepLoading /> });
const Step10 = dynamic(() => import('./steps/Step10').then(mod => mod.Step10), { loading: () => <StepLoading /> });
const Step11 = dynamic(() => import('./steps/Step11').then(mod => mod.Step11), { loading: () => <StepLoading /> });

// --- CORREÇÃO AQUI: Importar do arquivo ./steps/Step12 ---
const Step12 = dynamic(() => import('./steps/Step12').then(mod => mod.Step12), { loading: () => <StepLoading /> });


// Configuração de títulos
const stepTitles: { [key: number]: string } = {
  1: 'Passo 1: Dados Iniciais',
  2: 'Passo 2: Dados de Contato',
  3: 'Passo 3: Detalhes da Simulação',
  4: 'Passo 4: Personalize o seu Seguro',
  5: 'Passo 5: Resumo da Proposta',
  6: 'Passo 6: Dados Complementares',
  7: 'Passo 7: Perfil Detalhado',
  8: 'Passo 8: Beneficiários',
  9: 'Passo 9: Questionário de Saúde',
  10: 'Passo 10: Pagamento',
  11: 'Passo 11: Assinatura Digital',
  12: 'Passo 12: Finalização',
};

const getMainStep = (step: number) => {
  if (step <= 3) return 1;
  if (step === 4) return 2;
  if (step >= 5 && step <= 8) return 3;
  if (step >= 9) return 4;
  return 1;
};

export const SimulatorForm = () => {
  const currentStep = useSimulatorStore((state) => state.currentStep);
  const formRef = useRef<HTMLDivElement>(null);
  const hydrateFromStorage = useSimulatorStore((state) => state.actions.hydrateFromStorage);
  
  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  useEffect(() => {
    const title = stepTitles[currentStep] || 'Simulador';
    document.title = `${title} | Golden Bear Seguros`;
    
    // Foca no topo ao mudar de passo
    if (formRef.current) {
      setTimeout(() => {
          const heading = formRef.current?.querySelector('h3');
          if (heading) {
            heading.focus();
          }
      }, 100);
    }
  }, [currentStep]);

   return (
    <div ref={formRef} className="bg-accent md:bg-white w-full max-w-5xl p-0 md:p-10 rounded-lg shadow-sm border-none md:border border-border/50">
       <StepIndicator currentStep={getMainStep(currentStep)} />     
       <div className="mt-8">
        {/* Renderização Condicional */}
        {currentStep === 1 && <Step1 />}
        {currentStep === 2 && <Step2 />}
        {currentStep === 3 && <Step3 />}
        {currentStep === 4 && <Step4 />}
        {currentStep === 5 && <Step5 />}
        {currentStep === 6 && <Step6 />}
        {currentStep === 7 && <Step7 />}
        {currentStep === 8 && <Step8 />}
        {currentStep === 9 && <Step9 />}
        {currentStep === 10 && <Step10 />}
        {currentStep === 11 && <Step11 />}
        {currentStep === 12 && <Step12 />}
      </div>
    </div>
  );
};