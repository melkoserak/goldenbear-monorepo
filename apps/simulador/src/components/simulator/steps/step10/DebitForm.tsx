"use client";

import React, { useEffect } from 'react';
import { UseFormReturn, FieldErrors } from 'react-hook-form';
// IMPORT UNIFICADO (Melhor prática se o index.ts exporta tudo)
import { 
  Label, 
  Input, 
  Button, 
  Autocomplete, 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Checkbox 
} from '@goldenbear/ui';
import { Step10Data } from '@/lib/schemas';
import { banks } from '@/lib/data/banks';

interface Props { 
  form: UseFormReturn<Step10Data>; 
}

type DebitErrors = FieldErrors<{
  method: 'DEBIT_ACCOUNT';
  debitAccount: {
    bankCode: string;
    agency: string;
    accountNumber: string;
    accountDigit: string;
  };
  payer: {
    isInsuredPayer: boolean;
    payerName: string;
    payerCpf: string;
    payerRelationship: string;
  };
  consentDebit: boolean;
}>;

export const DebitForm = ({ form: { register, setValue, watch, formState } }: Props) => {
  const selectedBank = watch('debitAccount.bankCode');
  const isInsuredPayer = watch('payer.isInsuredPayer' as any); 
  const payerName = watch('payer.payerName' as any);
  
  const errors = formState.errors as DebitErrors;

  useEffect(() => {
    if (isInsuredPayer === undefined) {
      setValue('payer.isInsuredPayer' as any, true);
    }
  }, [isInsuredPayer, setValue]);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* BLOCO 1: DADOS BANCÁRIOS */}
      <div className="bg-card border rounded-lg p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Dados Bancários
          </h3>
          <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-100 flex items-center gap-1">
            🔒 Ambiente Seguro
          </span>
        </div>

        <div className="space-y-1.5">
          <Label>Banco</Label>
          <Autocomplete 
            options={banks}
            value={selectedBank}
            onChange={(val) => setValue('debitAccount.bankCode', val, { shouldValidate: true })}
            placeholder="Busque pelo nome ou código (ex: 260)"
            className={errors.debitAccount?.bankCode ? 'border-destructive' : ''}
          />
          {errors.debitAccount?.bankCode && (
            <span className="text-xs text-destructive">{errors.debitAccount.bankCode.message}</span>
          )}
        </div>
       
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1 space-y-1.5">
             <Label>Agência</Label>
             <Input 
                {...register('debitAccount.agency')} 
                placeholder="Sem dígito" 
                className={errors.debitAccount?.agency ? 'border-destructive' : ''}
             />
          </div>
          <div className="col-span-2 flex gap-2">
             <div className="flex-1 space-y-1.5">
                <Label>Conta Corrente</Label>
                <Input 
                  {...register('debitAccount.accountNumber')} 
                  placeholder="Número" 
                  className={errors.debitAccount?.accountNumber ? 'border-destructive' : ''}
                />
             </div>
             <div className="w-20 space-y-1.5">
                <Label>Dígito</Label>
                <Input 
                  {...register('debitAccount.accountDigit')} 
                  placeholder="X" 
                  className={`text-center ${errors.debitAccount?.accountDigit ? 'border-destructive' : ''}`}
                  maxLength={2} 
                />
             </div>
          </div>
        </div>
        {(errors.debitAccount?.agency || errors.debitAccount?.accountNumber) && 
          <p className="text-xs text-destructive font-medium mt-1">
            Por favor, revise os dados da agência e conta.
          </p>
        }
      </div>

      {/* BLOCO 2: QUEM VAI PAGAR */}
      <div className="bg-card border rounded-lg p-6 shadow-sm space-y-5">
        <div className="space-y-3">
          <Label className="text-base font-medium text-foreground">
            A conta acima pertence a você?
          </Label>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant={isInsuredPayer ? "default" : "outline"}
              onClick={() => setValue('payer.isInsuredPayer' as any, true)}
              className={`h-12 w-full transition-all ${isInsuredPayer ? 'shadow-md' : 'opacity-80 hover:opacity-100'}`}
            >
              Sim, é minha
            </Button>
            
            <Button
              type="button"
              variant={!isInsuredPayer ? "default" : "outline"}
              onClick={() => setValue('payer.isInsuredPayer' as any, false)}
              className={`h-12 w-full transition-all ${!isInsuredPayer ? 'shadow-md' : 'opacity-80 hover:opacity-100'}`}
            >
              Não, é de outra pessoa
            </Button>
          </div>
        </div>

        {!isInsuredPayer && (
          <div className="pt-4 mt-2 border-t space-y-4 animate-in slide-in-from-top-2 fade-in duration-300">
            <div className="bg-blue-50/80 border border-blue-100 rounded-md p-3 text-blue-900">
              <p className="text-xs leading-relaxed">
                <strong>Dica:</strong> Para aprovação bancária, informe os dados exatos do titular.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label>Nome Completo do Dono da Conta</Label>
              <Input 
                {...register('payer.payerName' as any)} 
                placeholder="Ex: Maria Silva" 
                className={errors.payer?.payerName ? 'border-destructive' : ''}
              />
              {errors.payer?.payerName && 
                <span className="text-xs text-destructive">{errors.payer.payerName.message}</span>
              }
            </div>

            <div className="space-y-1.5">
              <Label>CPF do Dono da Conta</Label>
              <Input 
                {...register('payer.payerCpf' as any)} 
                placeholder="000.000.000-00"
                maxLength={14}
                onChange={(e) => {
                  let v = e.target.value.replace(/\D/g, '');
                  if (v.length > 11) v = v.slice(0, 11);
                  v = v.replace(/(\d{3})(\d)/, '$1.$2');
                  v = v.replace(/(\d{3})(\d)/, '$1.$2');
                  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                  setValue('payer.payerCpf' as any, v);
                }}
                className={errors.payer?.payerCpf ? 'border-destructive' : ''}
              />
              {errors.payer?.payerCpf && 
                <span className="text-xs text-destructive">{errors.payer.payerCpf.message}</span>
              }
            </div>

            <div className="space-y-1.5">
              <Label>Qual a relação dessa pessoa com você?</Label>
              <Select 
                onValueChange={(val) => setValue('payer.payerRelationship' as any, val)}
              >
                <SelectTrigger className={errors.payer?.payerRelationship ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Selecione o parentesco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONJUGE">Cônjuge (Marido/Esposa)</SelectItem>
                  <SelectItem value="PAI_MAE">Pai ou Mãe</SelectItem>
                  <SelectItem value="FILHO">Filho(a)</SelectItem>
                  <SelectItem value="SOCIO">Sócio / Empresa</SelectItem>
                  <SelectItem value="OUTROS">Outro familiar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* BLOCO 3: ACEITE DE DÉBITO */}
      <div 
        className={`
          p-4 rounded-lg border transition-colors
          ${errors.consentDebit ? 'border-destructive bg-red-50/50' : 'border-border bg-muted/20'}
        `}
      >
        <div className="flex items-start space-x-3">
          {/* CORREÇÃO AQUI: Tipagem explicita no onCheckedChange */}
          <Checkbox 
            id="consentDebit" 
            className="mt-1"
            onCheckedChange={(checked: boolean | 'indeterminate') => {
              setValue('consentDebit' as any, checked === true, { shouldValidate: true })
            }}
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="consentDebit"
              className="text-sm font-normal text-muted-foreground leading-relaxed cursor-pointer"
            >
              Autorizo o débito mensal na conta de titularidade de{' '}
              <span className="font-semibold text-foreground">
                {isInsuredPayer ? 'minha responsabilidade' : (payerName || 'terceiro informado')}
              </span>
              {' '}conforme os termos do contrato.
            </Label>
            {errors.consentDebit && (
              <span className="text-xs text-destructive font-semibold animate-pulse">
                É necessário marcar a caixa acima para autorizar o pagamento.
              </span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};