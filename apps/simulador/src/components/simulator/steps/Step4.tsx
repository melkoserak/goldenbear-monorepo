"use client";
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { useCoverageStore } from '@/stores/useCoverageStore';
import { track } from '@/lib/tracking';
import { AlertTriangle } from 'lucide-react';
import { SummaryBar } from './step4/SummaryBar';
import { NavigationButtons } from '../NavigationButtons';
import { Skeleton } from "@goldenbear/ui/components/skeleton";
// 1. Importe o Hook
import { useSimulation } from '@/hooks/useMagApi';

const CoverageCard = dynamic(
  () => import('./step4/CoverageCard').then((mod) => mod.CoverageCard),
  { 
    ssr: false,
    loading: () => <Skeleton className="border rounded-lg p-6 mb-4 h-[120px] w-full" />
  }
);

const LoadingState = () => (
    <div className="flex flex-col items-center justify-center p-10 space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="border rounded-lg p-6 mb-4 h-[120px] w-full" />
        <Skeleton className="border rounded-lg p-6 mb-4 h-[120px] w-full" />
        <Skeleton className="border rounded-lg p-6 mb-4 h-[120px] w-full" />
    </div>
);

const ErrorState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center text-center p-10 bg-destructive/10 border border-destructive rounded-lg">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-lg font-semibold text-destructive">Ocorreu um Erro</p>
        <p className="text-muted-foreground">{message}</p>
    </div>
);

export const Step4 = () => {
  const formData = useSimulatorStore((state) => state.formData);
  const firstName = formData.fullName.split(' ')[0] || "para você"; 
  const { nextStep } = useSimulatorStore((state) => state.actions);
  
  const coverages = useCoverageStore((state) => state.coverages);
  const setInitialCoverages = useCoverageStore((state) => state.setInitialCoverages);
  const mainSusep = useCoverageStore((state) => state.mainSusep);
  const totalPremium = useCoverageStore((state) => state.getTotalPremium());

  // 2. Uso do React Query para buscar a simulação
  const { data: simulationData, isLoading, isError, error } = useSimulation();

  useEffect(() => {
    track('step_view', { step: 4, step_name: 'Resultados da Simulação' });
  }, []);

  // 3. Atualiza a store quando os dados chegam
  useEffect(() => {
    if (simulationData) {
      setInitialCoverages(simulationData);
      track('simulation_success', { api_response_payload: simulationData });
    }
  }, [simulationData, setInitialCoverages]);

  // 4. Track de erro
  useEffect(() => {
    if (isError) {
        track('simulation_error', { error_message: (error as Error)?.message });
    }
  }, [isError, error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    track('step_complete', {
        step: 4,
        step_name: 'Personalização Concluída',
        final_selections: {
          total_premium: useCoverageStore.getState().getTotalPremium(),
          total_indemnity: useCoverageStore.getState().getTotalIndemnity(),
          selected_coverages: useCoverageStore.getState().coverages.filter(c => c.isActive).map(c => c.name),
        }
    });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <h3 tabIndex={-1} className="text-2xl font-medium text-left mb-2 text-foreground outline-none">
        {isLoading ? "Aguarde um momento..." : `Personalize o seu seguro ideal, ${firstName}`}
      </h3>
      
      {!isLoading && mainSusep && (
        <p className="text-left text-sm text-muted-foreground mb-8">
          Produto principal (Processo SUSEP: {mainSusep})
        </p>
      )}
      
      {isLoading && <LoadingState />}
      {isError && <ErrorState message={(error as Error)?.message || "Não foi possível carregar as opções."} />}
      
      {!isLoading && !isError && coverages.length > 0 && (
        <>
          <div>
            {coverages.map((coverage) => (
              <CoverageCard key={coverage.id} coverage={coverage} />
            ))}
          </div>
          
          <SummaryBar />
          <NavigationButtons 
            isNextDisabled={totalPremium <= 0} 
            nextLabel="Continuar" 
          />
        </>
      )}

      {!isLoading && !isError && coverages.length === 0 && (
          <ErrorState message="Não encontrámos coberturas disponíveis para o seu perfil. Por favor, volte e verifique os seus dados." />
      )}
    </form>
  );
};