"use client";
import React from 'react';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { StepLayout } from '../StepLayout';
import { NavigationButtons } from '../NavigationButtons';
import { Button } from '@goldenbear/ui/components/button';
import { Input } from '@goldenbear/ui/components/input';
import { Label } from '@goldenbear/ui/components/label';
import { Trash2, Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@goldenbear/ui/components/select";

export const Step8 = () => {
  const { formData, actions } = useSimulatorStore();
  const { beneficiaries } = formData;
  const { addBeneficiary, removeBeneficiary, updateBeneficiary, prefetchQuestionnaireTokens } = actions;

  // Carrega o próximo passo enquanto o utilizador preenche este
  React.useEffect(() => {
    prefetchQuestionnaireTokens();
  }, [prefetchQuestionnaireTokens]);

  const totalPercentage = beneficiaries.reduce((acc, b) => acc + (Number(b.percentage) || 0), 0);
  const isValid = beneficiaries.length > 0 && totalPercentage === 100 && beneficiaries.every(b => b.fullName && b.relationship);

  return (
    <StepLayout
      title="Beneficiários"
      description="Quem você deseja proteger? (A soma deve ser 100%)"
    >
      <div className="space-y-6">
        {beneficiaries.map((beneficiary, index) => (
          <div key={beneficiary.id} className="p-4 border rounded-lg bg-card space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-sm">Beneficiário {index + 1}</h4>
              <Button variant="ghost" size="icon" onClick={() => removeBeneficiary(beneficiary.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input 
                value={beneficiary.fullName} 
                onChange={(e) => updateBeneficiary(beneficiary.id, { fullName: e.target.value })} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data de Nascimento</Label>
                <Input 
                  type="date" 
                  value={beneficiary.birthDate} 
                  onChange={(e) => updateBeneficiary(beneficiary.id, { birthDate: e.target.value })} 
                />
              </div>
              
              {/* Parentesco Padronizado */}
              <div className="space-y-2">
                <Label>Parentesco</Label>
                <Select 
                  value={beneficiary.relationship} 
                  onValueChange={(val: string) => updateBeneficiary(beneficiary.id, { relationship: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONJUGE">Cônjuge</SelectItem>
                    <SelectItem value="FILHO">Filho(a)</SelectItem>
                    <SelectItem value="PAI">Pai</SelectItem>
                    <SelectItem value="MAE">Mãe</SelectItem>
                    <SelectItem value="IRMAO">Irmão(ã)</SelectItem>
                    <SelectItem value="OUTROS">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Porcentagem (%)</Label>
              <Input 
                type="number" 
                value={beneficiary.percentage} 
                onChange={(e) => updateBeneficiary(beneficiary.id, { percentage: Number(e.target.value) })} 
              />
            </div>
          </div>
        ))}

        <Button onClick={addBeneficiary} variant="outline" className="w-full border-dashed">
          <Plus className="mr-2 h-4 w-4" /> Adicionar Beneficiário
        </Button>

        {/* Validação Visual */}
        <div className={`text-right text-sm font-medium ${totalPercentage !== 100 ? 'text-destructive' : 'text-green-600'}`}>
          Total: {totalPercentage}%
        </div>
      </div>

      <NavigationButtons isNextDisabled={!isValid} />
    </StepLayout>
  );
};