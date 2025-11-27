"use client";
import React, { useEffect, useState, useRef } from 'react';
import IframeResizer from 'iframe-resizer-react';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { useCoverageStore } from '@/stores/useCoverageStore';
import { track } from '@/lib/tracking';
import { Loader2, AlertTriangle, CreditCard, Landmark } from 'lucide-react';
import { NavigationButtons } from '../NavigationButtons';
import { cn } from '@goldenbear/ui/lib/utils';
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { Button } from '@goldenbear/ui/components/button';
import { StepLayout } from '../StepLayout';

const PAYMENT_WIDGET_ORIGIN = 'https://widgetshmg.mongeralaegon.com.br';

export const Step10 = () => {
  const { formData: { paymentMethod, cpf }, paymentPreAuthCode, paymentToken } = useSimulatorStore((state) => state);
  const { setFormData, setAuthData, nextStep, prefetchPaymentToken } = useSimulatorStore((state) => state.actions);
  const totalPremium = useCoverageStore((state) => state.getTotalPremium());
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => { track('step_view', { step: 10, step_name: 'Pagamento' }); }, []);
  
  const handleRetry = () => {
     setIsLoading(true);
     setError(null);
     if (!paymentToken) {
         prefetchPaymentToken();
     } else {
         setFormData({ paymentMethod: '' }); 
         setIsLoading(false);
     }
  };
  
  useEffect(() => {
    setWidgetUrl(null);
    setError(null);
    setAuthData({ paymentPreAuthCode: undefined });

    if (paymentMethod === 'credit') {
      if (paymentToken) {
        setIsLoading(true);
        const totalValue = totalPremium.toFixed(2);
        const cleanedCpf = cpf.replace(/\D/g, '');
        const url = `${PAYMENT_WIDGET_ORIGIN}/widget-cartao-credito/v3/?cnpj=33608308000173&acao=PreAutorizacao&valorCompra=${totalValue}&chave=cpf&valor=${cleanedCpf}&chave=ModeloProposta&valor=EIS`;
        setWidgetUrl(url);
      } else {
        setError("Não foi possível carregar o módulo de pagamento. Tentando recuperar conexão...");
        prefetchPaymentToken();
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
                    setAuthData({ paymentPreAuthCode: preAuthCode });
                }
            } catch { }
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

  return (
    <form onSubmit={handleSubmit}>
      <StepLayout title="Como você gostaria de pagar?">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div onClick={() => setFormData({ paymentMethod: 'credit' })} className={cn("rounded-lg border p-4 flex items-center gap-4 cursor-pointer transition-all hover:bg-accent/50", paymentMethod === 'credit' && 'ring-2 ring-primary border-primary bg-accent/50')}>
            <CreditCard className="h-8 w-8 text-primary" />
            <div>
              <p className="font-semibold">Cartão de Crédito</p>
              <p className="text-sm text-muted-foreground">Pagamento mensal recorrente.</p>
            </div>
          </div>
          <div onClick={() => setFormData({ paymentMethod: 'debit' })} className={cn("rounded-lg border p-4 flex items-center gap-4 cursor-pointer transition-all hover:bg-accent/50", paymentMethod === 'debit' && 'ring-2 ring-primary border-primary bg-accent/50')}>
            <Landmark className="h-8 w-8 text-primary" />
            <div>
              <p className="font-semibold">Débito em Conta</p>
              <p className="text-sm text-muted-foreground">Desconto automático.</p>
            </div>
          </div>
        </div>

        {paymentMethod && (
          <ErrorBoundary fallbackMessage="O módulo de pagamento encontrou um problema." onReset={handleRetry}>
              <div className="relative border rounded-lg overflow-hidden h-full min-h-[600px] bg-card">
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
                      } else { setError("Falha ao autenticar o widget."); }
                      setIsLoading(false);
                  }}
                  />
              )}
              </div>
          </ErrorBoundary>
        )}
        <NavigationButtons isNextDisabled={!paymentPreAuthCode} />
      </StepLayout>
    </form>
  );
};