"use client";

import React, { useState, useEffect } from 'react';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { Button } from '@goldenbear/ui/components/button'; // Padrão correto
import { 
  Settings, 
  CreditCard, 
  Landmark, 
  FileText, 
  X, 
  Users, 
  UserPlus, 
  ShieldAlert, 
  Briefcase 
} from 'lucide-react';

import { 
  PERSONA_CREDIT_CARD, 
  PERSONA_DEBIT, 
  PERSONA_PAYROLL,
  PERSONA_FAMILIA_PPE, 
  PERSONA_SENIOR, 
  PERSONA_JOVEM_MILITAR,
  PERSONA_DEBIT_THIRD_PARTY
} from '@/lib/debug-personas';

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

  if (!isMounted || !shouldRender) return null;

  const handleAutoFill = (persona: any, targetStep: number = 10) => {
    setFormData(persona);
    setTimeout(() => {
        setStep(targetStep);
    }, 150);
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-[9999]">
        <Button 
          variant="outline" 
          onClick={() => setIsVisible(true)} 
          className="rounded-full h-12 w-12 shadow-xl bg-yellow-400 text-black hover:bg-yellow-500 border-2 border-yellow-600 p-0"
        >
          <Settings className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] p-4 bg-slate-950 text-white rounded-xl shadow-2xl border border-slate-800 w-80 animate-in slide-in-from-bottom-10 max-h-[90vh] overflow-y-auto">
      
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
        <h3 className="font-bold text-sm flex items-center gap-2 text-yellow-400">
          <Settings className="w-4 h-4" /> 
          GoldenBear DevTools
        </h3>
        <button onClick={() => setIsVisible(false)} className="text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-5">
        
        {/* FLUXO PADRÃO */}
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">
            Fluxos de Pagamento
          </p>
          <div className="grid grid-cols-3 gap-2">
             <Button 
              variant="secondary" 
              className="text-[10px] h-14 flex flex-col gap-1 p-1 bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200"
              onClick={() => handleAutoFill(PERSONA_CREDIT_CARD)}
            >
              <CreditCard className="w-4 h-4 mb-0.5 text-blue-400" /> 
              Cartão
            </Button>
             <Button 
              variant="secondary" 
              className="text-[10px] h-14 flex flex-col gap-1 p-1 bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200"
              onClick={() => handleAutoFill(PERSONA_DEBIT)}
            >
              <Landmark className="w-4 h-4 mb-0.5 text-purple-400" /> 
              Débito
            </Button>
             <Button 
              variant="secondary" 
              className="text-[10px] h-14 flex flex-col gap-1 p-1 bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200"
              onClick={() => handleAutoFill(PERSONA_PAYROLL)}
            >
              <FileText className="w-4 h-4 mb-0.5 text-green-400" /> 
              Folha
            </Button>
          </div>
        </div>

        {/* SUPORTE / CORREÇÕES */}
        <div className="bg-red-950/30 p-3 rounded-lg border border-red-900/50">
          <p className="text-[10px] text-red-400 uppercase font-bold tracking-wider mb-2 flex items-center gap-1">
             🚨 Testes de Suporte
          </p>
          <div className="grid grid-cols-1 gap-2">
             <Button 
              variant="outline" 
              className="text-xs h-10 justify-start bg-red-900/10 border-red-800 text-red-100 hover:bg-red-900/30 w-full"
              onClick={() => handleAutoFill(PERSONA_DEBIT_THIRD_PARTY, 10)}
            >
              <Users className="w-4 h-4 mr-2 text-red-500" /> 
              Débito: Terceiro (Esposa)
            </Button>
          </div>
        </div>

        {/* CENÁRIOS COMPLEXOS */}
        <div>
          <p className="text-[10px] text-blue-400 uppercase font-bold tracking-wider mb-2">
            Cenários Complexos
          </p>
          <div className="space-y-2">
             <Button 
              variant="ghost" 
              className="w-full justify-start text-xs h-9 text-slate-300 hover:bg-slate-800 border border-transparent hover:border-slate-700"
              onClick={() => handleAutoFill(PERSONA_FAMILIA_PPE, 10)}
             >
              <ShieldAlert className="w-3.5 h-3.5 mr-2 text-amber-500" /> 
              Família + PPE + Menores
            </Button>
             <Button 
              variant="ghost" 
              className="w-full justify-start text-xs h-9 text-slate-300 hover:bg-slate-800 border border-transparent hover:border-slate-700"
              onClick={() => handleAutoFill(PERSONA_SENIOR, 10)}
             >
              <UserPlus className="w-3.5 h-3.5 mr-2 text-indigo-400" /> 
              Sênior (65+) + Filhos
            </Button>
             <Button 
              variant="ghost" 
              className="w-full justify-start text-xs h-9 text-slate-300 hover:bg-slate-800 border border-transparent hover:border-slate-700"
              onClick={() => handleAutoFill(PERSONA_JOVEM_MILITAR, 10)}
             >
              <Briefcase className="w-3.5 h-3.5 mr-2 text-emerald-500" /> 
              Militar Jovem + Mãe
            </Button>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-3">
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 text-[10px] h-7 bg-slate-900 border-slate-700 text-slate-400 hover:text-white" onClick={() => setStep(4)}>Ofertas</Button>
            <Button variant="outline" className="flex-1 text-[10px] h-7 bg-slate-900 border-slate-700 text-slate-400 hover:text-white" onClick={() => setStep(8)}>Benefic.</Button>
            <Button variant="outline" className="flex-1 text-[10px] h-7 bg-slate-900 border-slate-700 text-green-400 hover:text-green-300 font-bold" onClick={() => setStep(12)}>FIM</Button>
          </div>
          <div className="mt-2 text-center">
             <span className="text-[10px] text-slate-600 font-mono">
               Passo: {currentStep}
             </span>
          </div>
        </div>

      </div>
    </div>
  );
};