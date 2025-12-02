"use client";
import React from 'react';
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

  const { control, register, handleSubmit, formState: { errors, isValid } } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: { birthDate, gender, income, profession },
    mode: 'onChange' 
  });

  const onSubmit = (data: Step3Data) => {
    console.log("Enviando dados do Passo 3:", data);
    try {
        setFormData(data);
        track('step_complete', { step: 3, step_name: 'Detalhes da Simulação' });
        nextStep();
    } catch (err) {
        console.error("Erro ao salvar dados:", err);
    }
  };

  const onError = (errors: any) => {
      console.error("Erros de validação impedindo o avanço:", errors);
  };

  // Data máxima permitida (hoje) para o input
  const maxDate = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
      <StepLayout title={`Perfeito ${firstName}! Só mais alguns detalhes para a simulação:`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* --- DATA DE NASCIMENTO (NATIVO) --- */}
          <div className="space-y-1.5">
            <Label htmlFor="birthDate">Data de Nascimento <span className="text-destructive">*</span></Label>
            <div className="relative">
              <Input 
                type="date" 
                id="birthDate"
                max={maxDate}     // Impede datas futuras
                min="1900-01-01"  // Impede datas muito antigas
                className={`h-12 w-full ${errors.birthDate ? 'border-destructive' : ''}`} 
                {...register('birthDate')} 
              />
              {/* Este estilo garante que o ícone do calendário fique alinhado e bonito */}
              <style jsx>{`
                input[type="date"] {
                  display: block;
                  -webkit-appearance: none;
                  -moz-appearance: none;
                  appearance: none;
                  min-height: 48px; /* Garante altura de toque no mobile */
                }
                /* Posiciona o ícone nativo do calendário para a direita (opcional) */
                input[type="date"]::-webkit-calendar-picker-indicator {
                  position: absolute;
                  right: 12px;
                  top: 50%;
                  transform: translateY(-50%);
                  cursor: pointer;
                  opacity: 0.6;
                }
              `}</style>
            </div>
            {errors.birthDate && <p className="text-sm text-destructive mt-1">{errors.birthDate.message}</p>}
          </div>
          
          {/* --- SEXO --- */}
          <div className="space-y-1.5" role="radiogroup">
            <Label>Sexo <span className="text-destructive">*</span></Label>
            <div className="flex gap-4 pt-3 h-12 items-center">
              <Label className="flex items-center gap-2 cursor-pointer font-normal text-muted-foreground hover:text-foreground transition-colors">
                <input type="radio" value="masculino" className="h-4 w-4 text-primary focus:ring-primary accent-primary" {...register('gender')} /> Masculino
              </Label>
              <Label className="flex items-center gap-2 cursor-pointer font-normal text-muted-foreground hover:text-foreground transition-colors">
                <input type="radio" value="feminino" className="h-4 w-4 text-primary focus:ring-primary accent-primary" {...register('gender')} /> Feminino
              </Label>
            </div>
             {errors.gender && <p className="text-sm text-destructive mt-1">{errors.gender.message}</p>}
          </div>

          {/* --- RENDA --- */}
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

          {/* --- PROFISSÃO --- */}
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
                    onChange={onChange} 
                    placeholder={isLoadingProfessions ? "Carregando..." : "Digite para buscar..."}
                    isLoading={isLoadingProfessions}
                    className={errors.profession ? 'border-destructive' : ''} 
                  />
                  {value && !errors.profession && <Check className="absolute right-10 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500 pointer-events-none" />}
                </div>
              )}
            />
            {errors.profession && <p className="text-sm text-destructive mt-1">{errors.profession.message}</p>}
          </div>
        </div>

        {/* Botão habilitado apenas se o formulário for válido */}
        <NavigationButtons isNextDisabled={!isValid} nextLabel="Ver Opções de Seguro" />
      </StepLayout>
    </form>
  );
};