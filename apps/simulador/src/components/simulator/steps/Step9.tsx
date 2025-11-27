"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { useCoverageStore } from '@/stores/useCoverageStore';
import { track } from '@/lib/tracking';
import { Loader2, AlertTriangle, FileText } from 'lucide-react';
import { NavigationButtons } from '../NavigationButtons';
import { Button } from '@goldenbear/ui/components/button';
import { StepLayout } from '../StepLayout';
import { fetchQuestionnaireStructure } from '@/services/apiService';
import { QuestionnaireRenderer } from './step9/QuestionnaireRenderer';
import { MagQuestion } from '@/lib/mag-api/types';

export const Step9 = () => {
  const { formData, actions: { setFormData, nextStep, prevStep } } = useSimulatorStore();
  const coverages = useCoverageStore((state) => state.coverages);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<MagQuestion[]>([]);
  
  // Estado local das respostas
  const [answers, setAnswers] = useState<Record<string, { value: any, optionId?: number }>>(
    formData.dpsAnswers || {} // Recupera respostas se o usuário voltar
  );

  // 1. Lógica para encontrar o ID do questionário na store de coberturas
  const getQuestionnaireId = useCallback(() => {
    for (const cov of coverages) {
      if (cov.isActive && cov.originalData?.questionariosPorFaixa) {
        // Tenta encontrar na primeira faixa disponível
        const faixa = cov.originalData.questionariosPorFaixa[0];
        if (faixa?.questionarios?.length > 0) {
          return faixa.questionarios[0].idQuestionario;
        }
      }
    }
    return null; // Não encontrou (pode ser produto sem DPS ou erro de config)
  }, [coverages]);

  // 2. Carregar dados
  useEffect(() => {
    const loadData = async () => {
      // Se já temos dados salvos na store (usuário voltou), usamos eles para não recarregar
      if (formData.questionnaireOriginalData) {
        // Extrai perguntas do cache
        const cachedQuestions = formData.questionnaireOriginalData.Valor?.VersaoQuestionario?.[0]?.Perguntas || [];
        setQuestions(cachedQuestions);
        setIsLoading(false);
        return;
      }

      const id = getQuestionnaireId();
      
      if (!id) {
        // Se não tiver ID, assumimos que não há DPS e pulamos (ou mostramos aviso em dev)
        console.warn("Nenhum ID de questionário encontrado. Pulando step?");
        // Em produção, poderíamos pular automaticamente: nextStep();
        setError("Não foi possível identificar o questionário de saúde para este produto.");
        setIsLoading(false);
        return;
      }

      try {
        console.log(`[Step9] Buscando questionário ID: ${id}`);
        const data = await fetchQuestionnaireStructure(id);
        
        // Salva o JSON Original na store (CRÍTICO para o Step 11)
        setFormData({ questionnaireOriginalData: data });

        // Extrai perguntas para renderizar
        const apiQuestions = data.Valor?.VersaoQuestionario?.[0]?.Perguntas || [];
        setQuestions(apiQuestions);
        
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar as perguntas de saúde.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    track('step_view', { step: 9, step_name: 'Questionário de Saúde' });
  }, [getQuestionnaireId, setFormData, formData.questionnaireOriginalData]);

  // 3. Handler de Resposta
  const handleAnswer = (questionId: number, value: any, optionId?: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { value, optionId }
    }));
  };

  // 4. Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Adicionar validação de campos obrigatórios aqui se necessário
    // (Iterar sobre 'questions' e checar se 'answers' tem as chaves dos obrigatórios)

    // Salva as respostas na store global
    setFormData({ dpsAnswers: answers });
    
    track('step_complete', { step: 9, step_name: 'Questionário Respondido' });
    nextStep();
  };

  if (isLoading) {
    return (
      <StepLayout title="Carregando Declaração de Saúde...">
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Buscando formulário seguro...</p>
        </div>
      </StepLayout>
    );
  }

  if (error) {
    return (
      <StepLayout title="Atenção">
        <div className="p-6 border border-destructive/30 bg-destructive/5 rounded-lg text-center">
          <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-4" />
          <p className="text-destructive font-medium mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>Tentar Novamente</Button>
        </div>
        <NavigationButtons showNextButton={false} />
      </StepLayout>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <StepLayout 
        title="Declaração Pessoal de Saúde" 
        description="Por favor, responda as perguntas abaixo com veracidade para garantir a validade do seu seguro."
      >
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          {questions.length > 0 ? (
            <QuestionnaireRenderer 
              questions={questions} 
              answers={answers} 
              onAnswer={handleAnswer} 
            />
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>Nenhuma pergunta necessária para este perfil.</p>
            </div>
          )}
        </div>

        <NavigationButtons 
          nextLabel="Confirmar Respostas"
          // Validação visual simples: habilita se tiver pelo menos 1 resposta
          // (Idealmente validar obrigatórios)
          isNextDisabled={questions.length > 0 && Object.keys(answers).length === 0} 
        />
      </StepLayout>
    </form>
  );
};