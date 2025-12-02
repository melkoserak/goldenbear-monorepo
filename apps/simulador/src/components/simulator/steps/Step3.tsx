"use client";
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { NavigationButtons } from '../NavigationButtons';
import { Autocomplete } from '@goldenbear/ui/components/autocomplete';
import { Input } from '@goldenbear/ui/components/input';
import { Label } from '@goldenbear/ui/components/label';
import { Check } from 'lucide-react';
import { track } from '@/lib/tracking';
import { step3Schema, type Step3Data } from '@/lib/schemas';
import { useProfessions } from '@/hooks/useMagApi';
import { StepLayout } from '../StepLayout';

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

  const { control, register, handleSubmit, formState: { errors, isValid }, watch } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: { birthDate, gender, income, profession },
    mode: 'all' // Mudamos para 'all' para pegar erros em tempo real
  });

  // Monitoramento para Debug
  const formValues = watch();
  
  useEffect(() => {
    // Mostra erros de validação no console assim que ocorrem
    if (Object.keys(errors).length > 0) {
      console.error("[DEBUG Step3] Erros de Validação:", errors);
    }
  }, [errors]);

  const onSubmit = (data: Step3Data) => {
    console.log("[DEBUG Step3] Tentando enviar...", data);
    
    try {
        setFormData(data);
        console.log("[DEBUG Step3] Dados salvos na store.");
        
        track('step_complete', { step: 3, step_name: 'Detalhes da Simulação' });
        console.log("[DEBUG Step3] Tracking enviado.");
        
        nextStep();
        console.log("[DEBUG Step3] nextStep() chamado. Deveria ir para o Passo 4.");
    } catch (err) {
        console.error("[DEBUG Step3] Erro crítico no onSubmit:", err);
    }
  };

  // Função para capturar erros de submit que o isValid pode ter deixado passar
  const onError = (errors: any) => {
      console.error("[DEBUG Step3] Submit bloqueado por erros:", errors);
      alert("Por favor, verifique os campos em vermelho.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
      <StepLayout title={`Perfeito ${firstName}! Só mais alguns detalhes para a simulação:`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Data de Nascimento */}
          <div className="space-y-1.5">
            <Label htmlFor="birthDate">Data de Nascimento <span className="text-destructive">*</span></Label>
            <Input 
              type="date" 
              id="birthDate" 
              className={errors.birthDate ? 'border-destructive' : ''} 
              {...register('birthDate')} 
            />
            {errors.birthDate && <p className="text-sm text-destructive mt-1">{errors.birthDate.message}</p>}
          </div>
          
          {/* Sexo */}
          <div className="space-y-1.5" role="radiogroup">
            <Label>Sexo <span className="text-destructive">*</span></Label>
            <div className="flex gap-4 pt-2">
              <Label className="flex items-center gap-2 cursor-pointer font-normal text-muted-foreground">
                <input type="radio" value="masculino" className="h-4 w-4 text-primary focus:ring-primary" {...register('gender')} /> Masculino
              </Label>
              <Label className="flex items-center gap-2 cursor-pointer font-normal text-muted-foreground">
                <input type="radio" value="feminino" className="h-4 w-4 text-primary focus:ring-primary" {...register('gender')} /> Feminino
              </Label>
            </div>
             {errors.gender && <p className="text-sm text-destructive mt-1">{errors.gender.message}</p>}
          </div>

          {/* Renda */}
          <div className="space-y-1.5">
            <Label htmlFor="income">Faixa de Renda Mensal <span className="text-destructive">*</span></Label>
            <Controller
              name="income"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete 
                  options={incomeOptions} 
                  value={value} 
                  onChange={onChange} 
                  placeholder="Selecione..." 
                  className={errors.income ? 'border-destructive' : ''} 
                />
              )}
            />
            {errors.income && <p className="text-sm text-destructive mt-1">{errors.income.message}</p>}
          </div>

          {/* Profissão */}
          <div className="space-y-1.5">
            <Label htmlFor="profession">Profissão <span className="text-destructive">*</span></Label>
            <Controller
              name="profession"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="relative flex items-center">
                  <Autocomplete 
                    options={professions} 
                    value={value} 
                    onChange={(val) => {
                        console.log("[DEBUG Step3] Profissão selecionada:", val);
                        onChange(val);
                    }} 
                    placeholder={isLoadingProfessions ? "Carregando..." : "Digite para buscar..."}
                    isLoading={isLoadingProfessions}
                    className={errors.profession ? 'border-destructive' : ''} 
                  />
                  {value && !errors.profession && <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500 pointer-events-none" />}
                </div>
              )}
            />
            {errors.profession && <p className="text-sm text-destructive mt-1">{errors.profession.message}</p>}
          </div>
        </div>
        
        {/* Botão de Debug (remover em produção) */}
        {/* <div className="text-xs text-muted-foreground mt-4">
            Estado do form: {isValid ? 'Válido' : 'Inválido'} <br/>
            Valores atuais: {JSON.stringify(formValues)}
        </div> */}

        <NavigationButtons isNextDisabled={!isValid} nextLabel="Ver Opções de Seguro" />
      </StepLayout>
    </form>
  );
};