"use client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import IframeResizer from 'iframe-resizer-react';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { useCoverageStore } from '@/stores/useCoverageStore';
import { track } from '@/lib/tracking';
import { Loader2, AlertTriangle, PartyPopper, ArrowLeft, ArrowRight } from 'lucide-react';
import { NavigationButtons } from '../NavigationButtons';
import { Button } from '@goldenbear/ui/components/button';

// --- SEGURANÇA: Constante para o domínio autorizado ---
const MAG_WIDGET_ORIGIN = 'https://widgetshmg.mag.com.br';

export const Step9 = () => {
  const { dpsAnswers, reservedProposalNumber, questionnaireToken } = useSimulatorStore((state) => state.formData);
  const { setFormData, nextStep, prevStep, resetDpsAnswers, prefetchPaymentToken } = useSimulatorStore((state) => state.actions);
  const firstName = useSimulatorStore((state) => state.formData.fullName.split(' ')[0] || "");
  const simulationDataStore = useCoverageStore((state) => state.coverages);

  const [isLoading, setIsLoading] = useState(!dpsAnswers);
  const [error, setError] = useState<string | null>(null);
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const findFirstQuestionnaireId = useCallback(() => {
    if (!simulationDataStore || simulationDataStore.length === 0) return 'Venda';
    const firstCoverageWithQuestionnaire = simulationDataStore.find(cov => cov.originalData?.questionariosPorFaixa?.[0]?.questionarios?.[0]?.idQuestionario);
    return firstCoverageWithQuestionnaire?.originalData?.questionariosPorFaixa?.[0]?.questionarios?.[0]?.idQuestionario || 'Venda';
  }, [simulationDataStore]);

  useEffect(() => {
    track('step_view', { step: 9, step_name: 'Questionário de Saúde' });

    prefetchPaymentToken();

    const handleMessage = (event: MessageEvent) => {
      // --- SEGURANÇA: Validação estrita da origem ---
      if (event.origin !== MAG_WIDGET_ORIGIN) return;

      if (typeof event.data === 'string' && event.data.startsWith('{')) {
        try {
          const data = JSON.parse(event.data);
          if (data.Resposta && data.Id) {
            setFormData({ dpsAnswers: JSON.parse(data.Resposta) });
            track('questionnaire_complete', { questionnaire_id: data.Id });
            nextStep();
          }
        } catch {
          // Falha silenciosa para mensagens irrelevantes, sem logar o conteúdo
        }
      }
    };

    window.addEventListener('message', handleMessage);

    if (dpsAnswers) {
      setIsLoading(false);
      return () => window.removeEventListener('message', handleMessage);
    }

    const initializeWidget = () => {
      setIsLoading(true);
      setError(null);
      setWidgetUrl(null);
      
      if (reservedProposalNumber && questionnaireToken) {
        // --- LOG SEGURO: Apenas confirmação de fluxo, sem dados ---
        console.log("[Step9] Tokens encontrados. Iniciando widget.");
        
        const questionnaireId = findFirstQuestionnaireId();
        // Monta a URL mas NÃO a loga no console
        const url = `${MAG_WIDGET_ORIGIN}/questionario-Questionario/v2/responder/${questionnaireId}/Venda/${reservedProposalNumber}/0266e8/efb700?listenForToken=true`;
        
        setWidgetUrl(url);
      } else {
        // Log de aviso genérico é aceitável
        console.warn("[Step9] Tokens não disponíveis no estado.");
        setError("Não foi possível obter os tokens de autenticação. Por favor, volte e tente novamente.");
        setIsLoading(false);
      }
    };

    initializeWidget();

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [dpsAnswers, setFormData, nextStep, findFirstQuestionnaireId, reservedProposalNumber, questionnaireToken, prefetchPaymentToken]);

  if (dpsAnswers) {
    return (
      <div className="animate-fade-in text-center">
        <PartyPopper className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-medium text-foreground">Questionário concluído!</h3>
        <p className="text-muted-foreground mt-2 mb-6">Você já respondeu ao questionário de saúde.</p>
        <div className="flex justify-center mb-6">
          <Button type="button" variant="outline" onClick={resetDpsAnswers}>
            Responder Novamente
          </Button>
        </div>
        
        <div className="mt-8 pt-6 border-t flex justify-between items-center">
          <Button type="button" variant="ghost" onClick={prevStep}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Button type="button" onClick={nextStep}>
            Próximo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h3 tabIndex={-1} className="text-2xl font-medium text-left mb-2 text-foreground outline-none">
        {firstName}, como está a sua saúde? 
      </h3>
      <p className="text-left text-muted-foreground mb-8">
        Por favor, responda o questionário seguro abaixo para continuar.
      </p>
      <div className="relative border rounded-lg overflow-hidden min-h-[500px] p-3 px-6">
        {isLoading && ( <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10"><Loader2 className="animate-spin h-12 w-12 text-primary mb-4" /><p className="text-muted-foreground">Carregando ambiente seguro...</p></div> )}
        
        {error && ( 
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 p-4">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <p className="font-semibold text-destructive">Erro ao carregar</p>
            <p className="text-muted-foreground text-center">{error}</p>
            <Button onClick={resetDpsAnswers} className="mt-4">Tentar Novamente</Button>
          </div> 
        )}

        {widgetUrl && (
          <>
            <IframeResizer
              forwardRef={iframeRef}
              key={widgetUrl}
              src={widgetUrl}
              title="Questionário de Saúde"
              // --- SEGURANÇA: Restringe a comunicação do iframe ---
              checkOrigin={[MAG_WIDGET_ORIGIN]} 
              style={{ width: '1px', minWidth: '100%', border: 0 }}
              onLoad={() => {
                try {
                  if (iframeRef.current && questionnaireToken) {
                    // PostMessage seguro para a origem específica
                    iframeRef.current.contentWindow?.postMessage({
                      event: 'notify', property: 'Token', value: questionnaireToken
                    }, MAG_WIDGET_ORIGIN);
                  } else {
                    throw new Error("Estado inválido no carregamento.");
                  }
                } catch (err) {
                   // Não logamos o erro completo se contiver dados sensíveis
                   console.error("[Step9] Erro na inicialização do iframe.");
                   setError("Falha na autenticação do formulário.");
                } finally {
                  setIsLoading(false);
                }
              }}
            />
          </>
        )}
      </div>
      <NavigationButtons showNextButton={false} />
    </div>
  );
};