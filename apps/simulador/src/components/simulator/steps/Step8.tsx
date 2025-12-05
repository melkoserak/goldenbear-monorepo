"use client";
import React, { useEffect } from 'react';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { StepLayout } from '../StepLayout';
import { NavigationButtons } from '../NavigationButtons';
import { Button } from '@goldenbear/ui/components/button';
import { Input } from '@goldenbear/ui/components/input';
import { Label } from '@goldenbear/ui/components/label';
import { Switch } from '@goldenbear/ui/components/switch';
import { Autocomplete } from '@goldenbear/ui/components/autocomplete';
import { IMaskMixin } from 'react-imask';
import { Trash2, Plus, User, AlertCircle, Baby, ShieldAlert } from 'lucide-react';
import { step8Schema, type Step8Data } from '@/lib/schemas'; 
import { cn } from '@goldenbear/ui/lib/utils';
import { Beneficiary } from '@/stores/slices/createFormSlice';

const MaskedInput = IMaskMixin(({ inputRef, ...props }) => (
  <Input {...props} ref={inputRef as React.Ref<HTMLInputElement>} />
));

const relationshipOptions = [
  { value: 'CONJUGE', label: 'Cônjuge' },
  { value: 'FILHO', label: 'Filho(a)' },
  { value: 'PAI', label: 'Pai' },
  { value: 'MAE', label: 'Mãe' },
  { value: 'IRMAO', label: 'Irmão(ã)' },
  { value: 'COMPANHEIRO', label: 'Companheiro(a)' },
  { value: 'OUTROS', label: 'Outros' },
];

const getAge = (dateString: string) => {
  if (!dateString || dateString.length < 10) return 0;
  const today = new Date();
  const birthDate = new Date(`${dateString}T00:00:00`);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};

export const Step8 = () => {
  const { formData, actions } = useSimulatorStore();
  const { setFormData, nextStep, prefetchQuestionnaireTokens } = actions;

  useEffect(() => { prefetchQuestionnaireTokens(); }, [prefetchQuestionnaireTokens]);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<Step8Data>({
    resolver: zodResolver(step8Schema),
    defaultValues: {
      useLegalHeirs: formData.useLegalHeirs || false,
      beneficiaries: formData.beneficiaries.length > 0 
        ? formData.beneficiaries.map(b => ({
            id: b.id,
            fullName: b.fullName,
            birthDate: b.birthDate,
            relationship: b.relationship,
            percentage: b.percentage,
            cpf: b.cpf || '',
            rg: b.rg || '',
            legalRepresentative: b.legalRepresentative
          }))
        : [{ id: Math.random().toString(36), fullName: '', relationship: '', percentage: 100, birthDate: '', cpf: '', rg: '' }]
    },
    mode: 'onChange'
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "beneficiaries"
  });

  const useLegalHeirs = watch("useLegalHeirs");
  const watchedBeneficiaries = watch("beneficiaries");

  // Agora `curr.percentage` é tipado como number, não precisamos forçar Number() aqui se o dado estiver correto,
  // mas como input pode ser manipulado, um fallback || 0 é seguro.
  const totalPercentage = watchedBeneficiaries?.reduce((acc, curr) => acc + (curr.percentage || 0), 0) || 0;

  const onSubmit = (data: Step8Data) => {
    if (data.useLegalHeirs) {
        setFormData({
            useLegalHeirs: true,
            beneficiaries: []
        });
        nextStep();
        return;
    }

    const beneficiariesToSave: Beneficiary[] = (data.beneficiaries || []).map((b) => ({
        id: b.id,
        fullName: b.fullName,
        birthDate: b.birthDate,
        relationship: b.relationship,
        percentage: b.percentage, // Já é number pelo schema/register
        cpf: b.cpf || '',
        rg: b.rg || '',
        legalRepresentative: b.legalRepresentative ? {
            fullName: b.legalRepresentative.fullName || '',
            cpf: b.legalRepresentative.cpf || '',
            rg: b.legalRepresentative.rg || '',
            birthDate: b.legalRepresentative.birthDate || '',
            relationship: b.legalRepresentative.relationship || ''
        } : undefined
    }));

    setFormData({
        useLegalHeirs: false,
        beneficiaries: beneficiariesToSave
    });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <StepLayout
        title="Quem você deseja proteger?"
        description="Defina quem receberá a indenização ou opte pelos herdeiros legais."
      >
        <div className="space-y-6">
          
          {/* --- OPÇÃO: HERDEIROS LEGAIS --- */}
          <div className="bg-muted/30 p-4 rounded-lg border flex items-start gap-4">
            <div className="pt-1">
                <Controller
                  control={control}
                  name="useLegalHeirs"
                  render={({ field }) => (
                    <Switch 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                        id="legal-heirs-switch"
                    />
                  )}
                />
            </div>
            <div className="space-y-1 flex-1">
                <Label htmlFor="legal-heirs-switch" className="font-semibold text-base cursor-pointer">
                    Usar Herdeiros Legais (Código Civil)
                </Label>
                <p className="text-sm text-muted-foreground">
                    Caso não indique beneficiários, o pagamento seguirá a ordem de vocação hereditária (cônjuge, filhos, pais, etc.) conforme a lei vigente.
                </p>
                {useLegalHeirs && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-100">
                        <ShieldAlert className="w-4 h-4" />
                        <span>A lista de beneficiários abaixo será desconsiderada.</span>
                    </div>
                )}
            </div>
          </div>

          {!useLegalHeirs && (
           <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
            {fields.map((field, index) => {
              const birthDate = watchedBeneficiaries?.[index]?.birthDate;
              const age = getAge(birthDate || '');
              const isMinor = age < 18;

              return (
                <div key={field.id} className="p-5 border rounded-xl bg-card shadow-sm">
                  <div className="flex justify-between items-center mb-4 border-b pb-2 border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-primary/10 rounded-full text-primary">
                        <User className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-sm text-foreground">Beneficiário {index + 1}</h4>
                    </div>
                    {fields.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => remove(index)}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Remover
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nome Completo */}
                    <div className="space-y-1.5 md:col-span-2">
                      <Label>Nome Completo <span className="text-destructive">*</span></Label>
                      <Input 
                        {...register(`beneficiaries.${index}.fullName`)} 
                        placeholder="Nome do beneficiário"
                        className={errors.beneficiaries?.[index]?.fullName ? 'border-destructive' : ''}
                      />
                      {errors.beneficiaries?.[index]?.fullName && 
                        <span className="text-xs text-destructive">{errors.beneficiaries[index]?.fullName?.message}</span>}
                    </div>

                    {/* Data de Nascimento */}
                    <div className="space-y-1.5">
                      <Label>Data de Nascimento <span className="text-destructive">*</span></Label>
                      <Input 
                        type="date"
                        max={new Date().toISOString().split('T')[0]}
                        {...register(`beneficiaries.${index}.birthDate`)} 
                        className={errors.beneficiaries?.[index]?.birthDate ? 'border-destructive' : ''}
                      />
                      {errors.beneficiaries?.[index]?.birthDate && 
                        <span className="text-xs text-destructive">{errors.beneficiaries[index]?.birthDate?.message}</span>}
                    </div>

                    {/* Parentesco */}
                    <div className="space-y-1.5">
                      <Label>Parentesco <span className="text-destructive">*</span></Label>
                      <Controller
                        control={control}
                        name={`beneficiaries.${index}.relationship`}
                        render={({ field: { onChange, value } }) => (
                          <Autocomplete
                            options={relationshipOptions}
                            value={value}
                            onChange={onChange}
                            placeholder="Selecione..."
                            className={errors.beneficiaries?.[index]?.relationship ? 'border-destructive' : ''}
                          />
                        )}
                      />
                      {errors.beneficiaries?.[index]?.relationship && 
                        <span className="text-xs text-destructive">{errors.beneficiaries[index]?.relationship?.message}</span>}
                    </div>

                    {/* CPF (Condicional) */}
                    <div className="space-y-1.5">
                      <Label>
                          CPF {isMinor ? '(Opcional se menor)' : <span className="text-destructive">*</span>}
                      </Label>
                      <Controller
                        control={control}
                        name={`beneficiaries.${index}.cpf`}
                        render={({ field: { onChange, value, onBlur, ref } }) => (
                          <MaskedInput
                            mask="000.000.000-00"
                            value={value || ''}
                            onAccept={(v: string) => onChange(v)}
                            onBlur={onBlur}
                            inputRef={ref}
                            placeholder="000.000.000-00"
                            className={errors.beneficiaries?.[index]?.cpf ? 'border-destructive' : ''}
                          />
                        )}
                      />
                      {errors.beneficiaries?.[index]?.cpf && 
                        <span className="text-xs text-destructive">{errors.beneficiaries[index]?.cpf?.message}</span>}
                    </div>
                    
                     {/* Porcentagem */}
                    <div className="space-y-1.5">
                      <Label>Porcentagem (%) <span className="text-destructive">*</span></Label>
                      <div className="relative">
                        <Input 
                          type="number"
                          // USO CORRETO: valueAsNumber converte automaticamente o input HTML para number
                          {...register(`beneficiaries.${index}.percentage`, { valueAsNumber: true })} 
                          className={errors.beneficiaries?.[index]?.percentage ? 'border-destructive pr-8' : 'pr-8'}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                      </div>
                    </div>
                  </div>

                  {/* RESPONSÁVEL LEGAL */}
                  {isMinor && (
                    <div className="mt-6 p-4 bg-accent/40 rounded-lg border border-primary/20 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center gap-2 mb-4 text-primary">
                        <Baby className="w-5 h-5" />
                        <span className="text-sm font-bold">Beneficiário menor de idade ({age} anos)</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4">
                        É obrigatório informar o <strong>Responsável Legal</strong> que administrará o benefício.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 md:col-span-2">
                          <Label>Nome do Responsável <span className="text-destructive">*</span></Label>
                          <Input 
                            {...register(`beneficiaries.${index}.legalRepresentative.fullName`)}
                            placeholder="Nome do pai, mãe ou tutor"
                            className={errors.beneficiaries?.[index]?.legalRepresentative?.fullName ? 'border-destructive' : ''}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label>CPF do Responsável <span className="text-destructive">*</span></Label>
                          <Controller
                            control={control}
                            name={`beneficiaries.${index}.legalRepresentative.cpf`}
                            render={({ field: { onChange, value, onBlur, ref } }) => (
                              <MaskedInput
                                mask="000.000.000-00"
                                value={value || ''}
                                onAccept={(v: string) => onChange(v)}
                                onBlur={onBlur}
                                inputRef={ref}
                                placeholder="000.000.000-00"
                                className={errors.beneficiaries?.[index]?.legalRepresentative?.cpf ? 'border-destructive' : ''}
                              />
                            )}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label>RG do Responsável <span className="text-destructive">*</span></Label>
                          <Input 
                            {...register(`beneficiaries.${index}.legalRepresentative.rg`)}
                            placeholder="Número do RG"
                            className={errors.beneficiaries?.[index]?.legalRepresentative?.rg ? 'border-destructive' : ''}
                          />
                        </div>

                         <div className="space-y-1.5">
                          <Label>Data Nasc. Responsável <span className="text-destructive">*</span></Label>
                          <Input 
                             type="date"
                             max={new Date().toISOString().split('T')[0]}
                             {...register(`beneficiaries.${index}.legalRepresentative.birthDate`)}
                             className={errors.beneficiaries?.[index]?.legalRepresentative?.birthDate ? 'border-destructive' : ''}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <Button 
              type="button" 
              variant="outline" 
              onClick={() => append({ 
                id: Math.random().toString(), 
                fullName: '', 
                relationship: '', 
                percentage: 0, 
                birthDate: '', 
                cpf: '', 
                rg: '' 
              })}
              className="w-full border-dashed py-6 text-muted-foreground hover:text-primary hover:border-primary/50"
              disabled={fields.length >= 5}
            >
              <Plus className="mr-2 h-4 w-4" /> Adicionar outro beneficiário
            </Button>

            <div className={cn(
              "flex items-center justify-between p-4 rounded-lg border",
              totalPercentage === 100 
                ? "bg-green-50 border-green-200 text-green-800" 
                : "bg-yellow-50 border-yellow-200 text-yellow-800"
            )}>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Total da Indenização</span>
              </div>
              <span className="text-lg font-bold">{totalPercentage}%</span>
            </div>
            {totalPercentage !== 100 && (
              <p className="text-xs text-destructive text-right mt-1">
                A soma precisa ser exatamente 100%. Ajuste os valores acima.
              </p>
            )}
            
            {errors.root && (
               <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm text-center">
                  {errors.root.message}
               </div>
            )}
           </div>
          )}

        </div>
        <NavigationButtons isNextDisabled={!isValid} />
      </StepLayout>
    </form>
  );
};