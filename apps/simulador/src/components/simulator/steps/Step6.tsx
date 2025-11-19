"use client";
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IMaskMixin } from 'react-imask';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { NavigationButtons } from '../NavigationButtons';
import { Input } from '@goldenbear/ui/components/input';
import { Label } from '@goldenbear/ui/components/label';
import { track } from '@/lib/tracking';
import { Loader2 } from 'lucide-react';
import { step6Schema, type Step6Data } from '@/lib/schemas';
import { useAddress } from '@/hooks/useMagApi';

const MaskedInput = IMaskMixin(({ inputRef, ...props }) => (
  <Input {...props} ref={inputRef as React.Ref<HTMLInputElement>} />
));

export const Step6 = () => {
  const { formData } = useSimulatorStore();
  const { setFormData, nextStep } = useSimulatorStore((state) => state.actions);
  const firstName = formData.fullName.split(' ')[0] || "";
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);

  const { 
    control, 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    formState: { errors, isValid } 
  } = useForm<Step6Data>({
    resolver: zodResolver(step6Schema),
    defaultValues: {
      zipCode: formData.zipCode,
      street: formData.street,
      number: formData.number,
      complement: formData.complement,
      neighborhood: formData.neighborhood,
      city: formData.city,
      state: formData.state,
    },
    mode: 'onBlur'
  });

  const zipCodeValue = watch('zipCode');
  const { data: addressData, isFetching } = useAddress(zipCodeValue || '');

  // Sincroniza estado de loading
  useEffect(() => {
    setIsFetchingAddress(isFetching);
  }, [isFetching]);

  useEffect(() => {
    track('step_view', { step: 6, step_name: 'Endereço' });
  }, []);

  useEffect(() => {
    if (addressData) {
      setValue('street', addressData.logradouro, { shouldValidate: true });
      setValue('neighborhood', addressData.bairro, { shouldValidate: true });
      setValue('city', addressData.localidade, { shouldValidate: true });
      setValue('state', addressData.uf, { shouldValidate: true });
    }
  }, [addressData, setValue]);

  const onSubmit = (data: Step6Data) => {
    setFormData(data);
    track('step_complete', { step: 6, step_name: 'Endereço' });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-in" noValidate>
      <h3 tabIndex={-1} className="text-2xl font-medium text-left mb-8 text-foreground outline-none">
        {firstName}, agora complete o seu endereço:
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* CEP */}
        <div className="md:col-span-1 relative space-y-1.5">
          <Label htmlFor="zipCode">CEP <span className="text-destructive">*</span></Label>
          <Controller
            name="zipCode"
            control={control}
            render={({ field: { onChange, value, onBlur, ref } }) => (
              <MaskedInput 
                id="zipCode"
                mask="00000-000" 
                value={value} 
                onAccept={(val: string) => onChange(val)} 
                onBlur={onBlur}
                inputRef={ref}
                className={`h-12 ${errors.zipCode ? 'border-destructive' : ''}`} 
                placeholder="00000-000"
                // A11y
                aria-invalid={!!errors.zipCode}
                aria-describedby={errors.zipCode ? "zipCode-error" : undefined}
                aria-required="true"
              />
            )}
          />
          {isFetchingAddress && <Loader2 className="absolute right-3 top-9 h-5 w-5 animate-spin text-muted-foreground" aria-label="Carregando endereço..." />}
          {errors.zipCode && (
            <p id="zipCode-error" className="text-sm text-destructive mt-1" role="alert">
              {errors.zipCode.message}
            </p>
          )}
        </div>

        {/* Logradouro */}
        <div className="md:col-span-3 space-y-1.5">
          <Label htmlFor="street">Logradouro <span className="text-destructive">*</span></Label>
          <Input 
            id="street" 
            {...register('street')} 
            className={errors.street ? 'border-destructive' : ''} 
            disabled={isFetchingAddress}
            // A11y 
            aria-invalid={!!errors.street}
            aria-describedby={errors.street ? "street-error" : undefined}
            aria-required="true"
          />
          {errors.street && (
            <p id="street-error" className="text-sm text-destructive mt-1" role="alert">
              {errors.street.message}
            </p>
          )}
        </div>

        {/* Número */}
        <div className="md:col-span-1 space-y-1.5">
          <Label htmlFor="number">Número <span className="text-destructive">*</span></Label>
          <Input 
            id="number" 
            {...register('number')} 
            className={errors.number ? 'border-destructive' : ''}
            // A11y
            aria-invalid={!!errors.number}
            aria-describedby={errors.number ? "number-error" : undefined}
            aria-required="true"
          />
          {errors.number && (
            <p id="number-error" className="text-sm text-destructive mt-1" role="alert">
              {errors.number.message}
            </p>
          )}
        </div>

        {/* Complemento (Opcional) */}
        <div className="md:col-span-1 space-y-1.5">
          <Label htmlFor="complement">Complemento</Label>
          <Input 
            id="complement" 
            {...register('complement')} 
          />
        </div>

        {/* Bairro */}
        <div className="md:col-span-2 space-y-1.5">
          <Label htmlFor="neighborhood">Bairro <span className="text-destructive">*</span></Label>
          <Input 
            id="neighborhood" 
            {...register('neighborhood')} 
            className={errors.neighborhood ? 'border-destructive' : ''} 
            disabled={isFetchingAddress}
            // A11y
            aria-invalid={!!errors.neighborhood}
            aria-describedby={errors.neighborhood ? "neighborhood-error" : undefined}
            aria-required="true"
          />
          {errors.neighborhood && (
            <p id="neighborhood-error" className="text-sm text-destructive mt-1" role="alert">
              {errors.neighborhood.message}
            </p>
          )}
        </div>

        {/* Cidade */}
        <div className="md:col-span-2 space-y-1.5">
          <Label htmlFor="city">Cidade <span className="text-destructive">*</span></Label>
          <Input 
            id="city" 
            {...register('city')} 
            className={errors.city ? 'border-destructive' : ''} 
            disabled={isFetchingAddress}
            // A11y
            aria-invalid={!!errors.city}
            aria-describedby={errors.city ? "city-error" : undefined}
            aria-required="true"
          />
          {errors.city && (
            <p id="city-error" className="text-sm text-destructive mt-1" role="alert">
              {errors.city.message}
            </p>
          )}
        </div>
      </div>
      <NavigationButtons isNextDisabled={!isValid} />
    </form>
  );
};