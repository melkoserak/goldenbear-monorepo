import { FormDataState } from "@/stores/slices/createFormSlice";

// CPF válido (Gerado para testes, passa no algoritmo de Luhn)
const CPF_VALIDO = "389.068.918-30"; 
const CPF_CONJUGE = "123.456.789-09"; 
const CPF_TERCEIRO = "222.222.222-22"; 
const CPF_MAE = "555.555.555-55";

const BASE_PERSONA: Partial<FormDataState> = {
  fullName: "DEV TESTE AUTOMATICO",
  cpf: CPF_VALIDO,
  email: "dev@teste.com",
  phone: "(11) 99999-9999",
  state: "SP",
  consent: true,
  // Dados Padrão
  birthDate: "1994-05-05",
  gender: "masculino",
  income: "5000",
  profession: "2410-05", // Advogado
  zipCode: "01001-000",
  street: "Praça da Sé",
  number: "100",
  neighborhood: "Sé",
  city: "São Paulo",
  maritalStatus: "SOLTEIRO",
  company: "EMPRESA TESTE",
  rgNumber: "12.345.678-9",
  rgIssuer: "SSP",
  rgDate: "2010-01-01",
  childrenCount: 0,
  isPPE: false,
  beneficiaries: [],
  payment: { method: '' }
};

// --- CENÁRIOS BÁSICOS ---

export const PERSONA_CREDIT_CARD: Partial<FormDataState> = {
  ...BASE_PERSONA,
  fullName: "DEV CARTAO CREDITO",
  beneficiaries: [{ id: "b1", fullName: "MAE DO DEV", birthDate: "1960-01-01", relationship: "MAE", percentage: 100, cpf: CPF_MAE, rg: "11.111.111-1" }],
  payment: {
    method: 'CREDIT_CARD',
    creditCard: { number: "4111111111111111", holderName: "DEV CARTAO", expirationDate: "12/30", cvv: "123", brand: "VISA" }
  }
};

export const PERSONA_DEBIT: Partial<FormDataState> = {
  ...BASE_PERSONA,
  fullName: "DEV DEBITO CONTA",
  beneficiaries: [{ id: "b1", fullName: "FILHO DO DEV", birthDate: "2020-01-01", relationship: "FILHO", percentage: 100, cpf: "", rg: "" }],
  payment: {
    method: 'DEBIT_ACCOUNT',
    debitAccount: { bankCode: "260", agency: "0001", accountNumber: "1234567", accountDigit: "8" },
    // Reset do pagador para garantir que é o próprio
    payer: {
      isInsuredPayer: true,
      payerName: "",
      payerCpf: "",
      payerRelationship: ""
    },
    consentDebit: true
  }
};

export const PERSONA_PAYROLL: Partial<FormDataState> = {
  ...BASE_PERSONA,
  fullName: "DEV CONSIGNADO",
  company: "ORGAO PUBLICO",
  payment: {
    method: 'PAYROLL_DEDUCTION',
    payroll: { orgCode: "SIAPE", registrationNumber: "12345678" }
  }
};

// --- CENÁRIOS COMPLEXOS ---

export const PERSONA_FAMILIA_PPE: Partial<FormDataState> = {
  ...BASE_PERSONA,
  fullName: "VEREADOR TESTE",
  maritalStatus: "CASADO",
  childrenCount: 2,
  isPPE: true, 
  company: "CAMARA MUNICIPAL",
  beneficiaries: [
    { 
      id: "esp", fullName: "ESPOSA TESTE", relationship: "CONJUGE", percentage: 50, 
      birthDate: "1990-01-01", cpf: CPF_CONJUGE, rg: "22222" 
    },
    { 
      id: "filho1", fullName: "FILHO MENOR 1", relationship: "FILHO", percentage: 25, 
      birthDate: "2020-01-01", cpf: "", rg: "", 
      legalRepresentative: { fullName: "VEREADOR TESTE", cpf: CPF_VALIDO, rg: "12345", birthDate: "1994-05-05", relationship: "PAI" }
    },
    { 
      id: "filho2", fullName: "FILHO MENOR 2", relationship: "FILHO", percentage: 25, 
      birthDate: "2022-05-05", cpf: "", rg: "", 
      legalRepresentative: { fullName: "VEREADOR TESTE", cpf: CPF_VALIDO, rg: "12345", birthDate: "1994-05-05", relationship: "PAI" }
    }
  ],
  payment: PERSONA_DEBIT.payment 
};

export const PERSONA_SENIOR: Partial<FormDataState> = {
  ...BASE_PERSONA,
  fullName: "SENIOR TESTE",
  birthDate: "1960-05-05",
  maritalStatus: "VIUVO",
  childrenCount: 2,
  profession: "9999-99", // Aposentado
  beneficiaries: [
    { 
      id: "f1", fullName: "FILHO ADULTO 1", relationship: "FILHO", percentage: 50, 
      birthDate: "1985-01-01", cpf: CPF_CONJUGE, rg: "33333" 
    },
    { 
      id: "f2", fullName: "FILHO ADULTO 2", relationship: "FILHO", percentage: 50, 
      birthDate: "1988-01-01", cpf: CPF_TERCEIRO, rg: "44444" 
    }
  ],
  payment: PERSONA_CREDIT_CARD.payment 
};

export const PERSONA_JOVEM_MILITAR: Partial<FormDataState> = {
  ...BASE_PERSONA,
  fullName: "TENENTE JOVEM",
  birthDate: "2003-01-01", 
  maritalStatus: "SOLTEIRO",
  profession: "0101-05", // Militar
  company: "EXERCITO BRASILEIRO",
  beneficiaries: [
    { 
      id: "mae", fullName: "MAE DO TENENTE", relationship: "MAE", percentage: 100, 
      birthDate: "1975-01-01", cpf: CPF_MAE, rg: "55555" 
    }
  ],
  payment: PERSONA_PAYROLL.payment 
};

// --- FIX: DÉBITO COM PAGADOR TERCEIRO (SUPORTE) ---
export const PERSONA_DEBIT_THIRD_PARTY: Partial<FormDataState> = {
  ...BASE_PERSONA,
  fullName: "SEGURADO SEM CONTA",
  maritalStatus: "CASADO",
  // Adiciona a esposa como beneficiária para consistência
  beneficiaries: [{ 
    id: "b1", fullName: "ESPOSA PAGADORA", 
    birthDate: "1990-01-01", relationship: "CONJUGE", 
    percentage: 100, cpf: CPF_TERCEIRO, rg: "22.222.222-2" 
  }],
  payment: {
    method: 'DEBIT_ACCOUNT',
    debitAccount: { 
      bankCode: "341", // Itaú
      agency: "2020", 
      accountNumber: "998877", 
      accountDigit: "5" 
    },
    // Configuração do Terceiro Pagador
    payer: {
      isInsuredPayer: false,           // Switch OFF
      payerName: "ESPOSA PAGADORA",
      payerCpf: CPF_TERCEIRO,          // CPF da esposa
      payerRelationship: "CONJUGE"     // Vínculo
    },
    consentDebit: true // Aceite marcado
  }
};