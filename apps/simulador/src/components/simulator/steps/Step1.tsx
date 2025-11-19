"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NavigationButtons } from '../NavigationButtons';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { Input } from '@goldenbear/ui/components/input';
import { Label } from '@goldenbear/ui/components/label';
import { track } from '@/lib/tracking';
import { Check } from 'lucide-react';
import { step1Schema, type Step1Data } from '@/lib/schemas';

export const Step1 = () => {
  const { fullName } = useSimulatorStore((state) => state.formData);
  const { nextStep, setFormData } = useSimulatorStore((state) => state.actions);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: { fullName },
    mode: 'onChange',
  });

  useEffect(() => {
    track('step_view', { step: 1, step_name: 'Dados Iniciais' });
  }, []);

  const onSubmit = (data: Step1Data) => {
    setFormData({ fullName: data.fullName });
    track('step_complete', {
      step: 1,
      step_name: 'Dados Iniciais',
      form_data: { full_name_provided: true },
    });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-in" noValidate>
      <h3 tabIndex={-1} className="text-2xl font-medium text-left mb-8 text-foreground outline-none">
        Primeiramente, nos diga seu nome completo
      </h3>

      <div className="space-y-1.5">
        <Label htmlFor="fullName">
          Nome completo <span className="text-destructive">*</span>
        </Label>
        <div className="relative flex items-center">
          <Input
            id="fullName"
            placeholder="Seu nome completo"
            className={`h-12 px-4 py-3 pr-10 ${errors.fullName ? 'border-destructive' : ''}`}
            // --- A11Y: Atributos ARIA ---
            aria-invalid={errors.fullName ? "true" : "false"}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            aria-required="true"
            // ----------------------------
            {...register('fullName')}
          />
          
          {!errors.fullName && isDirty && isValid && (
            <Check className="absolute right-3 h-5 w-5 text-green-500 pointer-events-none" aria-hidden="true" />
          )}
        </div>
        
        {errors.fullName && (
          <p 
            id="fullName-error" // ID conectado ao input
            className="text-sm text-destructive mt-1" 
            role="alert"
          >
            {errors.fullName.message}
          </p>
        )}
      </div>

      <NavigationButtons isNextDisabled={!isValid} />
    </form>
  );
};