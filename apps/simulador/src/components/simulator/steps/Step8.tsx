"use client";
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IMaskMixin } from 'react-imask';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { NavigationButtons } from '../NavigationButtons';
import { Input } from '@goldenbear/ui/components/input';
import { Label } from '@goldenbear/ui/components/label';
import { Button } from '@goldenbear/ui/components/button';
import { Autocomplete } from '@goldenbear/ui/components/autocomplete';
import { track } from '@/lib/tracking';
import { PlusCircle, Trash2, AlertTriangle } from 'lucide-react';
import { step8Schema, type Step8Data } from '@/lib/schemas';
import { StepLayout } from '../StepLayout';

const MaskedInput = IMaskMixin(({ inputRef, ...props }) => (
  <Input {...props} ref={inputRef as React.Ref<HTMLInputElement>} />
));

const relationshipOptions = [
    { value: 'CONJUGE', label: 'Cônjuge' }, { value: 'FILHO', label: 'Filho(a)' },
    { value: 'PAI', label: 'Pai' }, { value: 'MAE', label: 'Mãe' },
    { value: 'IRMAO', label: 'Irmão(ã)' }, { value: 'COMPANHEIRO', label: 'Companheiro(a)' },
    { value: 'NETO', label: 'Neto(a)' }, { value: 'AVO', label: 'Avó(ô)' },
    { value: 'TIO', label: 'Tio(a)' }, { value: 'SOBRINHO', label: 'Sobrinho(a)' },
    { value: 'PRIMO', label: 'Primo(a)' }, { value: 'ENTEADO', label: 'Enteado(a)' },
    { value: 'SOCIO', label: 'Sócio(a)' }, { value: 'NENHUM', label: 'Nenhum' },
];

const isUnder18 = (dateString?: string) => {
  if (!dateString) return false;
  const birthDate = new Date(dateString);
  if (isNaN(birthDate.getTime())) return false;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age < 18;
};

export const Step8 = () => {
  const { formData } = useSimulatorStore();
  const { setFormData, nextStep, prefetchQuestionnaireTokens } = useSimulatorStore((state) => state.actions);
  const firstName = formData.fullName.split(' ')[0] || "";

  // Estado para feedback imediato no botão
  const [isNavigating, setIsNavigating] = useState(false);

  const { 
    control, 
    register, 
    handleSubmit, 
    formState: { errors, isValid, submitCount },
  } = useForm<Step8Data>({
    resolver: zodResolver(step8Schema),
    defaultValues: {
      beneficiaries: formData.beneficiaries.map(b => ({
        ...b,
        legalRepresentative: b.legalRepresentative || {}
      }))
    },
    // CORREÇÃO: Validação em tempo real
    mode: 'onChange'
  });

  const { fields, append, remove } = useFieldArray({ control, name: "beneficiaries" });
  const beneficiariesValues = useWatch({ control, name: "beneficiaries" });

  // Scroll automático para erros
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstErrorElement = document.querySelector('.border-destructive');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [submitCount, errors]);

  useEffect(() => { track('step_view', { step: 8, step_name: 'Beneficiários' }); }, []);
  
  // Prefetch inteligente: busca tokens assim que o form fica válido
  useEffect(() => { if (isValid) prefetchQuestionnaireTokens(); }, [isValid, prefetchQuestionnaireTokens]);

  const onSubmit = async (data: Step8Data) => {
    setIsNavigating(true); // Trava o botão
    await new Promise(resolve => setTimeout(resolve, 100)); // Pequeno delay

    const cleanBeneficiaries = data.beneficiaries.map(b => {
      if (!isUnder18(b.birthDate)) {
        return { ...b, legalRepresentative: undefined };
      }
      return b;
    });
    setFormData({ beneficiaries: cleanBeneficiaries as any });
    track('step_complete', { step: 8, step_name: 'Beneficiários', count: cleanBeneficiaries.length });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepLayout 
        title={`Para quem vão os benefícios, ${firstName}?`}
        description="Indique pelo menos um beneficiário. Se um beneficiário for menor de 18 anos, os campos do responsável legal aparecerão automaticamente."
      >
        {fields.map((field, index) => {
          const isMinor = isUnder18(beneficiariesValues?.[index]?.birthDate);
          return (
            <div key={field.id} className="border rounded-lg p-6 relative transition-all duration-300 bg-card">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-primary">Beneficiário {index + 1}</h4>
                {fields.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="md:col-span-2 space-y-1.5">
                  <Label htmlFor={`beneficiaries.${index}.fullName`}>Nome completo <span className="text-destructive">*</span></Label>
                  <Input id={`beneficiaries.${index}.fullName`} {...register(`beneficiaries.${index}.fullName`)} className={errors.beneficiaries?.[index]?.fullName ? 'border-destructive' : ''} />
                  {errors.beneficiaries?.[index]?.fullName && <p className="text-sm text-destructive mt-1">{errors.beneficiaries[index]?.fullName?.message}</p>}
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor={`beneficiaries.${index}.cpf`}>CPF <span className="text-destructive">*</span></Label>
                  <Controller name={`beneficiaries.${index}.cpf`} control={control} render={({ field: { onChange, value, ref } }) => (
                      <MaskedInput id={`beneficiaries.${index}.cpf`} mask="000.000.000-00" value={value} onAccept={(v: string) => onChange(v)} inputRef={ref} className={errors.beneficiaries?.[index]?.cpf ? 'border-destructive' : ''} placeholder="000.000.000-00" />
                  )}/>
                  {errors.beneficiaries?.[index]?.cpf && <p className="text-sm text-destructive mt-1">{errors.beneficiaries[index]?.cpf?.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor={`beneficiaries.${index}.birthDate`}>Data de Nascimento <span className="text-destructive">*</span></Label>
                    <Input id={`beneficiaries.${index}.birthDate`} type="date" {...register(`beneficiaries.${index}.birthDate`)} className={errors.beneficiaries?.[index]?.birthDate ? 'border-destructive' : ''} />
                    {errors.beneficiaries?.[index]?.birthDate && <p className="text-sm text-destructive mt-1">{errors.beneficiaries[index]?.birthDate?.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor={`beneficiaries.${index}.rg`}>RG <span className="text-destructive">*</span></Label>
                    <Controller name={`beneficiaries.${index}.rg`} control={control} render={({ field: { onChange, value, ref } }) => (
                        <MaskedInput id={`beneficiaries.${index}.rg`} mask="00.000.000-**" value={value} onAccept={(v: string) => onChange(v)} inputRef={ref} placeholder="00.000.000-X" className={errors.beneficiaries?.[index]?.rg ? 'border-destructive' : ''} />
                    )}/>
                    {errors.beneficiaries?.[index]?.rg && <p className="text-sm text-destructive mt-1">{errors.beneficiaries[index]?.rg?.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={`beneficiaries.${index}.relationship`}>Grau de parentesco <span className="text-destructive">*</span></Label>
                  <Controller name={`beneficiaries.${index}.relationship`} control={control} render={({ field: { onChange, value } }) => (
                      <Autocomplete options={relationshipOptions} value={value} onChange={onChange} placeholder="Selecione..." className={errors.beneficiaries?.[index]?.relationship ? 'border-destructive' : ''} />
                  )}/>
                  {errors.beneficiaries?.[index]?.relationship && <p className="text-sm text-destructive mt-1">{errors.beneficiaries[index]?.relationship?.message}</p>}
                </div>
                
                {isMinor && (
                  <div className="md:col-span-2 mt-4 animate-fade-in">
                    <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 text-sm mb-4 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Beneficiário menor de idade. Preencha os dados do responsável.</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-2 border-t border-dashed">
                      <div className="md:col-span-2 space-y-1.5">
                        <Label>Nome do Responsável</Label>
                        <Input {...register(`beneficiaries.${index}.legalRepresentative.fullName`)} className={errors.beneficiaries?.[index]?.legalRepresentative?.fullName ? 'border-destructive' : ''} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>CPF do Responsável</Label>
                        <Controller name={`beneficiaries.${index}.legalRepresentative.cpf`} control={control} render={({ field: { onChange, value, ref } }) => (
                            <MaskedInput mask="000.000.000-00" value={value} onAccept={(v: string) => onChange(v)} inputRef={ref} className={errors.beneficiaries?.[index]?.legalRepresentative?.cpf ? 'border-destructive' : ''} />
                        )}/>
                      </div>
                      <div className="space-y-1.5">
                        <Label>RG do Responsável</Label>
                        <Controller name={`beneficiaries.${index}.legalRepresentative.rg`} control={control} render={({ field: { onChange, value, ref } }) => (
                            <MaskedInput mask="00.000.000-**" value={value} onAccept={(v: string) => onChange(v)} inputRef={ref} className={errors.beneficiaries?.[index]?.legalRepresentative?.rg ? 'border-destructive' : ''} />
                        )}/>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={() => append({ id: Date.now().toString(), fullName: '', cpf: '', rg: '', birthDate: '', relationship: '' })}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Beneficiário
          </Button>
        </div>

        {errors.beneficiaries?.root && <p className="text-sm text-destructive text-center" role="alert">{errors.beneficiaries.root.message}</p>}
        
        <NavigationButtons isNextDisabled={!isValid || isNavigating} />
      </StepLayout>
    </form>
  );
};