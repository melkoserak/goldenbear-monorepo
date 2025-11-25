import { describe, it, expect, beforeEach } from 'vitest';
import { create } from 'zustand';
import { createFormSlice, FormSlice } from './createFormSlice';

// 1. Mock do crypto.randomUUID para ambiente de teste (se necessário)
if (!global.crypto) {
  Object.defineProperty(global, 'crypto', {
    value: {
      randomUUID: () => Math.random().toString(36).substring(2) + Date.now().toString(36)
    }
  });
}

// 2. Criamos uma mini-store apenas com o slice que queremos testar
// CORREÇÃO: Adicionado cast (set as any, get as any, api as any)
// Isso resolve o erro de tipagem "FormSlice is not assignable to SimulatorState"
const useTestStore = create<FormSlice>()((set, get, api) => ({
  ...createFormSlice(set as any, get as any, api as any),
}));

describe('Form Slice Logic', () => {
  // Reset da store antes de cada teste
  beforeEach(() => {
    useTestStore.setState({
      formData: {
        fullName: '', cpf: '', email: '', phone: '', state: '', consent: false,
        birthDate: '', gender: '', income: '', profession: '',
        zipCode: '', street: '', number: '', complement: '', neighborhood: '',
        city: '', maritalStatus: '', homePhone: '', rgNumber: '', rgIssuer: '',
        rgDate: '', childrenCount: '0', company: '', isPPE: '', paymentMethod: '',
        beneficiaries: [{
          id: 'initial-ben',
          fullName: '', rg: '', cpf: '', birthDate: '', relationship: '',
          legalRepresentative: { fullName: '', rg: '', cpf: '', birthDate: '', relationship: '' }
        }]
      }
    });
  });

  it('deve iniciar com um beneficiário padrão', () => {
    const { formData } = useTestStore.getState();
    expect(formData.beneficiaries).toHaveLength(1);
    expect(formData.beneficiaries[0].id).toBe('initial-ben');
  });

  it('deve adicionar um novo beneficiário corretamente', () => {
    const { addBeneficiary } = useTestStore.getState();
    
    addBeneficiary();
    
    const { formData } = useTestStore.getState();
    expect(formData.beneficiaries).toHaveLength(2);
    // O segundo deve ter um ID diferente do primeiro
    expect(formData.beneficiaries[1].id).not.toBe('initial-ben');
    expect(formData.beneficiaries[1].id).toBeDefined();
  });

  it('deve remover um beneficiário pelo ID', () => {
    const { addBeneficiary, removeBeneficiary } = useTestStore.getState();
    
    // Adiciona um para ter o que remover
    addBeneficiary();
    const { formData: stateAfterAdd } = useTestStore.getState();
    const newId = stateAfterAdd.beneficiaries[1].id;
    
    // Remove o que acabamos de criar
    removeBeneficiary(newId);
    
    const { formData: stateAfterRemove } = useTestStore.getState();
    expect(stateAfterRemove.beneficiaries).toHaveLength(1);
    expect(stateAfterRemove.beneficiaries[0].id).toBe('initial-ben');
  });

  it('deve atualizar os dados de um beneficiário', () => {
    const { updateBeneficiary } = useTestStore.getState();
    
    updateBeneficiary('initial-ben', { 
      fullName: 'João Teste', 
      cpf: '123.456.789-00' 
    });
    
    const { formData } = useTestStore.getState();
    const updated = formData.beneficiaries[0];
    
    expect(updated.fullName).toBe('João Teste');
    expect(updated.cpf).toBe('123.456.789-00');
    // Garante que outros campos não foram apagados
    expect(updated.id).toBe('initial-ben');
  });
  
  it('deve atualizar o representante legal aninhado', () => {
      const { updateBeneficiary } = useTestStore.getState();
      
      updateBeneficiary('initial-ben', {
          legalRepresentative: { fullName: 'Mãe do João' }
      });
      
      const { formData } = useTestStore.getState();
      expect(formData.beneficiaries[0].legalRepresentative?.fullName).toBe('Mãe do João');
  });
});