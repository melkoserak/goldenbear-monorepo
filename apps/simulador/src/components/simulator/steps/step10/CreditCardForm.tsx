"use client";
import React, { useEffect } from 'react';
import { UseFormReturn, FieldErrors } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import { Label } from '@goldenbear/ui/components/label';
import { Input } from '@goldenbear/ui/components/input';
import { CreditCard, Lock } from 'lucide-react';
import { Step10Data } from '@/lib/schemas';
import { useSimulatorStore } from '@/stores/useSimulatorStore'; // Importar a store

interface Props {
  form: UseFormReturn<Step10Data>;
}

type CreditCardErrors = FieldErrors<{
  method: 'CREDIT_CARD';
  creditCard: {
    number: string;
    holderName: string;
    expirationDate: string;
    cvv: string;
    brand?: string;
  };
}>;

export const CreditCardForm = ({ form: { register, formState, setValue } }: Props) => {
  const errors = formState.errors as CreditCardErrors;
  
  // --- CORREÇÃO: Sincronização com a Store ---
  const paymentData = useSimulatorStore((state) => state.formData.payment);

  useEffect(() => {
    if (paymentData.method === 'CREDIT_CARD' && paymentData.creditCard) {
      setValue('creditCard.number', paymentData.creditCard.number, { shouldValidate: true });
      setValue('creditCard.holderName', paymentData.creditCard.holderName, { shouldValidate: true });
      setValue('creditCard.expirationDate', paymentData.creditCard.expirationDate, { shouldValidate: true });
      setValue('creditCard.cvv', paymentData.creditCard.cvv, { shouldValidate: true });
    }
  }, [paymentData, setValue]);
  // -------------------------------------------

  return (
    <div className="space-y-4 animate-fade-in bg-card border rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground bg-muted/50 p-2 rounded">
        <Lock className="w-4 h-4" />
        <span>Ambiente seguro. Seus dados são criptografados.</span>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cc-number">Número do Cartão</Label>
        <div className="relative">
           <IMaskInput
              id="cc-number"
              mask="0000 0000 0000 0000"
              // Adicione 'value' controlado pelo form se necessário, mas o setValue acima já deve resolver
              className={`flex h-12 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.creditCard?.number ? 'border-destructive' : 'border-input'}`}
              placeholder="0000 0000 0000 0000"
              onAccept={(value) => setValue('creditCard.number', value, { shouldValidate: true })}
           />
           <CreditCard className="absolute right-3 top-3 h-6 w-6 text-muted-foreground" />
        </div>
        {errors.creditCard?.number && 
          <p className="text-sm text-destructive">{errors.creditCard.number.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cc-name">Nome Impresso no Cartão</Label>
        <Input 
          id="cc-name" 
          {...register('creditCard.holderName')} 
          className={errors.creditCard?.holderName ? 'border-destructive' : ''}
          placeholder="NOME COMO NO CARTÃO"
          onInput={(e) => {
             e.currentTarget.value = e.currentTarget.value.toUpperCase();
          }}
        />
         {errors.creditCard?.holderName && 
          <p className="text-sm text-destructive">{errors.creditCard.holderName.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="cc-expiry">Validade</Label>
          <IMaskInput
             id="cc-expiry"
             mask="00/00"
             placeholder="MM/AA"
             className={`flex h-12 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${errors.creditCard?.expirationDate ? 'border-destructive' : 'border-input'}`}
             onAccept={(value) => setValue('creditCard.expirationDate', value, { shouldValidate: true })}
          />
           {errors.creditCard?.expirationDate && 
            <p className="text-sm text-destructive">{errors.creditCard.expirationDate.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cc-cvv">CVV</Label>
          <IMaskInput
             id="cc-cvv"
             mask="0000"
             type="password"
             placeholder="123"
             className={`flex h-12 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${errors.creditCard?.cvv ? 'border-destructive' : 'border-input'}`}
             onAccept={(value) => setValue('creditCard.cvv', value, { shouldValidate: true })}
          />
           {errors.creditCard?.cvv && 
            <p className="text-sm text-destructive">{errors.creditCard.cvv.message}</p>}
        </div>
      </div>
    </div>
  );
};