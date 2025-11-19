"use client";
import React, { useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
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

export const Step8 = () => {
  const { formData } = useSimulatorStore();
  const { setFormData, nextStep, prefetchQuestionnaireTokens } = useSimulatorStore((state) => state.actions);
  const firstName = formData.fullName.split(' ')[0] || "";

  const { 
    control, 
    register, 
    handleSubmit, 
    formState: { errors, isValid } 
  } = useForm<Step8Data>({
    resolver: zodResolver(step8Schema),
    defaultValues: {
      beneficiaries: formData.beneficiaries.map(b => ({
        ...b,
        legalRepresentative: b.legalRepresentative || {}
      }))
    },
    mode: 'onBlur'
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "beneficiaries"
  });

  useEffect(() => {
    track('step_view', { step: 8, step_name: 'Beneficiários' });
  }, []);

  useEffect(() => {
    if (isValid) {
        prefetchQuestionnaireTokens();
    }
  }, [isValid, prefetchQuestionnaireTokens]);

  const onSubmit = (data: Step8Data) => {
    setFormData({ beneficiaries: data.beneficiaries as any });
    track('step_complete', { step: 8, step_name: 'Beneficiários', count: data.beneficiaries.length });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-in" noValidate>
      <h3 tabIndex={-1} className="text-2xl font-medium text-left mb-2 text-foreground outline-none">
        Para quem vão os benefícios, {firstName}?
      </h3>
      <p className="text-left text-muted-foreground mb-4">Indique pelo menos um beneficiário. É crucial que esses dados estejam corretos para evitar problemas no futuro.</p>
      <p className="text-left text-xs text-muted-foreground italic mb-8">
        <strong>Nota:</strong> Se um beneficiário for menor de 18 anos, é necessário indicar um responsável legal.
      </p>

      {fields.map((field, index) => (
        <div key={field.id} className="border rounded-lg p-6 mb-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-primary">Beneficiário {index + 1}</h4>
            {fields.length > 1 && (
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => remove(index)} 
                className="text-destructive hover:bg-destructive/10"
                aria-label={`Remover beneficiário ${index + 1}`}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Nome */}
            <div className="md:col-span-2 space-y-1.5">
              <Label htmlFor={`beneficiaries.${index}.fullName`}>Nome completo <span className="text-destructive">*</span></Label>
              <Input 
                id={`beneficiaries.${index}.fullName`}
                {...register(`beneficiaries.${index}.fullName`)} 
                className={errors.beneficiaries?.[index]?.fullName ? 'border-destructive' : ''} 
                aria-invalid={errors.beneficiaries?.[index]?.fullName ? "true" : "false"}
                aria-describedby={`beneficiaries.${index}.fullName-error`}
              />
              {errors.beneficiaries?.[index]?.fullName && (
                <p id={`beneficiaries.${index}.fullName-error`} className="text-sm text-destructive mt-1" role="alert">
                  {errors.beneficiaries[index]?.fullName?.message}
                </p>
              )}
            </div>
            
            {/* CPF */}
            <div className="space-y-1.5">
              <Label htmlFor={`beneficiaries.${index}.cpf`}>CPF <span className="text-destructive">*</span></Label>
              <Controller
                name={`beneficiaries.${index}.cpf`}
                control={control}
                render={({ field: { onChange, value, ref } }) => (
                   <MaskedInput 
                     id={`beneficiaries.${index}.cpf`}
                     mask="000.000.000-00" 
                     value={value} 
                     onAccept={(v: string) => onChange(v)} 
                     inputRef={ref} 
                     className={errors.beneficiaries?.[index]?.cpf ? 'border-destructive' : ''} 
                     placeholder="000.000.000-00"
                     aria-invalid={errors.beneficiaries?.[index]?.cpf ? "true" : "false"}
                     aria-describedby={`beneficiaries.${index}.cpf-error`}
                   />
                )}
              />
              {errors.beneficiaries?.[index]?.cpf && (
                <p id={`beneficiaries.${index}.cpf-error`} className="text-sm text-destructive mt-1" role="alert">
                  {errors.beneficiaries[index]?.cpf?.message}
                </p>
              )}
            </div>

            {/* Data Nascimento */}
            <div className="space-y-1.5">
                <Label htmlFor={`beneficiaries.${index}.birthDate`}>Data de Nascimento <span className="text-destructive">*</span></Label>
                <Input 
                  id={`beneficiaries.${index}.birthDate`}
                  type="date" 
                  {...register(`beneficiaries.${index}.birthDate`)} 
                  className={errors.beneficiaries?.[index]?.birthDate ? 'border-destructive' : ''}
                  aria-invalid={errors.beneficiaries?.[index]?.birthDate ? "true" : "false"}
                  aria-describedby={`beneficiaries.${index}.birthDate-error`}
                />
                {errors.beneficiaries?.[index]?.birthDate && (
                  <p id={`beneficiaries.${index}.birthDate-error`} className="text-sm text-destructive mt-1" role="alert">
                    {errors.beneficiaries[index]?.birthDate?.message}
                  </p>
                )}
            </div>

            {/* RG */}
             <div className="space-y-1.5">
                <Label htmlFor={`beneficiaries.${index}.rg`}>RG <span className="text-destructive">*</span></Label>
                <Controller
                    name={`beneficiaries.${index}.rg`}
                    control={control}
                    render={({ field: { onChange, value, ref } }) => (
                        <MaskedInput 
                          id={`beneficiaries.${index}.rg`}
                          mask="00.000.000-**" 
                          value={value} 
                          onAccept={(v: string) => onChange(v)} 
                          inputRef={ref} 
                          placeholder="00.000.000-X"
                          className={errors.beneficiaries?.[index]?.rg ? 'border-destructive' : ''}
                          aria-invalid={errors.beneficiaries?.[index]?.rg ? "true" : "false"}
                          aria-describedby={`beneficiaries.${index}.rg-error`}
                        />
                    )}
                />
                {errors.beneficiaries?.[index]?.rg && (
                  <p id={`beneficiaries.${index}.rg-error`} className="text-sm text-destructive mt-1" role="alert">
                    {errors.beneficiaries[index]?.rg?.message}
                  </p>
                )}
            </div>

            {/* Parentesco */}
            <div className="space-y-1.5">
              <Label htmlFor={`beneficiaries.${index}.relationship`}>Grau de parentesco <span className="text-destructive">*</span></Label>
              <Controller
                name={`beneficiaries.${index}.relationship`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete 
                    // Nota: Autocomplete não aceita ID diretamente no input interno facilmente sem refatoração do componente UI,
                    // mas mantemos a estrutura para consistência.
                    options={relationshipOptions} 
                    value={value} 
                    onChange={onChange} 
                    placeholder="Selecione..." 
                    className={errors.beneficiaries?.[index]?.relationship ? 'border-destructive' : ''}
                  />
                )}
              />
              {errors.beneficiaries?.[index]?.relationship && (
                <p id={`beneficiaries.${index}.relationship-error`} className="text-sm text-destructive mt-1" role="alert">
                  {errors.beneficiaries[index]?.relationship?.message}
                </p>
              )}
            </div>
            
            {/* Área do Responsável Legal */}
            <div className="md:col-span-2 mt-4">
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 text-sm mb-4 flex items-center gap-2" role="alert">
                 <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                 <span>Se o beneficiário for menor de 18 anos, preencha os dados do responsável abaixo.</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-2 border-t border-dashed">
                <div className="md:col-span-2 space-y-1.5">
                  <Label htmlFor={`beneficiaries.${index}.legalRepresentative.fullName`}>Nome do Responsável</Label>
                  <Input 
                    id={`beneficiaries.${index}.legalRepresentative.fullName`}
                    {...register(`beneficiaries.${index}.legalRepresentative.fullName`)} 
                    className={errors.beneficiaries?.[index]?.legalRepresentative?.fullName ? 'border-destructive' : ''}
                    aria-invalid={errors.beneficiaries?.[index]?.legalRepresentative?.fullName ? "true" : "false"}
                    aria-describedby={`beneficiaries.${index}.legalRepresentative.fullName-error`}
                  />
                  {errors.beneficiaries?.[index]?.legalRepresentative?.fullName && (
                    <p id={`beneficiaries.${index}.legalRepresentative.fullName-error`} className="text-xs text-destructive" role="alert">
                        {errors.beneficiaries[index]?.legalRepresentative?.fullName?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                   <Label htmlFor={`beneficiaries.${index}.legalRepresentative.cpf`}>CPF do Responsável</Label>
                   <Controller
                      name={`beneficiaries.${index}.legalRepresentative.cpf`}
                      control={control}
                      render={({ field: { onChange, value, ref } }) => (
                         <MaskedInput 
                            id={`beneficiaries.${index}.legalRepresentative.cpf`}
                            mask="000.000.000-00" 
                            value={value} 
                            onAccept={(v: string) => onChange(v)} 
                            inputRef={ref} 
                            className={errors.beneficiaries?.[index]?.legalRepresentative?.cpf ? 'border-destructive' : ''}
                            aria-invalid={errors.beneficiaries?.[index]?.legalRepresentative?.cpf ? "true" : "false"}
                            aria-describedby={`beneficiaries.${index}.legalRepresentative.cpf-error`}
                         />
                      )}
                   />
                   {errors.beneficiaries?.[index]?.legalRepresentative?.cpf && (
                    <p id={`beneficiaries.${index}.legalRepresentative.cpf-error`} className="text-xs text-destructive" role="alert">
                        {errors.beneficiaries[index]?.legalRepresentative?.cpf?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                   <Label htmlFor={`beneficiaries.${index}.legalRepresentative.rg`}>RG do Responsável</Label>
                   <Controller
                      name={`beneficiaries.${index}.legalRepresentative.rg`}
                      control={control}
                      render={({ field: { onChange, value, ref } }) => (
                         <MaskedInput 
                            id={`beneficiaries.${index}.legalRepresentative.rg`}
                            mask="00.000.000-**" 
                            value={value} 
                            onAccept={(v: string) => onChange(v)} 
                            inputRef={ref}
                            className={errors.beneficiaries?.[index]?.legalRepresentative?.rg ? 'border-destructive' : ''}
                            aria-invalid={errors.beneficiaries?.[index]?.legalRepresentative?.rg ? "true" : "false"}
                            aria-describedby={`beneficiaries.${index}.legalRepresentative.rg-error`}
                         />
                      )}
                   />
                   {errors.beneficiaries?.[index]?.legalRepresentative?.rg && (
                    <p id={`beneficiaries.${index}.legalRepresentative.rg-error`} className="text-xs text-destructive" role="alert">
                        {errors.beneficiaries[index]?.legalRepresentative?.rg?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-end mb-4">
        <Button type="button" variant="outline" onClick={() => append({ id: Date.now().toString(), fullName: '', cpf: '', rg: '', birthDate: '', relationship: '' })}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Beneficiário
        </Button>
      </div>

      {/* Mensagem de erro global da lista */}
      {errors.beneficiaries?.root && (
          <p className="text-sm text-destructive text-center mb-4" role="alert">
            {errors.beneficiaries.root.message}
          </p>
      )}
      
      <NavigationButtons isNextDisabled={!isValid} />
    </form>
  );
};