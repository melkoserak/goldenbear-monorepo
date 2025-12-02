"use client";
import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { step6Schema, Step6Data } from '@/lib/schemas';
import { StepLayout } from '../StepLayout';
import { NavigationButtons } from '../NavigationButtons';
import { Input } from '@goldenbear/ui/components/input';
import { Label } from '@goldenbear/ui/components/label';
import { IMaskMixin } from 'react-imask';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@goldenbear/ui/components/select";

const MaskedInput = IMaskMixin(({ inputRef, ...props }) => (
  <Input {...props} ref={inputRef as React.Ref<HTMLInputElement>} />
));

export const Step6 = () => {
  const { formData, actions: { setFormData, nextStep } } = useSimulatorStore();

  // --- CORREÇÃO: Remover <Step6Data> para inferência automática ---
  const {
    register,
    handleSubmit,
    setValue,
    control,
    setFocus,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(step6Schema),
    defaultValues: {
      zipCode: formData.zipCode,
      street: formData.street,
      number: formData.number,
      complement: formData.complement,
      neighborhood: formData.neighborhood,
      city: formData.city,
      state: formData.state,
      maritalStatus: formData.maritalStatus,
    },
    mode: 'onChange'
  });

  // Função para buscar CEP (ViaCEP)
  const handleBlurCep = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setValue('street', data.logradouro);
          setValue('neighborhood', data.bairro);
          setValue('city', data.localidade);
          setValue('state', data.uf);
          setFocus('number'); // Foca no número para agilizar
        }
      } catch (error) {
        console.error("Erro CEP:", error);
      }
    }
  };

  const onSubmit: SubmitHandler<Step6Data> = (data) => {
    setFormData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <StepLayout
        title="Onde você mora?"
        description="Dados de endereço e estado civil para a apólice."
      >
        <div className="space-y-6">
          
          {/* Estado Civil (Select Obrigatório) */}
          <div className="space-y-2">
            <Label htmlFor="maritalStatus">Estado Civil</Label>
            <Controller
              name="maritalStatus"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOLTEIRO">Solteiro(a)</SelectItem>
                    <SelectItem value="CASADO">Casado(a)</SelectItem>
                    <SelectItem value="DIVORCIADO">Divorciado(a)</SelectItem>
                    <SelectItem value="VIUVO">Viúvo(a)</SelectItem>
                    <SelectItem value="SEPARADO">Separado(a)</SelectItem>
                    <SelectItem value="COMPANHEIRO">União Estável</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.maritalStatus && <p className="text-sm text-destructive">{errors.maritalStatus.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP</Label>
              <MaskedInput
                id="zipCode"
                mask="00000-000"
                placeholder="00000-000"
                {...register('zipCode')}
                onBlur={handleBlurCep} // Busca endereço ao sair
              />
              {errors.zipCode && <p className="text-sm text-destructive">{errors.zipCode.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado (UF)</Label>
              <Input id="state" {...register('state')} maxLength={2} className="uppercase" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">Rua / Logradouro</Label>
            <Input id="street" {...register('street')} />
            {errors.street && <p className="text-sm text-destructive">{errors.street.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input id="number" {...register('number')} />
              {errors.number && <p className="text-sm text-destructive">{errors.number.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="complement">Complemento</Label>
              <Input id="complement" {...register('complement')} placeholder="Apto 101" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input id="neighborhood" {...register('neighborhood')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" {...register('city')} />
            </div>
          </div>

        </div>
        <NavigationButtons isNextDisabled={!isValid} />
      </StepLayout>
    </form>
  );
};