import { FormDataState } from "@/stores/slices/createFormSlice";

// CPF válido (Gerado para testes, passa no algoritmo de Luhn)
const CPF_VALIDO = "389.068.918-30"; 
const CPF_SECUNDARIO = "123.456.789-09"; // Exemplo fictício

const BASE_PERSONA: Partial<FormDataState> = {
  fullName: "DEV TESTE AUTOMATICO",
  cpf: CPF_VALIDO,
  email: "dev@teste.com",
  phone: "(11) 99999-9999",
  state: "SP",
  consent: true,
  // Default seguro
  birthDate: "1990-05-05",
  gender: "masculino",
  income: "5000",
  profession: "2410-05", 
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

// --- CENÁRIOS BÁSICOS (Pagamento) ---

export const PERSONA_CREDIT_CARD: Partial<FormDataState> = {
  ...BASE_PERSONA,
  fullName: "DEV CARTAO CREDITO",
  beneficiaries: [{ id: "b1", fullName: "MAE DO DEV", birthDate: "1960-01-01", relationship: "MAE", percentage: 100, cpf: CPF_VALIDO, rg: "11.111.111-1" }],
  payment: {
    method: 'CREDIT_CARD',
    creditCard: { number: "4111111111111111", holderName: "DEV CARTAO", expirationDate: "12/30", cvv: "123", brand: "VISA" }
  }
};

export const PERSONA_DEBIT: Partial<FormDataState> = {
  ...BASE_PERSONA,
  fullName: "DEV DEBITO CONTA",
  beneficiaries: [{ id: "b1", fullName: "MAE DO DEV", birthDate: "1960-01-01", relationship: "MAE", percentage: 100, cpf: CPF_VALIDO, rg: "11.111.111-1" }],
  payment: {
    method: 'DEBIT_ACCOUNT',
    debitAccount: { bankCode: "001", agency: "1234", accountNumber: "12345", accountDigit: "X" }
  }
};

export const PERSONA_PAYROLL: Partial<FormDataState> = {
  ...BASE_PERSONA,
  fullName: "DEV CONSIGNADO",
  beneficiaries: [{ id: "b1", fullName: "MAE DO DEV", birthDate: "1960-01-01", relationship: "MAE", percentage: 100, cpf: CPF_VALIDO, rg: "11.111.111-1" }],
  payment: {
    method: 'PAYROLL_DEDUCTION',
    payroll: { orgCode: "EXERCITO", registrationNumber: "987654321" }
  }
};

// --- CENÁRIOS COMPLEXOS (Novos) ---

// 1. Família Grande + PPE + Menores de Idade
export const PERSONA_FAMILIA_PPE: Partial<FormDataState> = {
  ...BASE_PERSONA,
  fullName: "VEREADOR TESTE",
  maritalStatus: "CASADO",
  childrenCount: 2,
  isPPE: true, // <--- PPE Ativado
  company: "CAMARA MUNICIPAL", // Cargo
  beneficiaries: [
    { 
      id: "esp", fullName: "ESPOSA TESTE", relationship: "CONJUGE", percentage: 50, 
      birthDate: "1990-01-01", cpf: CPF_SECUNDARIO, rg: "22222" 
    },
    { 
      id: "filho1", fullName: "FILHO MENOR 1", relationship: "FILHO", percentage: 25, 
      birthDate: "2020-01-01", cpf: "", rg: "", // Menor de idade
      legalRepresentative: { fullName: "VEREADOR TESTE", cpf: CPF_VALIDO, rg: "12345", birthDate: "1990-05-05", relationship: "PAI" }
    },
    { 
      id: "filho2", fullName: "FILHO MENOR 2", relationship: "FILHO", percentage: 25, 
      birthDate: "2022-05-05", cpf: "", rg: "", // Menor de idade
      legalRepresentative: { fullName: "VEREADOR TESTE", cpf: CPF_VALIDO, rg: "12345", birthDate: "1990-05-05", relationship: "PAI" }
    }
  ],
  payment: PERSONA_DEBIT.payment // Reusa pagamento débito
};

// 2. Sênior (Idade avançada, filhos adultos)
export const PERSONA_SENIOR: Partial<FormDataState> = {
  ...BASE_PERSONA,
  fullName: "SENIOR TESTE",
  birthDate: "1960-05-05", // 60+ anos
  maritalStatus: "VIUVO",
  childrenCount: 2,
  profession: "2410-05", // Aposentado ou ativo
  beneficiaries: [
    { 
      id: "f1", fullName: "FILHO ADULTO 1", relationship: "FILHO", percentage: 50, 
      birthDate: "1985-01-01", cpf: CPF_SECUNDARIO, rg: "33333" // Maior de idade (sem tutor)
    },
    { 
      id: "f2", fullName: "FILHO ADULTO 2", relationship: "FILHO", percentage: 50, 
      birthDate: "1988-01-01", cpf: CPF_SECUNDARIO, rg: "44444" 
    }
  ],
  payment: PERSONA_CREDIT_CARD.payment // Reusa cartão
};

// 3. Militar Jovem (Solteiro, Mãe beneficiária)
export const PERSONA_JOVEM_MILITAR: Partial<FormDataState> = {
  ...BASE_PERSONA,
  fullName: "TENENTE JOVEM",
  birthDate: "2003-01-01", // ~21 anos
  maritalStatus: "SOLTEIRO",
  profession: "010105", // Oficial das Forças Armadas
  company: "EXERCITO BRASILEIRO",
  beneficiaries: [
    { 
      id: "mae", fullName: "MAE DO TENENTE", relationship: "MAE", percentage: 100, 
      birthDate: "1975-01-01", cpf: CPF_SECUNDARIO, rg: "55555" 
    }
  ],
  payment: PERSONA_PAYROLL.payment // Consignado
};