"use client";
import React from 'react';
import { UseFormReturn, FieldErrors } from 'react-hook-form';
import { Label } from '@goldenbear/ui/components/label';
import { Input } from '@goldenbear/ui/components/input';
import { Autocomplete } from '@goldenbear/ui/components/autocomplete';
import { Step10Data } from '@/lib/schemas';

const banks = [
  { value: '001', label: '001 - Banco do Brasil' },
  { value: '237', label: '237 - Bradesco' },
  { value: '341', label: '341 - Itaú' },
  { value: '104', label: '104 - Caixa Econômica' },
  { value: '033', label: '033 - Santander' },
];

interface Props { form: UseFormReturn<Step10Data>; }

type DebitErrors = FieldErrors<{
  method: 'DEBIT_ACCOUNT';
  debitAccount: {
    bankCode: string;
    agency: string;
    accountNumber: string;
    accountDigit: string;
  };
}>;

export const DebitForm = ({ form: { register, setValue, watch, formState } }: Props) => {
  const selectedBank = watch('debitAccount.bankCode');
  const errors = formState.errors as DebitErrors;

  return (
    <div className="space-y-4 animate-fade-in bg-card border rounded-lg p-6 shadow-sm">
       <div className="space-y-1.5">
          <Label>Banco</Label>
          <Autocomplete 
            options={banks}
            value={selectedBank}
            // --- CORREÇÃO: Garantir shouldValidate aqui ---
            onChange={(val) => setValue('debitAccount.bankCode', val, { shouldValidate: true })}
            placeholder="Selecione seu banco"
            className={errors.debitAccount?.bankCode ? 'border-destructive' : ''}
          />
       </div>
       
       <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1 space-y-1.5">
             <Label>Agência</Label>
             <Input {...register('debitAccount.agency')} placeholder="0000" />
          </div>
          <div className="col-span-2 flex gap-2">
             <div className="flex-1 space-y-1.5">
                <Label>Conta</Label>
                <Input {...register('debitAccount.accountNumber')} placeholder="000000" />
             </div>
             <div className="w-16 space-y-1.5">
                <Label>Dígito</Label>
                <Input {...register('debitAccount.accountDigit')} placeholder="X" className="text-center" />
             </div>
          </div>
       </div>
       {(errors.debitAccount?.agency || errors.debitAccount?.accountNumber) && 
          <p className="text-sm text-destructive">Verifique os dados da conta.</p>
       }
    </div>
  );
};