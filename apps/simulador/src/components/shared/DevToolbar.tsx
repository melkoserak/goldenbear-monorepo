"use client";

import React, { useState, useEffect } from 'react';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { PERSONA_CREDIT_CARD, PERSONA_DEBIT, PERSONA_PAYROLL } from '@/lib/debug-personas';
import { Button } from '@goldenbear/ui/components/button';
import { Settings, CreditCard, Landmark, FileText, X, Play } from 'lucide-react';

export const DevToolbar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const setFormData = useSimulatorStore((state) => state.actions.setFormData);
  const setStep = useSimulatorStore((state) => state.actions.setStep);
  const currentStep = useSimulatorStore((state) => state.currentStep);

  useEffect(() => {
    setIsMounted(true);
    // Auto-abrir apenas em localhost para facilitar
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      setIsVisible(true);
    }
  }, []);

  // --- CORREÇÃO AQUI ---
  // Permite renderizar se estiver em desenvolvimento OU se a variável estiver 'true'
  const shouldRender = process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_ENABLE_DEVTOOLS === 'true';

  if (!isMounted) return null;
  if (!shouldRender) return null;

  const handleAutoFill = (persona: any, targetStep: number) => {
    setFormData(persona);
    setTimeout(() => {
        setStep(targetStep);
    }, 50);
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-[9999]">
        <Button size="icon" variant="outline" onClick={() => setIsVisible(true)} className="rounded-full shadow-lg bg-yellow-400 text-black hover:bg-yellow-500">
          <Settings className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] p-4 bg-slate-900 text-white rounded-lg shadow-2xl border border-slate-700 w-72 animate-in slide-in-from-bottom-10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Settings className="w-4 h-4" /> Testes Rápidos
        </h3>
        <button onClick={() => setIsVisible(false)} className="text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Escolha o Perfil:</p>
          <div className="grid grid-cols-3 gap-2">
             <Button 
              variant="secondary" size="sm" className="text-xs h-14 flex-col gap-1"
              onClick={() => handleAutoFill(PERSONA_CREDIT_CARD, 10)}
              title="Cartão de Crédito"
            >
              <CreditCard className="w-4 h-4" /> CC
            </Button>
             <Button 
              variant="secondary" size="sm" className="text-xs h-14 flex-col gap-1"
              onClick={() => handleAutoFill(PERSONA_DEBIT, 10)}
              title="Débito em Conta"
            >
              <Landmark className="w-4 h-4" /> Déb.
            </Button>
             <Button 
              variant="secondary" size="sm" className="text-xs h-14 flex-col gap-1"
              onClick={() => handleAutoFill(PERSONA_PAYROLL, 10)}
              title="Consignado"
            >
              <FileText className="w-4 h-4" /> Folha
            </Button>
          </div>
        </div>

        <div>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Navegação:</p>
          <div className="flex gap-2">
            <Button 
              variant="outline" size="sm" className="flex-1 text-xs h-8 bg-slate-800 border-slate-600"
              onClick={() => setStep(4)}
            >
              Ir p/ Ofertas
            </Button>
            <Button 
              variant="outline" size="sm" className="flex-1 text-xs h-8 bg-slate-800 border-slate-600 text-green-400"
              onClick={() => setStep(12)}
            >
              Ir p/ Final
            </Button>
          </div>
        </div>
        
        <div className="pt-2 mt-2 border-t border-slate-700 text-center">
           <p className="text-[10px] text-slate-400">Passo Atual: <span className="text-yellow-400 font-mono">{currentStep}</span></p>
        </div>
      </div>
    </div>
  );
};