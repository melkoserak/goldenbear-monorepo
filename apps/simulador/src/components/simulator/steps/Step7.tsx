"use client";
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { step7Schema, Step7Data } from '@/lib/schemas';
import { StepLayout } from '../StepLayout';
import { NavigationButtons } from '../NavigationButtons';
import { Input } from '@goldenbear/ui/components/input';
import { Label } from '@goldenbear/ui/components/label';
import { Autocomplete } from '@goldenbear/ui/components/autocomplete';
import { IMaskMixin } from 'react-imask';
import { Info } from 'lucide-react';
// Importe o Popover do seu DS
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@goldenbear/ui/components/popover';

const MaskedInput = IMaskMixin(({ inputRef, ...props }) => (
  <Input {...props} ref={inputRef as React.Ref<HTMLInputElement>} />
));

const maritalStatusOptions = [
  { value: 'SOLTEIRO', label: 'Solteiro(a)' },
  { value: 'CASADO', label: 'Casado(a)' },
  { value: 'DIVORCIADO', label: 'Divorciado(a)' },
  { value: 'VIUVO', label: 'Viúvo(a)' },
  { value: 'SEPARADO', label: 'Separado(a)' },
  { value: 'UNIAO_ESTAVEL', label: 'União Estável' },
];

// Conteúdo Explicativo PPE
const PpeInfoContent = () => (
  <div className="space-y-3 text-sm leading-relaxed text-foreground">
    <h4 className="font-bold text-primary">O que é uma PPE?</h4>
    <p>
      Uma <strong>Pessoa Politicamente Exposta (PPE)</strong> é quem desempenha ou desempenhou, nos últimos 5 anos, cargos públicos relevantes, assim como seus familiares e colaboradores próximos.
    </p>
    <div>
      <p className="font-semibold mb-1">Exemplos:</p>
      <ul className="list-disc pl-4 space-y-1 text-muted-foreground text-xs">
        <li>Presidente, Vice, Ministros, Senadores, Deputados, Prefeitos, Vereadores.</li>
        <li>Diretores de estatais ou autarquias.</li>
        <li>Membros do Judiciário (Juízes de tribunais superiores) e Ministério Público.</li>
        <li>Oficiais generais e comandantes.</li>
      </ul>
    </div>
    <p className="text-xs text-muted-foreground italic pt-2 border-t">
      *Essa identificação é uma exigência legal para prevenção à lavagem de dinheiro.
    </p>
  </div>
);

export const Step7 = () => {
  const { formData, actions: { setFormData, nextStep } } = useSimulatorStore();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(step7Schema),
    defaultValues: {
      maritalStatus: formData.maritalStatus,
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
          
          {/* Estado Civil e Instituição */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="maritalStatus">Estado Civil <span className="text-destructive">*</span></Label>
              <Controller
                name="maritalStatus"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete 
                    options={maritalStatusOptions} 
                    value={value} 
                    onChange={onChange} 
                    placeholder="Selecione..." 
                    className={errors.maritalStatus ? 'border-destructive' : ''} 
                  />
                )}
              />
              {errors.maritalStatus && <p className="text-sm text-destructive mt-1">{errors.maritalStatus.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="company">Instituição / Empresa <span className="text-destructive">*</span></Label>
              <Input 
                id="company" 
                {...register('company')} 
                placeholder="Ex: Exército Brasileiro, Empresa X" 
                className={errors.company ? 'border-destructive' : ''}
              />
              {errors.company && <p className="text-sm text-destructive mt-1">{errors.company.message}</p>}
            </div>
          </div>

          {/* Filhos e Telefone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="childrenCount">Nº de Filhos <span className="text-destructive">*</span></Label>
              <Input 
                id="childrenCount" 
                type="number" 
                min={0}
                {...register('childrenCount')} 
                className={errors.childrenCount ? 'border-destructive' : ''}
              />
              {errors.childrenCount && <p className="text-sm text-destructive mt-1">{errors.childrenCount.message}</p>}
            </div>
            
            <div className="space-y-1.5">
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

          {/* RG */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="rgNumber">Número do RG <span className="text-destructive">*</span></Label>
              <Input id="rgNumber" {...register('rgNumber')} placeholder="00.000.000-0" className={errors.rgNumber ? 'border-destructive' : ''} />
              {errors.rgNumber && <p className="text-sm text-destructive mt-1">{errors.rgNumber.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rgIssuer">Órgão Emissor <span className="text-destructive">*</span></Label>
              <Input id="rgIssuer" {...register('rgIssuer')} placeholder="SSP/SP" className={`uppercase ${errors.rgIssuer ? 'border-destructive' : ''}`} />
              {errors.rgIssuer && <p className="text-sm text-destructive mt-1">{errors.rgIssuer.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rgDate">Data de Expedição <span className="text-destructive">*</span></Label>
              <Input 
                id="rgDate" 
                type="date" 
                max={new Date().toISOString().split('T')[0]}
                {...register('rgDate')} 
                className={errors.rgDate ? 'border-destructive' : ''}
              />
              {errors.rgDate && <p className="text-sm text-destructive mt-1">{errors.rgDate.message}</p>}
            </div>
          </div>

          {/* --- SEÇÃO PPE MODIFICADA --- */}
          <div className="flex flex-col p-6 border rounded-lg bg-card shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-semibold">Pessoa Politicamente Exposta (PPE)?</Label>
                  
                  {/* Info Popover */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button type="button" className="text-muted-foreground hover:text-primary transition-colors focus:outline-none" aria-label="O que é PPE?">
                        <Info className="h-5 w-5" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4" align="start">
                      <PpeInfoContent />
                    </PopoverContent>
                  </Popover>
                </div>
                <p className="text-sm text-muted-foreground">
                  Você ou familiares desempenham funções públicas relevantes?
                </p>
              </div>

              {/* Input Sim/Não (Radio Buttons) */}
              <div className="flex items-center gap-6">
                <label className={`flex items-center gap-2 cursor-pointer border p-3 rounded-md transition-all ${!isPPE ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-input hover:bg-accent'}`}>
                  <input 
                    type="radio" 
                    value="false"
                    className="h-4 w-4 accent-primary"
                    checked={isPPE === false}
                    onChange={() => setValue('isPPE', false, { shouldValidate: true })}
                  />
                  <span className="font-medium text-sm">Não</span>
                </label>

                <label className={`flex items-center gap-2 cursor-pointer border p-3 rounded-md transition-all ${isPPE ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-input hover:bg-accent'}`}>
                  <input 
                    type="radio" 
                    value="true"
                    className="h-4 w-4 accent-primary"
                    checked={isPPE === true}
                    onChange={() => setValue('isPPE', true, { shouldValidate: true })}
                  />
                  <span className="font-medium text-sm">Sim</span>
                </label>
              </div>
            </div>

            {/* Campo Condicional para Cargo */}
            {isPPE && (
              <div className="mt-4 pt-4 border-t animate-in fade-in slide-in-from-top-2">
                <div className="space-y-1.5">
                  <Label htmlFor="company_role">Qual cargo ou função?</Label>
                  <Input 
                    id="company_role" 
                    // Nota: Se precisar salvar isso no schema, adicione 'ppeRole' no step7Schema
                    // Por enquanto, estamos usando o mesmo campo ou assumindo que vai no payload final
                    placeholder="Descreva seu cargo ou função pública"
                    onChange={(e) => {
                       // Se precisar salvar descrição específica do cargo, adicione ao store/schema
                       // Por ora, apenas validamos visualmente
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Descreva brevemente o cargo ocupado (ex: Vereador, Diretor de Autarquia).
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        <NavigationButtons isNextDisabled={!isValid} />
      </StepLayout>
    </form>
  );
};