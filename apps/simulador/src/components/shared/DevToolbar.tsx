"use client";

import React, { useState, useEffect } from 'react';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { 
  PERSONA_CREDIT_CARD, PERSONA_DEBIT, PERSONA_PAYROLL,
  PERSONA_FAMILIA_PPE, PERSONA_SENIOR, PERSONA_JOVEM_MILITAR 
} from '@/lib/debug-personas';
import { Button } from '@goldenbear/ui/components/button';
import { Settings, CreditCard, Landmark, FileText, X, Play, Users, UserPlus, ShieldAlert } from 'lucide-react';

export const DevToolbar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const setFormData = useSimulatorStore((state) => state.actions.setFormData);
  const setStep = useSimulatorStore((state) => state.actions.setStep);
  const currentStep = useSimulatorStore((state) => state.currentStep);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      setIsVisible(true);
    }
  }, []);

  const shouldRender = process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_ENABLE_DEVTOOLS === 'true';

  if (!isMounted) return null;
  if (!shouldRender) return null;

  const handleAutoFill = (persona: any, targetStep: number) => {
    setFormData(persona);
    setTimeout(() => {
        setStep(targetStep);
    }, 100); // Timeout levemente maior para garantir renderização
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
    <div className="fixed bottom-4 right-4 z-[9999] p-4 bg-slate-900 text-white rounded-lg shadow-2xl border border-slate-700 w-80 animate-in slide-in-from-bottom-10 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Settings className="w-4 h-4" /> Testes Rápidos
        </h3>
        <button onClick={() => setIsVisible(false)} className="text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        
        {/* CENÁRIOS BÁSICOS */}
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">Pagamento (Simples):</p>
          <div className="grid grid-cols-3 gap-2">
             <Button 
              variant="secondary" size="sm" className="text-xs h-16 flex-col gap-1 p-1"
              onClick={() => handleAutoFill(PERSONA_CREDIT_CARD, 10)}
              title="Preenche tudo e vai para Pagamento Cartão"
            >
              <CreditCard className="w-4 h-4 mb-1" /> Cartão
            </Button>
             <Button 
              variant="secondary" size="sm" className="text-xs h-16 flex-col gap-1 p-1"
              onClick={() => handleAutoFill(PERSONA_DEBIT, 10)}
              title="Preenche tudo e vai para Pagamento Débito"
            >
              <Landmark className="w-4 h-4 mb-1" /> Débito
            </Button>
             <Button 
              variant="secondary" size="sm" className="text-xs h-16 flex-col gap-1 p-1"
              onClick={() => handleAutoFill(PERSONA_PAYROLL, 10)}
              title="Preenche tudo e vai para Consignado"
            >
              <FileText className="w-4 h-4 mb-1" /> Folha
            </Button>
          </div>
        </div>

        {/* CENÁRIOS COMPLEXOS */}
        <div className="border-t border-slate-700 pt-3">
          <p className="text-[10px] text-blue-400 uppercase font-bold tracking-wider mb-2">Cenários Complexos:</p>
          <div className="grid grid-cols-1 gap-2">
             <Button 
              variant="outline" size="sm" className="text-xs h-9 justify-start bg-slate-800 border-slate-600 hover:bg-slate-700"
              onClick={() => handleAutoFill(PERSONA_FAMILIA_PPE, 8)}
             >
              <ShieldAlert className="w-3 h-3 mr-2 text-red-400" /> Família + PPE + Menores
            </Button>
             <Button 
              variant="outline" size="sm" className="text-xs h-9 justify-start bg-slate-800 border-slate-600 hover:bg-slate-700"
              onClick={() => handleAutoFill(PERSONA_SENIOR, 8)}
             >
              <UserPlus className="w-3 h-3 mr-2 text-purple-400" /> Sênior (Viúvo + Filhos)
            </Button>
             <Button 
              variant="outline" size="sm" className="text-xs h-9 justify-start bg-slate-800 border-slate-600 hover:bg-slate-700"
              onClick={() => handleAutoFill(PERSONA_JOVEM_MILITAR, 10)}
             >
              <Users className="w-3 h-3 mr-2 text-green-400" /> Jovem Militar (Mãe)
            </Button>
          </div>
        </div>

        {/* NAVEGAÇÃO RÁPIDA */}
        <div className="border-t border-slate-700 pt-3">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">Saltar Para:</p>
          <div className="flex gap-2">
            <Button 
              variant="ghost" size="sm" className="flex-1 text-xs h-8 text-slate-300 hover:bg-slate-800"
              onClick={() => setStep(4)}
            >
              Ofertas
            </Button>
            <Button 
              variant="ghost" size="sm" className="flex-1 text-xs h-8 text-slate-300 hover:bg-slate-800"
              onClick={() => setStep(8)}
            >
              Benefic.
            </Button>
            <Button 
              variant="ghost" size="sm" className="flex-1 text-xs h-8 text-green-400 hover:bg-green-900/20 font-bold"
              onClick={() => setStep(12)}
            >
              FINAL
            </Button>
          </div>
        </div>
        
        <div className="pt-2 mt-1 border-t border-slate-700 text-center">
           <p className="text-[10px] text-slate-500">Passo Atual: <span className="text-yellow-500 font-mono">{currentStep}</span></p>
        </div>
      </div>
    </div>
  );
};