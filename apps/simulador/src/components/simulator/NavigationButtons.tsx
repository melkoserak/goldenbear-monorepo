"use client";
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@goldenbear/ui/components/button';
import { useSimulatorStore } from '@/stores/useSimulatorStore';

type NavigationButtonsProps = { 
  isNextDisabled?: boolean; 
  nextLabel?: string; 
  showNextButton?: boolean;
  isLoading?: boolean; // Nova prop
};

export const NavigationButtons = ({ 
  isNextDisabled = false, 
  nextLabel = "Próximo", 
  showNextButton = true,
  isLoading = false 
}: NavigationButtonsProps) => {
  const currentStep = useSimulatorStore((state) => state.currentStep);
  const { prevStep } = useSimulatorStore((state) => state.actions);

  const showBackButton = currentStep > 1;

  let justifyClass = 'justify-end';
  if (showBackButton && showNextButton) {
    justifyClass = 'justify-between';
  } else if (showBackButton && !showNextButton) {
    justifyClass = 'justify-start';
  }

  return (
    <div className={`mt-8 pt-6 border-t border-border flex ${justifyClass}`}>
      {showBackButton && (
        <Button 
          type="button" 
          variant="ghost" 
          onClick={prevStep}
          disabled={isLoading} // Desabilita voltar enquanto carrega
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      )}
      
      {showNextButton && (
        <Button type="submit" disabled={isNextDisabled || isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              {nextLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );
};