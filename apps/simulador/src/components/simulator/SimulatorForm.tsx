"use client";
import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { StepIndicator } from './StepIndicator';
import { Skeleton } from '@goldenbear/ui/components/skeleton';

// 1. Passo 1 estático (LCP - deve ser instantâneo)
import { Step1 } from './steps/Step1';

// 2. Componente de Loading Leve (Skeleton)
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

// 3. Mapeamento de imports para Prefetch Manual
// Definido fora do componente para estar acessível globalmente e evitar recriação
const stepImports: Record<number, () => Promise<any>> = {
  2: () => import('./steps/Step2'),
  3: () => import('./steps/Step3'),
  4: () => import('./steps/Step4'),
  5: () => import('./steps/Step5'),
  6: () => import('./steps/Step6'),
  7: () => import('./steps/Step7'),
  8: () => import('./steps/Step8'),
  9: () => import('./steps/Step9'),
  10: () => import('./steps/Step10'),
  11: () => import('./steps/Step11'),
  12: () => import('./steps/Step12'),
};

// 4. Importações Dinâmicas (Code Splitting)
// Usamos o objeto stepImports para garantir consistência
const Step2 = dynamic(() => stepImports[2]().then(mod => mod.Step2), { loading: () => <StepLoading /> });
const Step3 = dynamic(() => stepImports[3]().then(mod => mod.Step3), { loading: () => <StepLoading /> });
const Step4 = dynamic(() => stepImports[4]().then(mod => mod.Step4), { loading: () => <StepLoading /> });
const Step5 = dynamic(() => stepImports[5]().then(mod => mod.Step5), { loading: () => <StepLoading /> });
const Step6 = dynamic(() => stepImports[6]().then(mod => mod.Step6), { loading: () => <StepLoading /> });
const Step7 = dynamic(() => stepImports[7]().then(mod => mod.Step7), { loading: () => <StepLoading /> });
const Step8 = dynamic(() => stepImports[8]().then(mod => mod.Step8), { loading: () => <StepLoading /> });
const Step9 = dynamic(() => stepImports[9]().then(mod => mod.Step9), { loading: () => <StepLoading /> });
const Step10 = dynamic(() => stepImports[10]().then(mod => mod.Step10), { loading: () => <StepLoading /> });
const Step11 = dynamic(() => stepImports[11]().then(mod => mod.Step11), { loading: () => <StepLoading /> });
const Step12 = dynamic(() => stepImports[12]().then(mod => mod.Step12), { loading: () => <StepLoading /> });

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

  // [PERF] Smart Prefetching: Pré-carrega o próximo passo
  useEffect(() => {
    const nextStep = currentStep + 1;
    if (stepImports[nextStep]) {
      // Pequeno delay para garantir que a UI atual já renderizou
      const timer = setTimeout(() => {
        stepImports[nextStep](); 
        // console.log(`⚡ Prefetching Step ${nextStep}...`); // Descomente para debugar
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

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
      <div ref={formRef} className="bg-background md:bg-card w-full max-w-5xl p-0 md:p-10 rounded-lg shadow-sm border-none md:border border-border/50">       
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