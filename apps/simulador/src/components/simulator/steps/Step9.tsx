"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { useCoverageStore } from '@/stores/useCoverageStore';
import { track } from '@/lib/tracking';
import { Loader2, AlertTriangle, FileText, ArrowLeft } from 'lucide-react';
import { NavigationButtons } from '../NavigationButtons';
import { Button } from '@goldenbear/ui/components/button';
import { StepLayout } from '../StepLayout';
import { fetchQuestionnaireStructure } from '@/services/apiService';
import { QuestionnaireRenderer } from './step9/QuestionnaireRenderer';
import { MagQuestion, MagTipoItem } from '@/lib/mag-api/types';

export const Step9 = () => {
  const { formData, actions: { setFormData, nextStep, setStep } } = useSimulatorStore();
  const coverages = useCoverageStore((state) => state.coverages);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'MISSING_SIMULATION' | 'API_ERROR' | null>(null);

  const [questions, setQuestions] = useState<MagQuestion[]>([]);
  
  const [answers, setAnswers] = useState<Record<string, { value: any, optionId?: number }>>(
    formData.dpsAnswers || {}
  );

  const getQuestionnaireId = useCallback(() => {
    for (const cov of coverages) {
      if (cov.isActive && cov.originalData?.questionariosPorFaixa) {
        const faixa = cov.originalData.questionariosPorFaixa[0];
        if (faixa?.questionarios?.length > 0) {
          return faixa.questionarios[0].idQuestionario;
        }
      }
    }
    return null;
  }, [coverages]);

  useEffect(() => {
    const loadData = async () => {
      if (formData.questionnaireOriginalData) {
        const cachedQuestions = formData.questionnaireOriginalData.Valor?.VersaoQuestionario?.[0]?.Perguntas || [];
        setQuestions(cachedQuestions);
        setIsLoading(false);
        return;
      }

      if (coverages.length === 0) {
        setError("Você precisa realizar a simulação ou não selecionou um plano.");
        setErrorType('MISSING_SIMULATION');
        setIsLoading(false);
        return;
      }

      const id = getQuestionnaireId();
      
      if (!id) {
        console.warn("Nenhum ID de questionário encontrado.");
        setError("Não foi possível identificar as perguntas de saúde para o plano selecionado.");
        setErrorType('API_ERROR');
        setIsLoading(false);
        return;
      }

      try {
        const data = await fetchQuestionnaireStructure(id);
        setFormData({ questionnaireOriginalData: data });
        const apiQuestions = data.Valor?.VersaoQuestionario?.[0]?.Perguntas || [];
        setQuestions(apiQuestions);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar as perguntas de saúde.");
        setErrorType('API_ERROR');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    track('step_view', { step: 9, step_name: 'Questionário de Saúde' });
  }, [getQuestionnaireId, setFormData, formData.questionnaireOriginalData, coverages.length]);

  const handleAnswer = (questionId: number, value: any, optionId?: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { value, optionId }
    }));
  };

  // --- VALIDAÇÃO BLINDADA V4 ---
  const validateQuestions = useCallback((qs: MagQuestion[]): boolean => {
    for (const q of qs) {
      const isAgrupador = q.TipoItem?.Id === MagTipoItem.AGRUPADOR;
      const isInformativo = q.TipoItem?.Id === MagTipoItem.INFORMATIVO;

      // 1. Validação de Filhos Diretos
      if (q.Perguntas && q.Perguntas.length > 0) {
        if (!validateQuestions(q.Perguntas)) return false;
      }

      // 2. Validação da Própria Pergunta (Se Obrigatória e não for Container)
      if (q.Obrigatorio && !isAgrupador && !isInformativo) {
        const ans = answers[q.Id];
        const val = ans?.value;
        const hasValue = val !== undefined && val !== null && String(val).trim() !== '';
        
        if (!hasValue) return false;
      }

      // 3. Validação de Opções e Subitens (A Lógica Crítica)
      if (q.Opcoes && q.Opcoes.length > 0) {
        
        if (isAgrupador) {
           // CASO AGRUPADOR: O Renderer desenha TODAS as opções e seus subitens.
           // Portanto, devemos validar os subitens de TODAS as opções.
           for (const opt of q.Opcoes) {
             if (opt.SubItens && opt.SubItens.length > 0) {
               if (!validateQuestions(opt.SubItens)) return false;
             }
           }
        } 
        else {
           // CASO PERGUNTA (Sim/Não): Só valida os filhos da opção ESCOLHIDA.
           const currentAns = answers[q.Id];
           if (currentAns?.value) {
             const val = String(currentAns.value).trim().toLowerCase();
             
             // Encontra a opção escolhida no array de opções
             const selectedOption = q.Opcoes.find(o => {
                const optText = String(o.Descricao || '').trim().toLowerCase();
                return optText === val || 
                       (currentAns.optionId && o.Id === currentAns.optionId) ||
                       (['sim', 's'].includes(val) && ['sim', 's'].includes(optText));
             });
             
             // Se achou a opção, valida seus filhos
             if (selectedOption && selectedOption.SubItens && selectedOption.SubItens.length > 0) {
                if (!validateQuestions(selectedOption.SubItens)) return false;
             }
           }
        }
      }
    }
    return true;
  }, [answers]);

  const isFormValid = questions.length > 0 && validateQuestions(questions);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateQuestions(questions)) {
        // Feedback visual já tratado pelo texto abaixo do botão
        return;
    }
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
        <div className="p-8 border border-dashed border-destructive/30 bg-destructive/5 rounded-xl text-center flex flex-col items-center">
          <div className="p-4 bg-white rounded-full shadow-sm mb-4">
             {errorType === 'MISSING_SIMULATION' ? (
                <FileText className="h-8 w-8 text-primary" />
             ) : (
                <AlertTriangle className="h-8 w-8 text-destructive" />
             )}
          </div>

          <h3 className="text-lg font-bold text-foreground mb-2">
             {errorType === 'MISSING_SIMULATION' ? 'Etapa Anterior Pendente' : 'Ops! Algo deu errado'}
          </h3>
          
          <p className="text-muted-foreground mb-6 max-w-md">
             {error}
          </p>

          {errorType === 'MISSING_SIMULATION' ? (
              <Button onClick={() => setStep(4)} size="lg" className="gap-2">
                 <ArrowLeft className="w-4 h-4" /> Voltar para Cotação
              </Button>
          ) : (
              <Button onClick={() => window.location.reload()} variant="outline">
                 Tentar Novamente
              </Button>
          )}
        </div>
        {errorType !== 'MISSING_SIMULATION' && <NavigationButtons showNextButton={false} />}
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
          isNextDisabled={!isFormValid} 
        />
        
        {!isFormValid && Object.keys(answers).length > 0 && (
            <p className="text-center text-xs text-destructive mt-3 animate-pulse font-semibold">
                * Responda todas as perguntas obrigatórias para continuar.
            </p>
        )}
      </StepLayout>
    </form>
  );
};