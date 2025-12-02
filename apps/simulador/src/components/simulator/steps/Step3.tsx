"use client";
import React, { useEffect, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { step3Schema, Step3Data } from '@/lib/schemas';
import { StepLayout } from '../StepLayout';
import { NavigationButtons } from '../NavigationButtons';
import { Input } from '@goldenbear/ui/components/input';
import { Label } from '@goldenbear/ui/components/label';
import { Autocomplete } from '@goldenbear/ui/components/autocomplete';
import { IMaskMixin } from 'react-imask';

// Componente para input de moeda
const CurrencyInput = IMaskMixin(({ inputRef, ...props }) => (
  <Input {...props} ref={inputRef as React.Ref<HTMLInputElement>} />
));

export const Step3 = () => {
  const { formData, actions: { setFormData, nextStep } } = useSimulatorStore();
  const [professions, setProfessions] = useState<{ value: string; label: string }[]>([]);
  const [isLoadingProfessions, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfessions = async () => {
      if (professions.length > 0) return;
      setIsLoading(true);
      try {
        const res = await fetch('/simulador/api/professions');
        const data = await res.json();
        // Mapeia { CBO, Descricao } para { value, label }
        const formatted = data.map((p: any) => ({
          value: p.CBO || p.value, 
          label: p.Descricao || p.label
        }));
        setProfessions(formatted);
      } catch (e) {
        console.error("Erro ao carregar profissões", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfessions();
  }, []);

  // Removemos o genérico <Step3Data> para o TS inferir corretamente
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      income: formData.income,
      profession: formData.profession,
    },
    mode: 'onChange'
  });

  const onSubmit: SubmitHandler<Step3Data> = (data) => {
    setFormData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <StepLayout
        title="Detalhes Profissionais"
        description="Para oferecer a melhor cobertura, precisamos entender o seu perfil."
      >
        <div className="space-y-6">
          
          <div className="space-y-2">
            <Label htmlFor="profession">Sua Profissão</Label>
            <Controller
              name="profession"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={professions}
                  placeholder={isLoadingProfessions ? "Carregando..." : "Selecione..."}
                  emptyMessage="Nenhuma profissão encontrada."
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isLoadingProfessions}
                  isLoading={isLoadingProfessions}
                />
              )}
            />
            {errors.profession && <p className="text-sm text-destructive">{errors.profession.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="income">Renda Mensal Aproximada</Label>
            <CurrencyInput
              id="income"
              mask="R$ num"
              blocks={{
                num: {
                  mask: Number,
                  thousandsSeparator: '.',
                  radix: ',',
                  scale: 2,
                  padFractionalZeros: true,
                  normalizeZeros: true,
                }
              }}
              placeholder="R$ 0,00"
              onAccept={(value: string, mask: any) => {
                setValue('income', mask.unmaskedValue, { shouldValidate: true });
              }}
              defaultValue={formData.income}
            />
            {errors.income && <p className="text-sm text-destructive">{errors.income.message}</p>}
          </div>

        </div>
        <NavigationButtons isNextDisabled={!isValid} />
      </StepLayout>
    </form>
  );
};