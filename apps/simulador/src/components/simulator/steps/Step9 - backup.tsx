"use client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import IframeResizer from 'iframe-resizer-react';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { useCoverageStore } from '@/stores/useCoverageStore';
import { track } from '@/lib/tracking';
import { Loader2, AlertTriangle, PartyPopper, ArrowLeft, ArrowRight } from 'lucide-react';
import { NavigationButtons } from '../NavigationButtons';
import { Button } from '@goldenbear/ui/components/button';
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { StepLayout } from '../StepLayout';

const MAG_WIDGET_ORIGIN = 'https://widgetshmg.mag.com.br';

export const Step9 = () => {
  const { formData: { dpsAnswers, fullName }, reservedProposalNumber, questionnaireToken, isPrefetchingTokens } = useSimulatorStore((state) => state);
  const { setFormData, nextStep, prevStep, resetDpsAnswers, prefetchPaymentToken, prefetchQuestionnaireTokens } = useSimulatorStore((state) => state.actions);
  const firstName = fullName.split(' ')[0] || "";
  const simulationDataStore = useCoverageStore((state) => state.coverages);

  const [isLoading, setIsLoading] = useState(!dpsAnswers);
  const [error, setError] = useState<string | null>(null);
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null);
  const [tokenSent, setTokenSent] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const findFirstQuestionnaireId = useCallback(() => {
    if (!simulationDataStore || simulationDataStore.length === 0) {
       // Se cair aqui, o usuário provavelmente deu F5 e perdeu a store.
       // O ideal seria redirecionar, mas mantemos 'Venda' como fallback.
       return 'Venda';
    }
    const firstCoverageWithQuestionnaire = simulationDataStore.find(cov => cov.originalData?.questionariosPorFaixa?.[0]?.questionarios?.[0]?.idQuestionario);
    return firstCoverageWithQuestionnaire?.originalData?.questionariosPorFaixa?.[0]?.questionarios?.[0]?.idQuestionario || 'Venda';
  }, [simulationDataStore]);

  // A Lógica de Ouro: Envio via postMessage com 'access_token'
  const sendTokenToWidget = useCallback(() => {
    if (iframeRef.current && questionnaireToken && !tokenSent) {
      console.log("[Step9] 🚀 Enviando token (access_token) via postMessage...");
      try {
        const messagePayload = { 
          event: 'notify', 
          property: 'access_token', // <-- A CHAVE CORRETA
          value: questionnaireToken 
        };
        iframeRef.current.contentWindow?.postMessage(messagePayload, MAG_WIDGET_ORIGIN);
        
        // Marcamos como enviado, mas permitimos reenvio se o widget pedir
        setTokenSent(true); 
      } catch (err) {
        console.error("[Step9] Erro no envio:", err);
      }
    }
  }, [questionnaireToken, tokenSent]);

  useEffect(() => {
    if (!reservedProposalNumber || !questionnaireToken) prefetchQuestionnaireTokens();
    prefetchPaymentToken();
  }, [reservedProposalNumber, questionnaireToken, prefetchQuestionnaireTokens, prefetchPaymentToken]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setTokenSent(false);
    prefetchQuestionnaireTokens();
  };

  useEffect(() => {
    track('step_view', { step: 9, step_name: 'Questionário de Saúde' });

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== MAG_WIDGET_ORIGIN) return;

      // Se o widget der qualquer sinal de vida (ex: resize), mandamos o token imediatamente
      // Isso resolve problemas de timing onde o onLoad dispara antes do script interno
      if (questionnaireToken) {
          // Não verificamos !tokenSent aqui para garantir que o widget receba
          // mesmo que reinicie internamente
          sendTokenToWidget();
      }

      if (typeof event.data === 'string' && event.data.startsWith('{')) {
        try {
          const data = JSON.parse(event.data);
          if (data.Resposta && data.Id) {
            setFormData({ dpsAnswers: JSON.parse(data.Resposta) });
            track('questionnaire_complete', { questionnaire_id: data.Id });
            nextStep();
          }
        } catch { }
      }
    };

    window.addEventListener('message', handleMessage);

    if (dpsAnswers) {
      setIsLoading(false);
      return () => window.removeEventListener('message', handleMessage);
    }

    const initializeWidget = () => {
      setError(null);
      if (isPrefetchingTokens) {
        setIsLoading(true);
        return;
      }

      if (reservedProposalNumber && questionnaireToken) {
        const questionnaireId = findFirstQuestionnaireId();
        
        // --- URL LIMPA (Sem token na query string) ---
        // Seguindo o padrão do suporte
        const url = `${MAG_WIDGET_ORIGIN}/questionario-Questionario/v2/responder/${questionnaireId}/Venda/${reservedProposalNumber}/0266e8/efb700?listenForToken=true`;
        
        console.log("[Step9] URL Limpa:", url);
        setWidgetUrl(url);
      } else {
        if (!isPrefetchingTokens) {
            setError("Não foi possível iniciar. Tokens indisponíveis.");
            setIsLoading(false);
        }
      }
    };

    initializeWidget();
    return () => window.removeEventListener('message', handleMessage);
  }, [dpsAnswers, setFormData, nextStep, findFirstQuestionnaireId, reservedProposalNumber, questionnaireToken, isPrefetchingTokens, sendTokenToWidget]);

  if (dpsAnswers) {
    return (
      <div className="animate-fade-in text-center py-10">
        <PartyPopper className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-medium text-foreground">Questionário concluído!</h3>
        <Button type="button" variant="outline" onClick={resetDpsAnswers} className="mt-4">Responder Novamente</Button>
        <div className="mt-8 pt-6 border-t flex justify-between items-center w-full">
          <Button type="button" variant="ghost" onClick={prevStep}><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button>
          <Button type="button" onClick={nextStep}>Próximo <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </div>
    );
  }

  return (
    <StepLayout title={`${firstName}, como está a sua saúde?`} description="Responda o questionário abaixo para continuar.">
      <ErrorBoundary fallbackMessage="Erro no sistema de questionário." onReset={handleRetry}>
        <div className="relative border rounded-lg overflow-hidden min-h-[500px] bg-card">
          {isLoading && ( 
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                  <Loader2 className="animate-spin h-12 w-12 text-primary mb-4" />
                  <p className="text-muted-foreground">Carregando...</p>
              </div> 
          )}
          {error && ( 
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 p-4">
              <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
              <p className="font-semibold text-destructive">Erro ao carregar</p>
              <Button onClick={handleRetry} variant="outline" className="mt-4">Tentar Novamente</Button>
            </div> 
          )}
          {widgetUrl && (
            <IframeResizer
              forwardRef={iframeRef}
              key={widgetUrl}
              src={widgetUrl}
              title="Questionário de Saúde"
              checkOrigin={[MAG_WIDGET_ORIGIN]} 
              style={{ width: '1px', minWidth: '100%', border: 0 }}
              onLoad={() => {
                // Backup: Envia no load
                sendTokenToWidget();
                setIsLoading(false);
              }}
            />
          )}
        </div>
      </ErrorBoundary>
      <NavigationButtons showNextButton={false} />
    </StepLayout>
  );
};