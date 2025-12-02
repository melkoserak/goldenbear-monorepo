import { FormDataState } from "@/stores/slices/createFormSlice";

// CPF válido para passar na validação
const CPF_VALIDO = "389.068.918-30"; 

const BASE_PERSONA: Partial<FormDataState> = {
  fullName: "DEV TESTE AUTOMATICO",
  cpf: CPF_VALIDO,
  email: "dev@teste.com",
  phone: "(11) 99999-9999",
  state: "SP",
  consent: true,
  birthDate: "1990-05-05",
  gender: "masculino",
  income: "5000",
  profession: "2410-05", // Advogado
  zipCode: "01001-000",
  street: "Praça da Sé",
  number: "100",
  neighborhood: "Sé",
  city: "São Paulo",
  maritalStatus: "SOLTEIRO",
  company: "EMPRESA DE TESTE LTDA",
  rgNumber: "12.345.678-9",
  rgIssuer: "SSP",
  rgDate: "2010-01-01",
  childrenCount: 0,
  isPPE: false,
  beneficiaries: [
    {
      id: "ben-1",
      fullName: "MAE DO DEV",
      birthDate: "1960-01-01",
      relationship: "MAE",
      percentage: 100,
      cpf: CPF_VALIDO,
      rg: "11.111.111-1",
    }
  ],
};

export const PERSONA_CREDIT_CARD: Partial<FormDataState> = {
  ...BASE_PERSONA,
  fullName: "DEV CARTAO CREDITO",
  payment: {
    method: 'CREDIT_CARD',
    creditCard: {
      number: "4111111111111111",
      holderName: "DEV CARTAO CREDITO",
      expirationDate: "12/30",
      cvv: "123",
      brand: "VISA"
    }
  }
};

export const PERSONA_DEBIT: Partial<FormDataState> = {
  ...BASE_PERSONA,
  fullName: "DEV DEBITO CONTA",
  payment: {
    method: 'DEBIT_ACCOUNT',
    debitAccount: {
      bankCode: "001", // Banco do Brasil
      agency: "1234",
      accountNumber: "12345",
      accountDigit: "X"
    }
  }
};

export const PERSONA_PAYROLL: Partial<FormDataState> = {
  ...BASE_PERSONA,
  fullName: "DEV CONSIGNADO",
  payment: {
    method: 'PAYROLL_DEDUCTION',
    payroll: {
      orgCode: "EXERCITO",
      registrationNumber: "987654321"
    }
  }
};