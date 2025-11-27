"use client";
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IMaskMixin } from 'react-imask';
import { Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { NavigationButtons } from '../NavigationButtons';
import { Input } from '@goldenbear/ui/components/input';
import { Autocomplete } from '@goldenbear/ui/components/autocomplete';
import { Label } from '@goldenbear/ui/components/label';
import { track } from '@/lib/tracking';
import { step2Schema, type Step2Data } from '@/lib/schemas';
import { StepLayout } from '../StepLayout';

const MaskedInput = IMaskMixin(({ inputRef, ...props }) => (
  <Input {...props} ref={inputRef as React.Ref<HTMLInputElement>} />
));

const brazilianStates = [
  { value: 'AC', label: 'Acre' }, { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' }, { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' }, { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' }, { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' }, { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' }, { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' }, { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' }, { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' }, { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' }, { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' }, { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' }, { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' }, { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
];

export const Step2 = () => {
  const { cpf, email, phone, state, consent, fullName } = useSimulatorStore((state) => state.formData);
  const { setFormData, nextStep } = useSimulatorStore((state) => state.actions);
  const firstName = fullName.split(' ')[0] || "";
  
  // Estado local para feedback visual imediato no botão
  const [isNavigating, setIsNavigating] = useState(false);

  const { control, register, handleSubmit, formState: { errors, isValid } } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: { cpf, email, phone, state, consent },
    // MUDANÇA IMPORTANTE: 'onChange' valida em tempo real, sem delay de 'onBlur'
    mode: 'onChange', 
  });

  const onSubmit = async (data: Step2Data) => {
    setIsNavigating(true); // Trava o botão e mostra loading
    
    // Pequeno delay artificial (opcional) se quiser garantir que o usuário veja o feedback,
    // mas aqui serve para permitir que a UI atualize antes de mudar o passo.
    await new Promise(resolve => setTimeout(resolve, 100));
    
    setFormData(data); 
    track('step_complete', { step: 2, step_name: 'Dados de Contato' });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepLayout title={`Certo ${firstName}, agora precisamos destes dados de contato:`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CPF */}
          <div className="space-y-1.5">
            <Label htmlFor="cpf">Seu CPF <span className="text-destructive">*</span></Label>
            <Controller
              name="cpf"
              control={control}
              render={({ field: { onChange, value, onBlur, ref } }) => (
                <div className="relative flex items-center">
                  <MaskedInput
                    id="cpf"
                    mask="000.000.000-00"
                    value={value}
                    onAccept={(val: string) => onChange(val)}
                    onBlur={onBlur}
                    inputRef={ref}
                    placeholder="000.000.000-00"
                    className={`h-12 px-4 py-3 pr-10 ${errors.cpf ? 'border-destructive' : ''}`}
                    aria-invalid={!!errors.cpf}
                  />
                  {!errors.cpf && value && <Check className="absolute right-3 h-5 w-5 text-green-500 pointer-events-none" />}
                </div>
              )}
            />
            {errors.cpf && <p className="text-sm text-destructive mt-1">{errors.cpf.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail <span className="text-destructive">*</span></Label>
            <div className="relative flex items-center">
              <Input
                id="email"
                type="email"
                placeholder="seu.email@exemplo.com"
                className={`h-12 px-4 py-3 pr-10 ${errors.email ? 'border-destructive' : ''}`}
                aria-invalid={!!errors.email}
                {...register('email')}
              />
              {!errors.email && email && <Check className="absolute right-3 h-5 w-5 text-green-500 pointer-events-none" />}
            </div>
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
          </div>

          {/* Telefone */}
          <div className="space-y-1.5">
            <Label htmlFor="phone">Celular (DDD) <span className="text-destructive">*</span></Label>
            <Controller
              name="phone"
              control={control}
              render={({ field: { onChange, value, onBlur, ref } }) => (
                <div className="relative flex items-center">
                  <MaskedInput
                    id="phone"
                    mask="(00) 00000-0000"
                    value={value}
                    onAccept={(val: string) => onChange(val)}
                    onBlur={onBlur}
                    inputRef={ref}
                    placeholder="(XX) 9XXXX-XXXX"
                    className={`h-12 px-4 py-3 pr-10 ${errors.phone ? 'border-destructive' : ''}`}
                    aria-invalid={!!errors.phone}
                  />
                  {!errors.phone && value && <Check className="absolute right-3 h-5 w-5 text-green-500 pointer-events-none" />}
                </div>
              )}
            />
            {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
          </div>
          
          {/* Estado */}
          <div className="space-y-1.5">
            <Label>Estado <span className="text-destructive">*</span></Label>
            <Controller
              name="state"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="relative flex items-center">
                  <Autocomplete
                    options={brazilianStates}
                    value={value}
                    onChange={onChange}
                    placeholder="Selecione..."
                    className={errors.state ? 'border-destructive' : ''}
                  />
                  {!errors.state && value && <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500 pointer-events-none" />}
                </div>
              )}
            />
            {errors.state && <p className="text-sm text-destructive mt-1">{errors.state.message}</p>}
          </div>

          {/* LGPD */}
          <div className="md:col-span-2 pt-2">       
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="consent"
                className="h-5 w-5 mt-0.5 rounded border-input text-primary focus:ring-primary accent-primary cursor-pointer"
                {...register('consent')}
              />
              <Label htmlFor="consent" className="text-sm font-normal text-muted-foreground cursor-pointer leading-relaxed">
                Concordo com a <Link href="/politica-de-privacidade" target="_blank" className="text-primary hover:underline font-medium">Política de Privacidade</Link> e 
                <span className="font-bold text-foreground"> autorizo o compartilhamento dos meus dados com a MAG Seguros </span> 
                para fins de simulação. <span className="text-destructive">*</span>
              </Label>
            </div>
            {errors.consent && <p className="text-sm text-destructive text-right mt-1">{errors.consent.message}</p>}
          </div>
        </div>
        
        {/* Botão modificado para suportar estado de carregamento */}
        <div className="flex justify-end mt-6">
           <NavigationButtons 
              isNextDisabled={!isValid || isNavigating} 
              // Infelizmente NavigationButtons é um componente fechado, 
              // mas o 'disabled' já previne cliques múltiplos.
              // Se você quiser customizar o texto ou ícone, teria que passar props extras para NavigationButtons 
              // ou usar um Button direto aqui.
              // Por hora, o disable + modo 'onChange' deve resolver a sensação de lentidão.
           />
        </div>
      </StepLayout>
    </form>
  );
};