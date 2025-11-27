"use client";
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IMaskMixin } from 'react-imask';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { NavigationButtons } from '../NavigationButtons';
import { Input } from '@goldenbear/ui/components/input';
import { Autocomplete } from '@goldenbear/ui/components/autocomplete';
import { Label } from '@goldenbear/ui/components/label';
import { track } from '@/lib/tracking';
import { step7Schema, type Step7Data } from '@/lib/schemas';
import { StepLayout } from '../StepLayout';

const MaskedInput = IMaskMixin(({ inputRef, ...props }) => (
  <Input {...props} ref={inputRef as React.Ref<HTMLInputElement>} />
));

const maritalStatusOptions = [
  { value: 'SOLTEIRO', label: 'Solteiro(a)' },
  { value: 'CASADO', label: 'Casado(a)' },
  { value: 'DIVORCIADO', label: 'Divorciado(a)' },
  { value: 'VIUVO', label: 'Viúvo(a)' },
  { value: 'UNIAO_ESTAVEL', label: 'União Estável' },
];

export const Step7 = () => {
  const { formData } = useSimulatorStore();
  const { setFormData, nextStep } = useSimulatorStore((state) => state.actions);
  
  // Estado para feedback imediato no botão
  const [isNavigating, setIsNavigating] = useState(false);

  const { control, register, handleSubmit, formState: { errors, isValid } } = useForm<Step7Data>({
    resolver: zodResolver(step7Schema),
    defaultValues: {
      maritalStatus: formData.maritalStatus,
      rgNumber: formData.rgNumber,
      rgIssuer: formData.rgIssuer,
      rgDate: formData.rgDate,
      childrenCount: formData.childrenCount,
      company: formData.company,
      isPPE: formData.isPPE as "true" | "false",
      homePhone: formData.homePhone
    },
    // CORREÇÃO: Validação em tempo real
    mode: 'onChange'
  });

  useEffect(() => { track('step_view', { step: 7, step_name: 'Perfil Detalhado' }); }, []);

  const onSubmit = async (data: Step7Data) => {
    setIsNavigating(true); // Trava o botão
    await new Promise(resolve => setTimeout(resolve, 100)); // Pequeno delay para UX

    setFormData(data);
    track('step_complete', { step: 7, step_name: 'Perfil Detalhado' });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepLayout title="Para finalizar, complete seu perfil:">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          
          {/* Estado Civil */}
          <div className="space-y-1.5">
            <Label id="maritalStatus-label">Estado Civil <span className="text-destructive">*</span></Label>
            <Controller
              name="maritalStatus"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete options={maritalStatusOptions} value={value} onChange={onChange} placeholder="Selecione..." className={errors.maritalStatus ? 'border-destructive' : ''} />
              )}
            />
            {errors.maritalStatus && <p className="text-sm text-destructive mt-1">{errors.maritalStatus.message}</p>}
          </div>

          {/* Telefone Residencial */}
          <div className="space-y-1.5">
            <Label htmlFor="homePhone">Telefone Residencial (DDD)</Label>
            <Controller
              name="homePhone"
              control={control}
              render={({ field: { onChange, value, ref } }) => (
                <MaskedInput id="homePhone" mask="(00) 0000-0000" value={value} onAccept={(v: string) => onChange(v)} inputRef={ref} placeholder="(XX) XXXX-XXXX" />
              )}
            />
          </div>

          {/* RG */}
          <div className="space-y-1.5">
            <Label htmlFor="rgNumber">RG <span className="text-destructive">*</span></Label>
            <Controller
               name="rgNumber"
               control={control}
               render={({ field: { onChange, value, ref } }) => (
                  <MaskedInput id="rgNumber" mask="00.000.000-**" value={value} onAccept={(v: string) => onChange(v)} inputRef={ref} className={errors.rgNumber ? 'border-destructive' : ''} placeholder="00.000.000-X" />
               )}
            />
            {errors.rgNumber && <p className="text-sm text-destructive mt-1">{errors.rgNumber.message}</p>}
          </div>

          {/* RG Emissor */}
          <div className="space-y-1.5">
            <Label htmlFor="rgIssuer">Órgão Emissor <span className="text-destructive">*</span></Label>
            <Input id="rgIssuer" {...register('rgIssuer')} className={errors.rgIssuer ? 'border-destructive' : ''} placeholder="Ex: SSP/SP" />
            {errors.rgIssuer && <p className="text-sm text-destructive mt-1">{errors.rgIssuer.message}</p>}
          </div>

          {/* RG Data */}
          <div className="space-y-1.5">
            <Label htmlFor="rgDate">Data Emissão RG <span className="text-destructive">*</span></Label>
            <Input type="date" id="rgDate" {...register('rgDate')} className={errors.rgDate ? 'border-destructive' : ''} />
            {errors.rgDate && <p className="text-sm text-destructive mt-1">{errors.rgDate.message}</p>}
          </div>

          {/* Filhos */}
          <div className="space-y-1.5">
            <Label htmlFor="childrenCount">Nº de Filhos <span className="text-destructive">*</span></Label>
            <Input type="number" min="0" id="childrenCount" {...register('childrenCount')} className={errors.childrenCount ? 'border-destructive' : ''} />
            {errors.childrenCount && <p className="text-sm text-destructive mt-1">{errors.childrenCount.message}</p>}
          </div>

          {/* Empresa */}
          <div className="md:col-span-2 space-y-1.5">
            <Label htmlFor="company">Empresa/Instituição <span className="text-destructive">*</span></Label>
            <Input id="company" {...register('company')} className={errors.company ? 'border-destructive' : ''} placeholder="Nome da sua organização" />
            {errors.company && <p className="text-sm text-destructive mt-1">{errors.company.message}</p>}
          </div>
          
          {/* PPE */}
          <div className="md:col-span-2 space-y-1.5">
            <Label>É Pessoa Politicamente Exposta (PPE)? <span className="text-destructive">*</span></Label>
            <div className="flex gap-4 pt-2">
              <Label className="flex items-center gap-2 font-normal text-muted-foreground cursor-pointer">
                <input type="radio" value="true" className="h-4 w-4 text-primary focus:ring-primary" {...register('isPPE')} /> Sim
              </Label>
              <Label className="flex items-center gap-2 font-normal text-muted-foreground cursor-pointer">
                <input type="radio" value="false" className="h-4 w-4 text-primary focus:ring-primary" {...register('isPPE')} /> Não
              </Label>
            </div>
            {errors.isPPE && <p className="text-sm text-destructive mt-1">{errors.isPPE.message}</p>}
          </div>
        </div>
        
        <NavigationButtons isNextDisabled={!isValid || isNavigating} />
      </StepLayout>
    </form>
  );
};