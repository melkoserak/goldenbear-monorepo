"use client";
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { NavigationButtons } from '../NavigationButtons';
import { Autocomplete } from '@goldenbear/ui/components/autocomplete';
import { Input } from '@goldenbear/ui/components/input';
import { Label } from '@goldenbear/ui/components/label';
import { getProfessions, ProfessionOption } from '@/services/apiService';
import { Check } from 'lucide-react';
import { track } from '@/lib/tracking';
import { step3Schema, type Step3Data } from '@/lib/schemas';
import { useProfessions } from '@/hooks/useMagApi';

const incomeOptions = [
  { value: '2000', label: 'R$ 0 a R$ 2.000' },
  { value: '5000', label: 'R$ 2.001 a R$ 5.000' },
  { value: '8000', label: 'R$ 5.001 a R$ 8.000' },
  { value: '11999', label: 'R$ 8.001 a R$ 11.999' },
  { value: '15000', label: 'Acima de R$ 12.000' },
];

export const Step3 = () => {
  const { birthDate, gender, income, profession, fullName } = useSimulatorStore((state) => state.formData);
  const { setFormData, nextStep } = useSimulatorStore((state) => state.actions);
  
  const { data: professions = [], isLoading: isLoadingProfessions } = useProfessions();
  
  const firstName = fullName.split(' ')[0] || "";

  const { 
    control, 
    register, 
    handleSubmit, 
    formState: { errors, isValid } 
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: { birthDate, gender, income, profession },
    mode: 'onBlur'
  });

  useEffect(() => {
    track('step_view', { step: 3, step_name: 'Detalhes da Simulação' });
  }, []);

  const onSubmit = (data: Step3Data) => {
    setFormData(data);
    track('step_complete', { step: 3, step_name: 'Detalhes da Simulação' });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-in" noValidate>
      <h3 tabIndex={-1} className="text-2xl font-medium text-left mb-8 text-foreground outline-none">
        Perfeito {firstName}! Só mais alguns detalhes para a simulação:
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Data de Nascimento */}
        <div className="space-y-1.5">
          <Label htmlFor="birthDate">Data de Nascimento <span className="text-destructive">*</span></Label>
          <Input 
            type="date" 
            id="birthDate" 
            className={errors.birthDate ? 'border-destructive' : ''} 
            // A11y
            aria-invalid={errors.birthDate ? "true" : "false"}
            aria-describedby={errors.birthDate ? "birthDate-error" : undefined}
            aria-required="true"
            {...register('birthDate')} 
          />
          {errors.birthDate && (
            <p id="birthDate-error" className="text-sm text-destructive mt-1" role="alert">
              {errors.birthDate.message}
            </p>
          )}
        </div>
        
        {/* Sexo (Radio Buttons) */}
        <div className="space-y-1.5" role="radiogroup" aria-labelledby="gender-label">
          <Label id="gender-label">Sexo <span className="text-destructive">*</span></Label>
          <div className="flex gap-4 pt-2">
            <Label className="flex items-center gap-2 cursor-pointer font-normal text-muted-foreground">
              <input 
                type="radio" 
                value="masculino" 
                className="h-4 w-4 text-primary focus:ring-primary" 
                aria-invalid={errors.gender ? "true" : "false"}
                aria-describedby={errors.gender ? "gender-error" : undefined}
                {...register('gender')} 
              /> Masculino
            </Label>
            <Label className="flex items-center gap-2 cursor-pointer font-normal text-muted-foreground">
              <input 
                type="radio" 
                value="feminino" 
                className="h-4 w-4 text-primary focus:ring-primary" 
                aria-invalid={errors.gender ? "true" : "false"}
                aria-describedby={errors.gender ? "gender-error" : undefined}
                {...register('gender')} 
              /> Feminino
            </Label>
          </div>
           {errors.gender && (
             <p id="gender-error" className="text-sm text-destructive mt-1" role="alert">
               {errors.gender.message}
             </p>
           )}
        </div>

        {/* Renda (Autocomplete com A11y) */}
        <div className="space-y-1.5">
          <Label id="income-label" htmlFor="income-input">Faixa de Renda Mensal <span className="text-destructive">*</span></Label>
          <Controller
            name="income"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Autocomplete 
                // Props de Acessibilidade (Agora suportadas!)
                id="income-input"
                aria-invalid={!!errors.income}
                aria-describedby={errors.income ? "income-error" : undefined}
                aria-required="true"
                // Props do componente
                options={incomeOptions} 
                value={value} 
                onChange={onChange} 
                placeholder="Selecione..." 
                className={errors.income ? 'border-destructive' : ''} 
              />
            )}
          />
          {errors.income && (
            <p id="income-error" className="text-sm text-destructive mt-1" role="alert">
              {errors.income.message}
            </p>
          )}
        </div>

        {/* Profissão (Autocomplete com A11y) */}
        <div className="space-y-1.5">
          <Label id="profession-label" htmlFor="profession-input">Profissão <span className="text-destructive">*</span></Label>
          <Controller
            name="profession"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="relative flex items-center">
                <Autocomplete 
                  // Props de Acessibilidade
                  id="profession-input"
                  aria-invalid={!!errors.profession}
                  aria-describedby={errors.profession ? "profession-error" : undefined}
                  aria-required="true"
                  // Props do componente
                  options={professions} 
                  value={value} 
                  onChange={onChange} 
                  placeholder={isLoadingProfessions ? "Carregando..." : "Digite para buscar..."}
                  isLoading={isLoadingProfessions}
                  className={errors.profession ? 'border-destructive' : ''} 
                />
                {value && !errors.profession && <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500 pointer-events-none" aria-hidden="true" />}
              </div>
            )}
          />
          {errors.profession && (
            <p id="profession-error" className="text-sm text-destructive mt-1" role="alert">
              {errors.profession.message}
            </p>
          )}
        </div>
      </div>
      <NavigationButtons isNextDisabled={!isValid} nextLabel="Ver Opções de Seguro" />
    </form>
  );
};