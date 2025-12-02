"use client";
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard, Landmark, FileText } from 'lucide-react';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { useCoverageStore } from '@/stores/useCoverageStore';
import { track } from '@/lib/tracking';
import { cn, formatCurrency } from '@goldenbear/ui/lib/utils';
import { StepLayout } from '../StepLayout';
import { NavigationButtons } from '../NavigationButtons';
import { step10Schema, Step10Data } from '@/lib/schemas';

import { CreditCardForm } from './step10/CreditCardForm';
import { DebitForm } from './step10/DebitForm';
import { PayrollForm } from './step10/PayrollForm';

export const Step10 = () => {
  const formData = useSimulatorStore((state) => state.formData);
  const payment = formData.payment || { method: '' };
  
  const { setPaymentData, nextStep } = useSimulatorStore((state) => state.actions);
  const totalPremium = useCoverageStore((state) => state.getTotalPremium());

  const form = useForm<Step10Data>({
    resolver: zodResolver(step10Schema),
    defaultValues: {
      method: (payment.method as any) || undefined,
      creditCard: payment.creditCard,
      debitAccount: payment.debitAccount,
      payroll: payment.payroll
    },
    mode: 'onChange'
  });

  const { watch, setValue, handleSubmit, reset, formState: { isValid } } = form;
  const selectedMethod = watch('method');

  // --- CORREÇÃO CRÍTICA: Sincronizar formulário com a Store ---
  // Isso garante que quando o DevToolbar injetar dados, o formulário preencha visualmente
  useEffect(() => {
    if (payment.method) {
      reset({
        method: payment.method as any,
        creditCard: payment.creditCard,
        debitAccount: payment.debitAccount,
        payroll: payment.payroll
      });
    }
  }, [payment, reset]);
  // ------------------------------------------------------------

  useEffect(() => { 
    track('step_view', { step: 10, step_name: 'Pagamento Nativo' }); 
  }, []);

  const onSubmit = (data: Step10Data) => {
    setPaymentData(data);
    track('step_complete', { 
      step: 10, 
      step_name: 'Dados de Pagamento Preenchidos',
      method: data.method
    });
    nextStep();
  };

  const onError = (errors: any) => {
    console.error("❌ Erro de Validação Step 10:", errors);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <StepLayout 
        title="Como você prefere realizar o pagamento?" 
        description={`Valor mensal: ${formatCurrency(totalPremium)}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            onClick={() => setValue('method', 'CREDIT_CARD', { shouldValidate: true })} 
            className={cn(
              "cursor-pointer rounded-lg border p-4 flex flex-col items-center justify-center gap-3 transition-all hover:bg-accent/50",
              selectedMethod === 'CREDIT_CARD' ? "ring-2 ring-primary border-primary bg-primary/5" : "bg-card"
            )}
          >
            <CreditCard className="h-8 w-8 text-primary" />
            <span className="font-semibold text-sm">Cartão de Crédito</span>
          </div>

          <div 
            onClick={() => setValue('method', 'DEBIT_ACCOUNT', { shouldValidate: true })} 
            className={cn(
              "cursor-pointer rounded-lg border p-4 flex flex-col items-center justify-center gap-3 transition-all hover:bg-accent/50",
              selectedMethod === 'DEBIT_ACCOUNT' ? "ring-2 ring-primary border-primary bg-primary/5" : "bg-card"
            )}
          >
            <Landmark className="h-8 w-8 text-primary" />
            <span className="font-semibold text-sm">Débito em Conta</span>
          </div>

          <div 
            onClick={() => setValue('method', 'PAYROLL_DEDUCTION', { shouldValidate: true })} 
            className={cn(
              "cursor-pointer rounded-lg border p-4 flex flex-col items-center justify-center gap-3 transition-all hover:bg-accent/50",
              selectedMethod === 'PAYROLL_DEDUCTION' ? "ring-2 ring-primary border-primary bg-primary/5" : "bg-card"
            )}
          >
            <FileText className="h-8 w-8 text-primary" />
            <span className="font-semibold text-sm">Desconto em Folha</span>
          </div>
        </div>

        <div className="mt-6 min-h-[300px]">
          {selectedMethod === 'CREDIT_CARD' && <CreditCardForm form={form} />}
          {selectedMethod === 'DEBIT_ACCOUNT' && <DebitForm form={form} />}
          {selectedMethod === 'PAYROLL_DEDUCTION' && <PayrollForm form={form} />}
          
          {!selectedMethod && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-10 opacity-50">
              <p>Selecione uma forma de pagamento acima para continuar.</p>
            </div>
          )}
        </div>

        <NavigationButtons 
          nextLabel="Revisar e Finalizar" 
          isNextDisabled={!isValid} 
       />
      </StepLayout>
    </form>
  );
};