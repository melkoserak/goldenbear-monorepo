"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { step7Schema, Step7Data } from '@/lib/schemas';
import { StepLayout } from '../StepLayout';
import { NavigationButtons } from '../NavigationButtons';
import { Input } from '@goldenbear/ui/components/input';
import { Label } from '@goldenbear/ui/components/label';
import { Switch } from '@goldenbear/ui/components/switch';
import { IMaskMixin } from 'react-imask';

const MaskedInput = IMaskMixin(({ inputRef, ...props }) => (
  <Input {...props} ref={inputRef as React.Ref<HTMLInputElement>} />
));

export const Step7 = () => {
  const { formData, actions: { setFormData, nextStep } } = useSimulatorStore();

  // --- CORREÇÃO: Removemos <Step7Data> ---
  // Deixamos o TS inferir os tipos a partir do resolver e defaultValues.
  // Isso resolve o conflito de tipagem estrita com z.coerce.
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(step7Schema),
    defaultValues: {
      rgNumber: formData.rgNumber,
      rgIssuer: formData.rgIssuer,
      rgDate: formData.rgDate,
      childrenCount: formData.childrenCount,
      isPPE: formData.isPPE,
      company: formData.company,
      homePhone: formData.homePhone,
    },
    mode: 'onChange'
  });

  const isPPE = watch('isPPE');

  // O tipo 'data' aqui será inferido corretamente como Step7Data
  const onSubmit = (data: Step7Data) => {
    setFormData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <StepLayout
        title="Perfil Detalhado"
        description="Precisamos de mais alguns dados para a apólice."
      >
        <div className="space-y-6">
          
          {/* RG */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rgNumber">Número do RG</Label>
              <Input id="rgNumber" {...register('rgNumber')} placeholder="00.000.000-0" />
              {errors.rgNumber && <p className="text-sm text-destructive">{errors.rgNumber.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="rgIssuer">Órgão Emissor</Label>
              <Input id="rgIssuer" {...register('rgIssuer')} placeholder="SSP/SP" className="uppercase" />
              {errors.rgIssuer && <p className="text-sm text-destructive">{errors.rgIssuer.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="rgDate">Data de Expedição</Label>
              <Input id="rgDate" type="date" {...register('rgDate')} />
              {errors.rgDate && <p className="text-sm text-destructive">{errors.rgDate.message}</p>}
            </div>
          </div>

          {/* Filhos e Telefone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="childrenCount">Quantos filhos você tem?</Label>
              <Input 
                id="childrenCount" 
                type="number" 
                min={0}
                {...register('childrenCount')} 
              />
              {errors.childrenCount && <p className="text-sm text-destructive">{errors.childrenCount.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="homePhone">Telefone Residencial (Opcional)</Label>
              <MaskedInput
                id="homePhone"
                mask="(00) 0000-0000"
                placeholder="(00) 0000-0000"
                onAccept={(value: string) => setValue('homePhone', value, { shouldValidate: true })}
                defaultValue={formData.homePhone}
              />
            </div>
          </div>

          {/* PPE */}
          <div className="flex flex-col gap-4 p-4 border rounded-lg bg-card">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Pessoa Politicamente Exposta (PPE)?</Label>
                <p className="text-xs text-muted-foreground">
                  Você ou familiares desempenham funções públicas relevantes?
                </p>
              </div>
              <Switch
                checked={isPPE}
                onCheckedChange={(checked) => setValue('isPPE', checked, { shouldValidate: true })}
              />
            </div>
            
            {isPPE && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <Label htmlFor="company">Qual cargo ou função?</Label>
                <Input 
                  id="company" 
                  {...register('company')} 
                  placeholder="Descreva seu cargo ou função pública"
                />
              </div>
            )}
          </div>

        </div>

        <NavigationButtons isNextDisabled={!isValid} />
      </StepLayout>
    </form>
  );
};