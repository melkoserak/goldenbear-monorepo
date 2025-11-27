"use client";
import React, { useEffect, useState, useRef } from 'react';
import IframeResizer from 'iframe-resizer-react';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { useCoverageStore } from '@/stores/useCoverageStore';
import { track } from '@/lib/tracking';
import { Loader2, AlertTriangle, CreditCard, Landmark, CheckCircle2 } from 'lucide-react';
import { NavigationButtons } from '../NavigationButtons';
import { cn } from '@goldenbear/ui/lib/utils';
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { Button } from '@goldenbear/ui/components/button';
import { StepLayout } from '../StepLayout';

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
  
  // 1. Inicialização: Constrói a URL (AGORA ESTRITAMENTE ORDENADA)
  useEffect(() => {
    setWidgetUrl(null);
    setError(null);
    
    if (paymentMethod === 'credit') {
      if (paymentToken) {
        setIsLoading(true);
        
        const totalValue = totalPremium.toFixed(2);
        const cleanedCpf = cpf.replace(/\D/g, '');
        
        // Variáveis de Ambiente (Garantia de Alinhamento HMG/PROD)
        const widgetOrigin = process.env.NEXT_PUBLIC_MAG_WIDGET_URL || 'https://widgetshmg.mongeralaegon.com.br';
        const cnpj = process.env.NEXT_PUBLIC_MAG_CNPJ_FATURAMENTO || '33608308000173'; 
        const modeloProposta = process.env.NEXT_PUBLIC_MAG_MODELO_PROPOSTA || 'EIS';

        const params = new URLSearchParams();
        
        // 1. Parâmetros Base
        params.append('cnpj', cnpj);
        params.append('acao', 'PreAutorizacao');
        params.append('valorCompra', totalValue);
        
        // 2. Metadados - CHAVES (Agrupadas, conforme documentação de texto)
        params.append('chave', 'cpf');
        params.append('chave', 'ModeloProposta');
        
        // 3. Metadados - VALORES (Agrupados, na mesma ordem exata das chaves)
        params.append('valor', cleanedCpf);
        params.append('valor', modeloProposta);

        // Decodifica para garantir que a URL fique visualmente limpa no log, 
        // mas o browser vai encodar corretamente ao chamar.
        const url = `${widgetOrigin}/widget-cartao-credito/v3/?${params.toString()}`;
        
        console.log("[Step10] Montando Widget (Modo Estrito):", url);
        setWidgetUrl(url);
      } else {
        setError("Aguardando sistema de pagamento...");
        prefetchPaymentToken();
      }
    } else if (paymentMethod === 'debit') {
      setError("Opção de Débito em Conta ainda não disponível. Selecione Cartão de Crédito.");
    }

    // 2. Listener de Mensagens
    const handleMessage = (event: MessageEvent) => {
        if (typeof event.data !== 'string' && typeof event.data !== 'object') return;

        let data = event.data;
        if (typeof data === 'string' && data.startsWith('{')) {
            try { data = JSON.parse(data); } catch {}
        }

        const valor = data?.Valor;
        
        if (valor && valor.Sucesso && valor.CodigoPreAutorizacao) {
            console.log("✅ Pagamento Aprovado! Código:", valor.CodigoPreAutorizacao);
            setAuthData({ paymentPreAuthCode: valor.CodigoPreAutorizacao });
            track('payment_pre_auth_success', { code: valor.CodigoPreAutorizacao });
        } else if (valor && valor.Sucesso === false) {
             console.warn("❌ Pagamento Recusado:", data);
        }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [paymentMethod, totalPremium, cpf, setFormData, setAuthData, paymentToken, prefetchPaymentToken]);

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (paymentPreAuthCode) nextStep(); }}>
      <StepLayout title="Como você gostaria de pagar?">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div onClick={() => setFormData({ paymentMethod: 'credit' })} className={cn("rounded-lg border p-4 flex items-center gap-4 cursor-pointer transition-all hover:bg-accent/50", paymentMethod === 'credit' && 'ring-2 ring-primary border-primary bg-accent/50')}>
            <CreditCard className="h-8 w-8 text-primary" />
            <div>
              <p className="font-semibold">Cartão de Crédito</p>
              <p className="text-sm text-muted-foreground">Pagamento mensal recorrente.</p>
            </div>
          </div>
          <div onClick={() => setFormData({ paymentMethod: 'debit' })} className={cn("rounded-lg border p-4 flex items-center gap-4 cursor-pointer transition-all hover:bg-accent/50 opacity-60", paymentMethod === 'debit' && 'ring-2 ring-primary border-primary bg-accent/50')}>
            <Landmark className="h-8 w-8 text-primary" />
            <div>
              <p className="font-semibold">Débito em Conta</p>
              <p className="text-sm text-muted-foreground">Em breve.</p>
            </div>
          </div>
        </div>

        {paymentMethod === 'credit' && (
          <ErrorBoundary fallbackMessage="Erro no carregamento do pagamento." onReset={handleRetry}>
              <div className="relative border rounded-lg overflow-hidden bg-card mt-6 min-h-[600px]">
              
              {paymentPreAuthCode ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-30 animate-fade-in">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                          <CheckCircle2 className="h-10 w-10 text-green-600" />
                      </div>
                      <h4 className="text-2xl font-bold text-green-700">Cartão Aprovado!</h4>
                      <p className="text-muted-foreground mt-2">Clique em "Finalizar Contratação" abaixo.</p>
                  </div>
              ) : (
                  <>
                      {isLoading && ( 
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20">
                              <Loader2 className="animate-spin h-10 w-10 text-primary mb-4" />
                              <p className="text-sm font-medium text-muted-foreground">Carregando ambiente seguro...</p>
                          </div> 
                      )}
                      
                      {error ? ( 
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-20">
                              <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
                              <p className="font-semibold text-destructive">{error}</p>
                              <Button variant="outline" onClick={handleRetry} className="mt-4">Tentar Novamente</Button>
                          </div> 
                      ) : (
                          widgetUrl && (
                              <IframeResizer
                                  forwardRef={iframeRef}
                                  key={widgetUrl}
                                  src={widgetUrl}
                                  title="Pagamento Seguro"
                                  checkOrigin={false}
                                  style={{ width: '1px', minWidth: '100%', border: 0, minHeight: '600px' }}
                                  onLoad={() => {
                                      if (iframeRef.current && paymentToken) {
                                          console.log("🚀 Enviando Token de Pagamento...");
                                          iframeRef.current.contentWindow?.postMessage({ 
                                              event: 'notify', property: 'Auth', value: paymentToken 
                                          }, '*');
                                          setIsLoading(false);
                                      }
                                  }}
                              />
                          )
                      )}
                  </>
              )}
              </div>
          </ErrorBoundary>
        )}
        
        <NavigationButtons nextLabel="Finalizar Contratação" isNextDisabled={!paymentPreAuthCode} />
      </StepLayout>
    </form>
  );
};