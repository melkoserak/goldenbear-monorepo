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
import { useSimulation } from '@/hooks/useMagApi';
import { StepLayout } from '../StepLayout';

const CoverageCard = dynamic(
  () => import('./step4/CoverageCard').then((mod) => mod.CoverageCard),
  { ssr: false, loading: () => <Skeleton className="border rounded-lg p-6 mb-4 h-[120px] w-full" /> }
);

const LoadingState = () => (
    <div className="flex flex-col items-center justify-center p-10 space-y-4">
        <Skeleton className="h-12 w-3/4" />
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
  
  // Recupera o hash salvo da última vez que carregamos coberturas
  const savedSimulationHash = useCoverageStore((state) => state.simulationHash);

  const { data: simulationData, isLoading, isError, error } = useSimulation();

  // Gera um Hash Único baseado nos dados atuais do usuário que afetam a simulação
  const currentSimulationHash = JSON.stringify({
    nome: formData.fullName,
    cpf: formData.cpf,
    data: formData.birthDate,
    sexo: formData.gender,
    renda: formData.income,
    estado: formData.state,
    profissao: formData.profession
  });

  useEffect(() => { track('step_view', { step: 4, step_name: 'Resultados da Simulação' }); }, []);

  useEffect(() => {
    if (simulationData) {
      // LÓGICA DE PROTEÇÃO:
      // Só sobrescreve as coberturas se os dados de entrada mudaram (Hash diferente)
      // Se for igual, significa que é a mesma simulação e o usuário está voltando, então mantemos as edições dele.
      if (currentSimulationHash !== savedSimulationHash) {
        console.log("Nova simulação detectada. Atualizando coberturas...");
        setInitialCoverages(simulationData, currentSimulationHash);
        track('simulation_success', { api_response_payload: simulationData });
      } else {
        console.log("Simulação existente detectada. Mantendo personalizações do usuário.");
      }
    }
  }, [simulationData, setInitialCoverages, currentSimulationHash, savedSimulationHash]);

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
          selected_coverages: useCoverageStore.getState().coverages.filter(c => c.isActive).map(c => c.name),
        }
    });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit}>
      <StepLayout 
        title={isLoading ? "Aguarde um momento..." : `Personalize o seu seguro ideal, ${firstName}`}
        description={!isLoading && mainSusep ? `Produto principal (Processo SUSEP: ${mainSusep})` : undefined}
      >
        {isLoading && <LoadingState />}
        {isError && <ErrorState message={(error as Error)?.message || "Não foi possível carregar as opções."} />}
        
        {!isLoading && !isError && coverages.length > 0 && (
          <>
            <div className="flex flex-col gap-4">
              {coverages.map((coverage) => (
                <CoverageCard key={coverage.id} coverage={coverage} />
              ))}
            </div>
            <SummaryBar />
            <NavigationButtons isNextDisabled={totalPremium <= 0} nextLabel="Continuar" />
          </>
        )}

        {!isLoading && !isError && coverages.length === 0 && (
            <ErrorState message="Não encontrámos coberturas disponíveis para o seu perfil. Por favor, volte e verifique os seus dados." />
        )}
      </StepLayout>
    </form>
  );
};
