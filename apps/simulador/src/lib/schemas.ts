import { z } from 'zod';

// Regex auxiliares
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/; // Celular com 9 dígitos e DDD
const zipRegex = /^\d{5}-\d{3}$/; // CEP
const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Formato YYYY-MM-DD do input date

// --- Passos 1 e 2 (Já implementados) ---
export const step1Schema = z.object({
  fullName: z.string()
    .min(1, "O nome é obrigatório")
    .refine((val) => val.trim().split(' ').length >= 2, "Por favor, digite seu nome e sobrenome."),
});

export const step2Schema = z.object({
  cpf: z.string()
    .min(1, "O CPF é obrigatório")
    .regex(cpfRegex, "CPF inválido (use o formato 000.000.000-00)"),
  email: z.string()
    .min(1, "O e-mail é obrigatório")
    .email("Digite um e-mail válido"),
  phone: z.string()
    .min(1, "O celular é obrigatório")
    .regex(phoneRegex, "Celular inválido (use o formato (XX) XXXXX-XXXX)"),
  state: z.string()
    .min(1, "Selecione o seu estado"),
  consent: z.boolean().refine((val) => val === true, {
    message: "Você precisa aceitar os termos para continuar.",
  }),
});

// --- Passo 3: Detalhes Pessoais ---
export const step3Schema = z.object({
  birthDate: z.string().regex(dateRegex, "Data de nascimento inválida."),
  gender: z.string().min(1, "Selecione o sexo."),
  income: z.string().min(1, "Selecione a faixa de renda."),
  profession: z.string().min(1, "Selecione a profissão."),
});

// --- Passo 6: Endereço ---
export const step6Schema = z.object({
  zipCode: z.string()
    .min(1, "O CEP é obrigatório")
    .regex(zipRegex, "CEP inválido (formato 00000-000)."),
  street: z.string().min(1, "Logradouro é obrigatório."),
  number: z.string().min(1, "Número é obrigatório."),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório."),
  city: z.string().min(1, "Cidade é obrigatória."),
  state: z.string().min(2, "Estado é obrigatório."), // Geralmente vem preenchido pela API
  maritalStatus: z.string().min(1, "Selecione o estado civil"),
});

// --- Passo 7: Perfil Detalhado ---
export const step7Schema = z.object({
  rgNumber: z.string().min(5, "RG inválido"),
  rgIssuer: z.string().min(2, "Órgão emissor inválido"),
  rgDate: z.string().refine((date) => {
    if (!date) return false;
    const d = new Date(date);
    return !isNaN(d.getTime()) && d < new Date();
  }, "Data de expedição inválida"),
  
  // --- CORREÇÃO: number e boolean ---
  childrenCount: z.coerce.number().min(0, "Número inválido"), // aceita "0" string e converte para 0 number
  isPPE: z.boolean(), // aceita true/false direto
  
  company: z.string().optional(),
  homePhone: z.string().optional(),
});

// --- Passo 8: Beneficiários ---
// Schema para um único beneficiário
const beneficiarySchema = z.object({
  id: z.string(),
  fullName: z.string().min(3, "Nome completo é obrigatório."),
  cpf: z.string().regex(cpfRegex, "CPF inválido."),
  rg: z.string().min(1, "RG obrigatório."),
  birthDate: z.string().regex(dateRegex, "Data de nascimento inválida."),
  relationship: z.string().min(1, "Grau de parentesco obrigatório."),
  // O representante legal é validado condicionalmente no superRefine abaixo, 
  // mas definimos a estrutura aqui.
  legalRepresentative: z.object({
    fullName: z.string().optional(),
    cpf: z.string().optional(),
    rg: z.string().optional(),
    birthDate: z.string().optional(),
    relationship: z.string().optional(),
  }).optional(),
});

export const step8Schema = z.object({
  beneficiaries: z.array(beneficiarySchema)
    .min(1, "Adicione pelo menos um beneficiário.")
    // Validação customizada para verificar menores de idade e exigir Responsável Legal
    .superRefine((items, ctx) => {
      items.forEach((item, index) => {
        if (!item.birthDate) return;
        
        const birthDateObj = new Date(`${item.birthDate}T00:00:00`);
        // Se data inválida, o regex do campo birthDate já pegou, então ignoramos aqui
        if (isNaN(birthDateObj.getTime())) return;

        const today = new Date();
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const m = today.getMonth() - birthDateObj.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
          age--;
        }

        // Se for menor de 18 anos
        if (age < 18) {
          // Valida Nome do Responsável
          if (!item.legalRepresentative?.fullName || item.legalRepresentative.fullName.trim().length < 3) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Responsável legal obrigatório para menor de idade.",
              path: [index, "legalRepresentative", "fullName"],
            });
          }
          // Valida CPF do Responsável
          if (!item.legalRepresentative?.cpf || !cpfRegex.test(item.legalRepresentative.cpf)) {
             ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "CPF do responsável obrigatório/inválido.",
              path: [index, "legalRepresentative", "cpf"],
            });
          }
          // Valida RG do Responsável
           if (!item.legalRepresentative?.rg || item.legalRepresentative.rg.trim().length < 1) {
             ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "RG do responsável obrigatório.",
              path: [index, "legalRepresentative", "rg"],
            });
          }
        }
      });
    }),
});

// Função auxiliar: Algoritmo de Luhn para validar cartão
const isValidLuhn = (val: string) => {
  let checksum = 0;
  let j = 1;
  for (let i = val.length - 1; i >= 0; i--) {
    let calc = 0;
    calc = Number(val.charAt(i)) * j;
    if (calc > 9) {
      checksum = checksum + 1;
      calc = calc - 10;
    }
    checksum = checksum + calc;
    if (j == 1) { j = 2 } else { j = 1 };
  }
  return (checksum % 10) == 0;
};

// Schema Cartão de Crédito
const creditCardSchema = z.object({
  method: z.literal('CREDIT_CARD'),
  creditCard: z.object({
    number: z.string()
      .transform(v => v.replace(/\D/g, ''))
      .refine(v => v.length >= 13 && v.length <= 19, "Número de cartão inválido")
      .refine(isValidLuhn, "Número de cartão inválido (Luhn)"),
    holderName: z.string().min(3, "Nome impresso obrigatório").toUpperCase(),
    expirationDate: z.string()
      .refine(v => {
        const [month, year] = v.split('/').map(Number);
        if (!month || !year) return false;
        const expiry = new Date(2000 + year, month - 1); // Assume ano 20xx
        return expiry > new Date();
      }, "Data inválida ou expirada"),
    cvv: z.string().min(3, "CVV inválido").max(4),
    brand: z.string().optional(), // Pode ser inferido
  })
});

// Schema Débito em Conta
const debitSchema = z.object({
  method: z.literal('DEBIT_ACCOUNT'),
  debitAccount: z.object({
    bankCode: z.string().min(1, "Selecione o banco"),
    agency: z.string().min(1, "Agência obrigatória"),
    accountNumber: z.string().min(1, "Conta obrigatória"),
    accountDigit: z.string().min(1, "Dígito obrigatório"),
  })
});

// Schema Desconto em Folha
const payrollSchema = z.object({
  method: z.literal('PAYROLL_DEDUCTION'),
  payroll: z.object({
    registrationNumber: z.string().min(1, "Matrícula obrigatória"),
    orgCode: z.string().min(1, "Órgão obrigatório"),
  })
});

// Schema Unificado do Passo 10
export const step10Schema = z.discriminatedUnion('method', [
  creditCardSchema,
  debitSchema,
  payrollSchema
]);

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step6Data = z.infer<typeof step6Schema>;
export type Step7Data = z.infer<typeof step7Schema>;
export type Step8Data = z.infer<typeof step8Schema>;
export type Step10Data = z.infer<typeof step10Schema>;