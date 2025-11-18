/// src/components/simulator/steps/Step10.tsx
"use client";
import React, { useEffect, useState, useRef } from 'react';
// 1. IMPORTAMOS O 'IframeResizer' COM O NOME CORRETO
import IframeResizer from 'iframe-resizer-react';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { useCoverageStore } from '@/stores/useCoverageStore';
//import { getPaymentToken } from '@/services/apiService';
import { track } from '@/lib/tracking';
import { Loader2, AlertTriangle, CreditCard, Landmark } from 'lucide-react';
import { NavigationButtons } from '../NavigationButtons';
import { cn } from '@goldenbear/ui/lib/utils';

export const Step10 = () => {
  // --- 2. LER OS DADOS DO ESTADO ---
  const { paymentMethod, paymentPreAuthCode, cpf, paymentToken } = useSimulatorStore((state) => state.formData);
  const { setFormData, nextStep } = useSimulatorStore((state) => state.actions);
  const totalPremium = useCoverageStore((state) => state.getTotalPremium());
  
  const [isLoading, setIsLoading] = useState(false); // Apenas para o Iframe, não para o token
  const [error, setError] = useState<string | null>(null);
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null);
  // const [paymentToken, setPaymentToken] = useState<string | null>(null); // <-- REMOVIDO
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

useEffect(() => {
    track('step_view', { step: 10, step_name: 'Pagamento' });
  }, []);
  
  // --- 3. LÓGICA DE 'useEffect' ATUALIZADA ---
  useEffect(() => {
    setWidgetUrl(null);
    setError(null);
    setFormData({ paymentPreAuthCode: undefined });

    if (paymentMethod === 'credit') {
      // Verifica se o token (do prefetch) já está disponível
      if (paymentToken) {
        console.log("[Step10] Payment Token (Prefetched) encontrado!");
        setIsLoading(true); // Ativa o loading do *iframe*
        
        const totalValue = totalPremium.toFixed(2);
        const cleanedCpf = cpf.replace(/\D/g, '');
        
        const url = `https://widgetshmg.mongeralaegon.com.br/widget-cartao-credito/v3/?cnpj=33608308000173&acao=PreAutorizacao&valorCompra=${totalValue}&chave=cpf&valor=${cleanedCpf}&chave=ModeloProposta&valor=EIS`;
        setWidgetUrl(url);
        // O setIsLoading(false) será chamado no onLoad do IframeResizer
      } else {
        // Fallback (se o utilizador recarregar a página aqui ou o prefetch falhar)
        console.warn("[Step10] Payment Token não encontrado no prefetch. A executar fallback.");
        setError("Não foi possível carregar o módulo de pagamento. Por favor, tente recarregar a página.");
        setIsLoading(false);
      }
    } else if (paymentMethod === 'debit') {
      setError("Opção de Débito em Conta ainda não disponível.");
    }

    const handleMessage = (event: MessageEvent) => {
        if (event.origin !== 'https://widgetshmg.mongeralaegon.com.br') return;
        if (typeof event.data === 'string' && event.data.startsWith('{')) {
            try {
                const data = JSON.parse(event.data);
                const preAuthCode = data?.Valor?.CodigoPreAutorizacao;
                if (preAuthCode) {
                    console.log("Código de pré-autorização recebido:", preAuthCode);
                    setFormData({ paymentPreAuthCode: preAuthCode });
                }
            } catch { /* Ignora mensagens que não são JSON */ }
        }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);

  }, [paymentMethod, totalPremium, cpf, setFormData, paymentToken]);

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

      {paymentMethod && (
        <div className="relative border rounded-lg overflow-hidden h-full">
          {isLoading && ( <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10"><Loader2 className="animate-spin h-10 w-10 text-primary mb-4" /><p>Carregando ambiente de pagamento seguro...</p></div> )}
          {error && ( <div className="absolute inset-0 flex flex-col items-center justify-center p-4"><AlertTriangle className="h-10 w-10 text-destructive mb-4" /><p className="font-semibold text-destructive">{error}</p></div> )}
          
           {widgetUrl && !error && (
            <IframeResizer
              forwardRef={iframeRef}
              key={widgetUrl}
              src={widgetUrl}
              title="Widget de Pagamento MAG"
              checkOrigin={false}
              style={{ width: '1px', minWidth: '100%', border: 0, height: '100%', paddingTop: '48px' }}
              onLoad={() => {
                // --- 5. LÓGICA ONLOAD ATUALIZADA ---
                // O 'paymentToken' é lido diretamente do estado (que foi pre-fetched)
                if (iframeRef.current && paymentToken) {
                  iframeRef.current.contentWindow?.postMessage({ event: 'notify', property: 'Auth', value: paymentToken }, 'https://widgetshmg.mongeralaegon.com.br');
                } else {
                  console.error("[Step10] Iframe carregou, mas o Payment Token não estava pronto no estado.");
                  setError("Falha ao autenticar o widget de pagamento.");
                }
                setIsLoading(false); // Esconde o spinner do iframe
              }}
            />
          )}
        </div>
      )}
      
      <NavigationButtons isNextDisabled={!isFormValid} />
    </form>
  );
};