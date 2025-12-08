import { z } from 'zod';

// --- REGEX AUXILIARES ---
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/; 
const zipRegex = /^\d{5}-\d{3}$/; 
const dateRegex = /^\d{4}-\d{2}-\d{2}$/; 

// --- FUNÇÃO AUXILIAR: VALIDAÇÃO DE CPF (MÓDULO 11) ---
const isValidCPF = (cpf: string) => {
  if (typeof cpf !== "string") return false;
  const cleanCpf = cpf.replace(/[^\d]+/g, "");
  if (cleanCpf.length !== 11 || !!cleanCpf.match(/(\d)\1{10}/)) return false;
  const cpfArr = cleanCpf.split("").map((el) => +el);
  const rest = (count: number) =>
    ((cpfArr.slice(0, count - 12).reduce((syt, el, idx) => syt + el * (count - idx), 0) * 10) % 11) % 10;
  return rest(10) === cpfArr[9] && rest(11) === cpfArr[10];
};

// --- SCHEMAS ---

export const step1Schema = z.object({
  fullName: z.string().min(1, "O nome é obrigatório").refine((val) => val.trim().split(' ').length >= 2, "Digite seu nome e sobrenome."),
}).strip();

export const step2Schema = z.object({
  cpf: z.string().transform(val => val.replace(/\D/g, '')).refine((val) => val.length === 11 && isValidCPF(val), "CPF inválido."),
  email: z.string().email("Digite um e-mail válido"),
  phone: z.string().regex(phoneRegex, "Celular inválido (use o formato com DDD)"),
  state: z.string().min(1, "Selecione o seu estado"),
  consent: z.boolean().refine((val) => val === true, "Você precisa aceitar os termos."),
}).strip();

export const step3Schema = z.object({
  birthDate: z.string().regex(dateRegex, "Data inválida.").refine((val) => {
      const date = new Date(`${val}T00:00:00`);
      const now = new Date();
      const minDate = new Date("1900-01-01");
      if (isNaN(date.getTime())) return false;
      if (date < minDate) return false;
      if (date > now) return false;
      const age = now.getFullYear() - date.getFullYear();
      if (age < 18) return false; 
      return true;
    }, "Data inválida ou menor de idade."),
  gender: z.string().min(1, "Selecione o sexo."),
  income: z.string().min(1, "Selecione a faixa de renda."),
  profession: z.string().min(1, "Selecione a profissão."),
}).strip();

export const step6Schema = z.object({
  zipCode: z.string().regex(zipRegex, "CEP inválido."),
  street: z.string().min(1, "Logradouro é obrigatório."),
  number: z.string().min(1, "Número é obrigatório."),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório."),
  city: z.string().min(1, "Cidade é obrigatória."),
  state: z.string().min(2, "Estado é obrigatório."),
}).strip();

export const step7Schema = z.object({
  maritalStatus: z.string().min(1, "Selecione o estado civil"),
  company: z.string().min(2, "Informe o nome da instituição/empresa"), 
  rgNumber: z.string().min(5, "RG inválido"),
  rgIssuer: z.string().min(2, "Órgão emissor inválido"),
  rgDate: z.string().refine((date) => !isNaN(new Date(date).getTime()), "Data inválida"),
  childrenCount: z.coerce.number(),
  isPPE: z.boolean(),
  homePhone: z.string().optional(),
}).strip();

// --- BENEFICIÁRIOS ---
const beneficiarySchema = z.object({
  id: z.string(),
  fullName: z.string().min(3, "Nome completo é obrigatório."),
  cpf: z.string().optional().or(z.literal('')), 
  rg: z.string().optional().or(z.literal('')),
  birthDate: z.string().regex(dateRegex, "Data inválida."),
  relationship: z.string().min(1, "Parentesco obrigatório."),
  percentage: z.number({ message: "Informe um número válido" }).min(1).max(100),
  legalRepresentative: z.object({
    fullName: z.string().optional(),
    cpf: z.string().optional(),
    rg: z.string().optional(),
    birthDate: z.string().optional(),
    relationship: z.string().optional(),
  }).strip().optional(),
}).strip();

export const step8Schema = z.object({
  useLegalHeirs: z.boolean().optional(),
  beneficiaries: z.array(beneficiarySchema).optional(),
}).superRefine((data, ctx) => {
  if (!data.useLegalHeirs) {
      if (!data.beneficiaries || data.beneficiaries.length === 0) {
          ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Adicione pelo menos um beneficiário ou selecione a opção 'Herdeiros Legais'.",
              path: ["beneficiaries"]
          });
          return;
      }
      data.beneficiaries.forEach((item, index) => {
        if (!item.birthDate) return;
        const birthDateObj = new Date(`${item.birthDate}T00:00:00`);
        const today = new Date();
        let age = today.getFullYear() - birthDateObj.getFullYear();
        if (today < new Date(today.getFullYear(), birthDateObj.getMonth(), birthDateObj.getDate())) age--;
        
        if (age >= 18) {
            if (!item.cpf || !cpfRegex.test(item.cpf)) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "CPF obrigatório.", path: ["beneficiaries", index, "cpf"] });
            }
        } else {
            const repPath = ["beneficiaries", index, "legalRepresentative"];
            if (!item.legalRepresentative?.fullName) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Responsável obrigatório.", path: [...repPath, "fullName"] });
        }
      });
      const total = data.beneficiaries.reduce((acc, b) => acc + (b.percentage || 0), 0);
      if (Math.abs(total - 100) > 0.1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `A soma das porcentagens é ${total}%. Deve ser 100%.`,
          path: ["beneficiaries"] 
        });
      }
  }
});

// --- PAGAMENTO ---

const creditCardSchema = z.object({
  method: z.literal('CREDIT_CARD'),
  creditCard: z.object({
    number: z.string().transform(v => v.replace(/\D/g, '')),
    holderName: z.string().min(3),
    expirationDate: z.string().min(5),
    cvv: z.string().min(3),
    brand: z.string().optional(),
  }).strip()
}).strip();

// --- ATUALIZAÇÃO: SCHEMA DE DÉBITO COM PAGADOR ---
const payerSchema = z.object({
  isInsuredPayer: z.boolean().default(true),
  payerName: z.string().optional(),
  payerCpf: z.string().optional(),
  payerRelationship: z.string().optional(),
});

const debitSchema = z.object({
  method: z.literal('DEBIT_ACCOUNT'),
  debitAccount: z.object({
    bankCode: z.string().min(1, "Selecione o banco"),
    agency: z.string().min(1, "Agência obrigatória"),
    accountNumber: z.string().min(1, "Conta obrigatória"),
    accountDigit: z.string().min(1, "Dígito obrigatório"),
  }).strip(),
  // Adiciona suporte ao pagador e consentimento
  payer: payerSchema,
  consentDebit: z.boolean().refine(val => val === true, {
    message: "É necessário autorizar o débito em conta."
  }),
})
.superRefine((data, ctx) => {
  // Se não for o titular, exige dados do pagador
  if (!data.payer.isInsuredPayer) {
    if (!data.payer.payerName || data.payer.payerName.trim().length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['payer', 'payerName'],
        message: 'Nome do responsável é obrigatório',
      });
    }
    if (!data.payer.payerCpf || !isValidCPF(data.payer.payerCpf)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['payer', 'payerCpf'],
        message: 'CPF válido do responsável é obrigatório',
      });
    }
    if (!data.payer.payerRelationship) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['payer', 'payerRelationship'],
          message: 'Informe o vínculo.',
        });
    }
  }
});

const payrollSchema = z.object({
  method: z.literal('PAYROLL_DEDUCTION'),
  payroll: z.object({
    registrationNumber: z.string().min(1),
    orgCode: z.string().min(1),
  }).strip()
}).strip();

export const step10Schema = z.discriminatedUnion('method', [creditCardSchema, debitSchema, payrollSchema]);

// Tipos inferidos
export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step6Data = z.infer<typeof step6Schema>;
export type Step7Data = z.infer<typeof step7Schema>;
export type Step8Data = z.infer<typeof step8Schema>;
export type Step10Data = z.infer<typeof step10Schema>;