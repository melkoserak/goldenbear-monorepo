"use client"; 


import { SimulatorForm } from "@/components/simulator/SimulatorForm";
import Image from 'next/image';
// 1. Importe os componentes de acessibilidade
import { AccessibilityController } from "@/components/layout/AccessibilityController";
import { Popover, PopoverContent, PopoverTrigger } from "@goldenbear/ui/components/popover";
import { Button } from "@goldenbear/ui/components/button";
import { Accessibility } from "lucide-react";

// Remova o 'force-static' daqui também
// export const dynamic = 'force-static';

export default function SimulatorPage() {
  return (
    <main className="flex flex-col items-center w-full p-4 md:p-6  gap-10">
      <header className="w-full max-w-5xl flex items-center justify-between">
        <div className="flex items-center">
          <Image 
            src={"/simulador/logo-golden-bear.png"} // Corrigido para /simulador
            alt="Logo Golden Bear" 
            width={56} 
            height={16} 
            className="h-4 w-auto mr-3" 
          />
          <span className="text-sm text-[#3D3D3D]">Simulador de seguro de vida</span>
        </div>
        
        {/* 2. Adicione o Popover de Acessibilidade */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Opções de acessibilidade">
              <Accessibility className="h-5 w-5 text-text-light" /> {/* <-- Correto */}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0">
            <AccessibilityController />
          </PopoverContent>
        </Popover>

      </header>
      <div className="w-full max-w-5xl text-left">
        {/* ... (resto da página) ... */}
        <h1 className="text-2xl max-w-[474px] font-medium leading-snug text-foreground">
          Descubra o <span className="font-bold text-primary">plano ideal para você </span>
          e envie sua proposta em poucos passos.
        </h1>
      </div>
      <SimulatorForm />
      <footer className="w-full max-w-5xl flex justify-between pt-5 border-t border-border text-sm text-gray-600">
        <p>Esta com duvidas? <a href="/faq" className="font-bold text-primary hover:underline">Leia nosso FAQ</a></p>
        <p>Esta precisando de suporte? <a href="#" className="font-bold text-primary hover:underline">Fale com a gente pelo WhatsApp</a></p>
      </footer>
    </main>
  );
}