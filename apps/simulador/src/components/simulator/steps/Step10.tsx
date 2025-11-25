"use client";
import React, { useEffect, useState, useRef } from 'react';
import IframeResizer from 'iframe-resizer-react';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { useCoverageStore } from '@/stores/useCoverageStore';
import { track } from '@/lib/tracking';
import { Loader2, AlertTriangle, CreditCard, Landmark } from 'lucide-react';
import { NavigationButtons } from '../NavigationButtons';
import { cn } from '@goldenbear/ui/lib/utils';
import { ErrorBoundary } from "@/components/shared/ErrorBoundary"; // Importe o ErrorBoundary
import { Button } from '@goldenbear/ui/components/button';

const PAYMENT_WIDGET_ORIGIN = 'https://widgetshmg.mongeralaegon.com.br';

export const Step10 = () => {
  // 1. Acesso ao Estado Refatorado
  const { 
      formData: { paymentMethod, cpf }, // FormSlice
      paymentPreAuthCode,               // AuthSlice (Root)
      paymentToken                      // AuthSlice (Root)
  } = useSimulatorStore((state) => state);

  // Actions
  const { 
      setFormData, 
      setAuthData,          // Necessário para atualizar o paymentPreAuthCode
      nextStep, 
      prefetchPaymentToken 
  } = useSimulatorStore((state) => state.actions);
  
  const totalPremium = useCoverageStore((state) => state.getTotalPremium());
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    track('step_view', { step: 10, step_name: 'Pagamento' });
  }, []);
  
  // 2. Função de Retry para ErrorBoundary
  const handleRetry = () => {
     setIsLoading(true);
     setError(null);
     if (!paymentToken) {
         prefetchPaymentToken();
     } else {
         // Se o token existe, reseta o método para forçar re-render da escolha
         setFormData({ paymentMethod: '' }); 
         setIsLoading(false);
     }
  };
  
  useEffect(() => {
    setWidgetUrl(null);
    setError(null);
    // Limpa código anterior ao mudar método
    setAuthData({ paymentPreAuthCode: undefined });

    if (paymentMethod === 'credit') {
      if (paymentToken) {
        console.log("[Step10] Iniciando widget de pagamento.");
        setIsLoading(true);
        
        const totalValue = totalPremium.toFixed(2);
        const cleanedCpf = cpf.replace(/\D/g, '');
        
        const url = `${PAYMENT_WIDGET_ORIGIN}/widget-cartao-credito/v3/?cnpj=33608308000173&acao=PreAutorizacao&valorCompra=${totalValue}&chave=cpf&valor=${cleanedCpf}&chave=ModeloProposta&valor=EIS`;
        setWidgetUrl(url);
      } else {
        console.warn("[Step10] Token de pagamento indisponível.");
        setError("Não foi possível carregar o módulo de pagamento. Tentando recuperar conexão...");
        prefetchPaymentToken(); // Tenta buscar se falhar
      }
    } else if (paymentMethod === 'debit') {
      setError("Opção de Débito em Conta ainda não disponível.");
    }

    const handleMessage = (event: MessageEvent) => {
        if (event.origin !== PAYMENT_WIDGET_ORIGIN) return;

        if (typeof event.data === 'string' && event.data.startsWith('{')) {
            try {
                const data = JSON.parse(event.data);
                const preAuthCode = data?.Valor?.CodigoPreAutorizacao;
                if (preAuthCode) {
                    console.log("[Step10] Código de pré-autorização recebido com sucesso.");
                    // CORREÇÃO: Salva no AuthSlice
                    setAuthData({ paymentPreAuthCode: preAuthCode });
                }
            } catch { /* Ignora */ }
        }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);

  }, [paymentMethod, totalPremium, cpf, setFormData, setAuthData, paymentToken, prefetchPaymentToken]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentPreAuthCode) {
      track('step_complete', { step: 10, step_name: 'Pagamento', payment_method: 'credit' });
      nextStep();
    }
  };

  const isFormValid = !!paymentPreAuthCode;

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <h3 tabIndex={-1} className="text-2xl font-medium text-left mb-8 text-foreground outline-none">
        Como você gostaria de pagar?
      </h3>
      
      {/* Seleção de Método */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div onClick={() => setFormData({ paymentMethod: 'credit' })} className={cn("rounded-lg border p-4 flex items-center gap-4 cursor-pointer transition-all", paymentMethod === 'credit' && 'ring-2 ring-primary border-primary')}>
          <CreditCard className="h-8 w-8 text-primary" />
          <div>
            <p className="font-semibold">Cartão de Crédito</p>
            <p className="text-sm text-muted-foreground">Pagamento mensal recorrente.</p>
          </div>
        </div>
        <div onClick={() => setFormData({ paymentMethod: 'debit' })} className={cn("rounded-lg border p-4 flex items-center gap-4 cursor-pointer transition-all", paymentMethod === 'debit' && 'ring-2 ring-primary border-primary')}>
          <Landmark className="h-8 w-8 text-primary" />
          <div>
            <p className="font-semibold">Débito em Conta</p>
            <p className="text-sm text-muted-foreground">Desconto automático na sua conta.</p>
          </div>
        </div>
      </div>

      {/* Área do Widget com ErrorBoundary */}
      {paymentMethod && (
        <ErrorBoundary 
            fallbackMessage="O módulo de pagamento encontrou um problema." 
            onReset={handleRetry}
        >
            <div className="relative border rounded-lg overflow-hidden h-full min-h-[600px]">
            
            {isLoading && ( 
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                    <Loader2 className="animate-spin h-10 w-10 text-primary mb-4" />
                    <p>Carregando ambiente de pagamento seguro...</p>
                </div> 
            )}
            
            {error && ( 
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
                    <p className="font-semibold text-destructive">{error}</p>
                    <Button variant="outline" onClick={handleRetry} className="mt-4">Tentar Novamente</Button>
                </div> 
            )}
            
            {widgetUrl && !error && (
                <IframeResizer
                forwardRef={iframeRef}
                key={widgetUrl}
                src={widgetUrl}
                title="Pagamento Seguro"
                checkOrigin={[PAYMENT_WIDGET_ORIGIN]}
                style={{ width: '1px', minWidth: '100%', border: 0, height: '100%', paddingTop: '48px' }}
                onLoad={() => {
                    if (iframeRef.current && paymentToken) {
                    iframeRef.current.contentWindow?.postMessage({ event: 'notify', property: 'Auth', value: paymentToken }, PAYMENT_WIDGET_ORIGIN);
                    } else {
                    console.error("[Step10] Erro de estado no iframe.");
                    setError("Falha ao autenticar o widget.");
                    }
                    setIsLoading(false);
                }}
                />
            )}
            </div>
        </ErrorBoundary>
      )}
      
      <NavigationButtons isNextDisabled={!isFormValid} />
    </form>
  );
};