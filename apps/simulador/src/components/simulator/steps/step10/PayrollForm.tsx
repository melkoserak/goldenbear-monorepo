"use client";
import React from 'react';
import { UseFormReturn, FieldErrors } from 'react-hook-form';
import { Label } from '@goldenbear/ui/components/label';
import { Input } from '@goldenbear/ui/components/input';
import { Autocomplete } from '@goldenbear/ui/components/autocomplete';
import { Step10Data } from '@/lib/schemas';

const orgs = [
  { value: 'EXERCITO', label: 'Exército Brasileiro' },
  { value: 'MARINHA', label: 'Marinha do Brasil' },
  { value: 'AERONAUTICA', label: 'Aeronáutica' },
];

interface Props { form: UseFormReturn<Step10Data>; }

type PayrollErrors = FieldErrors<{
  method: 'PAYROLL_DEDUCTION';
  payroll: {
    registrationNumber: string;
    orgCode: string;
  };
}>;

export const PayrollForm = ({ form: { register, setValue, watch, formState } }: Props) => {
  const selectedOrg = watch('payroll.orgCode');
  const errors = formState.errors as PayrollErrors;

  return (
    <div className="space-y-4 animate-fade-in bg-card border rounded-lg p-6 shadow-sm">
      <div className="space-y-1.5">
        <Label>Órgão / Força</Label>
        <Autocomplete 
          options={orgs}
          value={selectedOrg}
          // --- CORREÇÃO: Garantir shouldValidate aqui ---
          onChange={(val) => setValue('payroll.orgCode', val, { shouldValidate: true })}
          placeholder="Selecione o órgão"
        />
         {errors.payroll?.orgCode && 
          <p className="text-sm text-destructive">{errors.payroll.orgCode.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>Matrícula / Identificação</Label>
        <Input {...register('payroll.registrationNumber')} placeholder="Número da matrícula" />
         {errors.payroll?.registrationNumber && 
          <p className="text-sm text-destructive">{errors.payroll.registrationNumber.message}</p>}
      </div>
    </div>
  );
};