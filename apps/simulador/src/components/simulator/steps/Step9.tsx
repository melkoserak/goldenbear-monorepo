"use client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import IframeResizer from 'iframe-resizer-react';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { useCoverageStore } from '@/stores/useCoverageStore';
// --- CORREÇÃO 1: Removido 'getWidgetToken' ---
import { reserveProposalNumber, getQuestionnaireToken } from '@/services/apiService';
import { track } from '@/lib/tracking';
import { Loader2, AlertTriangle, PartyPopper, ArrowLeft, ArrowRight } from 'lucide-react';
import { NavigationButtons } from '../NavigationButtons';
import { Button } from '@goldenbear/ui/components/button';

export const Step9 = () => {
  const { dpsAnswers } = useSimulatorStore((state) => state.formData);
  const { setFormData, nextStep, prevStep, resetDpsAnswers } = useSimulatorStore((state) => state.actions);
  const firstName = useSimulatorStore((state) => state.formData.fullName.split(' ')[0] || "");
  const simulationDataStore = useCoverageStore((state) => state.coverages);

  const [isLoading, setIsLoading] = useState(!dpsAnswers);
  const [error, setError] = useState<string | null>(null);
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null);
  // --- CORREÇÃO 2: Novo estado para o token ---
  const [questionnaireToken, setQuestionnaireToken] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const findFirstQuestionnaireId = useCallback(() => {
    // ... (código da função existente mantido)
    if (!simulationDataStore || simulationDataStore.length === 0) return 'Venda';
    const firstCoverageWithQuestionnaire = simulationDataStore.find(cov => cov.originalData?.questionariosPorFaixa?.[0]?.questionarios?.[0]?.idQuestionario);
    return firstCoverageWithQuestionnaire?.originalData?.questionariosPorFaixa?.[0]?.questionarios?.[0]?.idQuestionario || 'Venda';
  }, [simulationDataStore]);

  useEffect(() => {
    track('step_view', { step: 9, step_name: 'Questionário de Saúde' });

    const handleMessage = (event: MessageEvent) => {
      // ... (código existente de handleMessage mantido)
      if (event.origin !== 'https://widgetshmg.mag.com.br') return;
      if (typeof event.data === 'string' && event.data.startsWith('{')) {
        try {
          const data = JSON.parse(event.data);
          if (data.Resposta && data.Id) {
            setFormData({ dpsAnswers: JSON.parse(data.Resposta) });
            track('questionnaire_complete', { questionnaire_id: data.Id });
            nextStep();
          }
        } catch {
          console.error('Erro ao processar mensagem JSON do iframe:');
        }
      }
    };

    window.addEventListener('message', handleMessage);

    if (dpsAnswers) {
      setIsLoading(false);
      return () => window.removeEventListener('message', handleMessage);
    }

    const initializeWidget = async () => {
      setIsLoading(true);
      setError(null);
      setWidgetUrl(null);
      try {
        // 1. Reserva a proposta.
        console.log("[BFF-FRONTEND] Step 9: Chamando reserveProposalNumber()..."); // <-- LOG
        const { proposalNumber } = await reserveProposalNumber();
        setFormData({ reservedProposalNumber: proposalNumber });
        console.log("[BFF-FRONTEND] Step 9: Número da proposta RECEBIDO:", proposalNumber); // <-- LOG

        // 2. Busca o token do questionário.
        console.log("[BFF-FRONTEND] Step 9: Chamando getQuestionnaireToken()..."); // <-- LOG
        const { token } = await getQuestionnaireToken();
        setQuestionnaireToken(token); // Salva no estado
        console.log("[BFF-FRONTEND] Step 9: Token do questionário RECEBIDO (início):", token.substring(0, 10) + "..."); // <-- LOG

        const questionnaireId = findFirstQuestionnaireId();
        const url = `https://widgetshmg.mag.com.br/questionario-Questionario/v2/responder/${questionnaireId}/Venda/${proposalNumber}/0266e8/efb700?listenForToken=true`;
  
        console.log("URL do questionário gerada:", { questionnaireId, proposalNumber, url });
        setWidgetUrl(url); // Define a URL para renderizar o iframe

      } catch (err) {
        const error = err as Error;
        setError(error.message || "Não foi possível carregar o questionário.");
        track('questionnaire_error', { error_message: error.message });
        setIsLoading(false);
      }
    };

    initializeWidget();

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [dpsAnswers, setFormData, nextStep, findFirstQuestionnaireId]);

  // Tela de sucesso (quando o questionário está respondido)
  if (dpsAnswers) {
    // ... (código existente da tela de sucesso mantido)
    return (
      <div className="animate-fade-in text-center">
        <PartyPopper className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-medium text-foreground">Questionário concluído!</h3>
        <p className="text-muted-foreground mt-2 mb-6">Você já respondeu ao questionário de saúde. Clique em &quot;Próximo&quot; para continuar ou refaça se necessário.</p>
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

  // Tela principal (enquanto responde o questionário)
  return (
    <div className="animate-fade-in">
      <h3 tabIndex={-1} className="text-2xl font-medium text-left mb-2 text-foreground outline-none">
        {firstName}, como está a sua saúde? 
      </h3>
      <p className="text-left text-muted-foreground mb-8">
        Por favor, responda o questionário seguro abaixo para continuar.
      </p>
      <div className="relative border rounded-lg overflow-hidden min-h-[500px] p-3 px-6">
        {isLoading && ( <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10"><Loader2 className="animate-spin h-12 w-12 text-primary mb-4" /><p className="text-muted-foreground">Carregando questionário seguro...</p></div> )}
        {error && ( <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 p-4"><AlertTriangle className="h-12 w-12 text-destructive mb-4" /><p className="font-semibold text-destructive">Erro ao carregar</p><p className="text-muted-foreground text-center">{error}</p><Button onClick={resetDpsAnswers} className="mt-4">Tentar Novamente</Button></div> )}
        {widgetUrl && (
          <>
            <IframeResizer
              forwardRef={iframeRef}
              key={widgetUrl}
              src={widgetUrl}
              title="Questionário de Saúde MAG"
              checkOrigin={false}
              style={{ width: '1px', minWidth: '100%', border: 0 }}
              // --- CORREÇÃO 4: Simplificado o onLoad ---
              onLoad={() => {
                // --- LOGS ADICIONADOS AQUI ---
                console.log("[BFF-FRONTEND] Step 9: Iframe onLoad disparado."); 
                try {
                  if (iframeRef.current && questionnaireToken) {
                    console.log("[BFF-FRONTEND] Step 9: Token PRONTO. Injetando no iframe...", questionnaireToken.substring(0, 10) + "...");
                    iframeRef.current.contentWindow?.postMessage({
                      event: 'notify', property: 'Token', value: questionnaireToken
                    }, 'https://widgetshmg.mag.com.br');
                  } else if (!questionnaireToken) {
                    console.error("[BFF-FRONTEND] Step 9: Iframe carregou, mas o token AINDA NÃO ESTAVA PRONTO.");
                    throw new Error("Token do questionário não estava pronto no onLoad.");
                  } else {
                    console.warn("[BFF-FRONTEND] Step 9: Iframe carregou, token pronto, mas iframeRef.current é nulo.");
                  }
                } catch (err) {
                   const error = err as Error;
                   console.error("[BFF-FRONTEND] Step 9: Erro ao injetar token", error);
                   setError("Falha ao autenticar o questionário: " + error.message);
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