import { z } from 'zod';

// --- REGEX AUXILIARES ---
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/; 
const zipRegex = /^\d{5}-\d{3}$/; 
const dateRegex = /^\d{4}-\d{2}-\d{2}$/; 

// --- FUNÇÃO AUXILIAR: ALGORITMO DE LUHN ---
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

// --- SCHEMAS ---

export const step1Schema = z.object({
  fullName: z.string().min(1, "O nome é obrigatório").refine((val) => val.trim().split(' ').length >= 2, "Digite seu nome e sobrenome."),
});

export const step2Schema = z.object({
  cpf: z.string().min(1, "O CPF é obrigatório").regex(cpfRegex, "CPF inválido"),
  email: z.string().min(1, "O e-mail é obrigatório").email("Digite um e-mail válido"),
  phone: z.string().min(1, "O celular é obrigatório").regex(phoneRegex, "Celular inválido"),
  state: z.string().min(1, "Selecione o seu estado"),
  consent: z.boolean().refine((val) => val === true, { message: "Você precisa aceitar os termos." }),
});

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
});

export const step6Schema = z.object({
  zipCode: z.string().min(1, "O CEP é obrigatório").regex(zipRegex, "CEP inválido."),
  street: z.string().min(1, "Logradouro é obrigatório."),
  number: z.string().min(1, "Número é obrigatório."),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório."),
  city: z.string().min(1, "Cidade é obrigatória."),
  state: z.string().min(2, "Estado é obrigatório."),
});

// --- PASSO 7: PERFIL DETALHADO (ATUALIZADO) ---
export const step7Schema = z.object({
  maritalStatus: z.string().min(1, "Selecione o estado civil"),
  company: z.string().min(2, "Informe o nome da instituição/empresa"), 
  rgNumber: z.string().min(5, "RG inválido"),
  rgIssuer: z.string().min(2, "Órgão emissor inválido"),
  rgDate: z.string().refine((date) => {
    if (!date) return false;
    const d = new Date(date);
    return !isNaN(d.getTime()) && d < new Date();
  }, "Data de expedição inválida"),
  
  // CORREÇÃO AQUI: Removido o objeto de opções que causava erro
  childrenCount: z.coerce.number().min(0, "Informe 0 se não tiver filhos"),
  
  isPPE: z.boolean(),
  homePhone: z.string().optional(),
});

// --- BENEFICIÁRIOS E PAGAMENTO ---
const beneficiarySchema = z.object({
  id: z.string(),
  fullName: z.string().min(3, "Nome completo é obrigatório."),
  cpf: z.string().optional().or(z.literal('')), 
  rg: z.string().optional().or(z.literal('')),
  birthDate: z.string().regex(dateRegex, "Data inválida."),
  relationship: z.string().min(1, "Parentesco obrigatório."),
  percentage: z.coerce.number().min(1).max(100),
  legalRepresentative: z.object({
    fullName: z.string().optional(),
    cpf: z.string().optional(),
    rg: z.string().optional(),
    birthDate: z.string().optional(),
    relationship: z.string().optional(),
  }).optional(),
});

export const step8Schema = z.object({
  beneficiaries: z.array(beneficiarySchema).min(1, "Adicione pelo menos um beneficiário.")
    .superRefine((items, ctx) => {
      items.forEach((item, index) => {
        if (!item.birthDate) return;
        const birthDateObj = new Date(`${item.birthDate}T00:00:00`);
        if (isNaN(birthDateObj.getTime())) return;
        const today = new Date();
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const m = today.getMonth() - birthDateObj.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) age--;
        
        // Regra: Maior de 18 exige CPF
        if (age >= 18) {
            if (!item.cpf || !cpfRegex.test(item.cpf)) {
                ctx.addIssue({ 
                    code: z.ZodIssueCode.custom, 
                    message: "CPF obrigatório para maiores de 18 anos.", 
                    path: [index, "cpf"] 
                });
            }
        } else {
            // Regra: Menor de 18 exige Responsável Legal
            const repPath = [index, "legalRepresentative"];
            
            if (!item.legalRepresentative?.fullName || item.legalRepresentative.fullName.trim().length < 3) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Nome do responsável obrigatório.", path: [...repPath, "fullName"] });
            }
            if (!item.legalRepresentative?.cpf || !cpfRegex.test(item.legalRepresentative.cpf || '')) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "CPF do responsável inválido.", path: [...repPath, "cpf"] });
            }
            if (!item.legalRepresentative?.rg || (item.legalRepresentative.rg || '').trim().length < 2) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "RG do responsável obrigatório.", path: [...repPath, "rg"] });
            }
            if (!item.legalRepresentative?.birthDate) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Data de nascimento obrigatória.", path: [...repPath, "birthDate"] });
            }
        }
      });
      
      // Validação de Porcentagem Total
      const total = items.reduce((acc, b) => acc + (b.percentage || 0), 0);
      if (Math.abs(total - 100) > 0.1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `A soma das porcentagens é ${total}%. Deve ser 100%.`,
          path: [] 
        });
      }
    }),
});

const creditCardSchema = z.object({
  method: z.literal('CREDIT_CARD'),
  creditCard: z.object({
    number: z.string().transform(v => v.replace(/\D/g, '')).refine(v => v.length >= 13, "Número inválido").refine(isValidLuhn, "Número inválido"),
    holderName: z.string().min(3, "Nome obrigatório").toUpperCase(),
    expirationDate: z.string().min(5, "Validade inválida"),
    cvv: z.string().min(3, "CVV inválido").max(4),
    brand: z.string().optional(),
  })
});

const debitSchema = z.object({
  method: z.literal('DEBIT_ACCOUNT'),
  debitAccount: z.object({
    bankCode: z.string().min(1, "Selecione o banco"),
    agency: z.string().min(1, "Agência obrigatória"),
    accountNumber: z.string().min(1, "Conta obrigatória"),
    accountDigit: z.string().min(1, "Dígito obrigatório"),
  })
});

const payrollSchema = z.object({
  method: z.literal('PAYROLL_DEDUCTION'),
  payroll: z.object({
    registrationNumber: z.string().min(1, "Matrícula obrigatória"),
    orgCode: z.string().min(1, "Órgão obrigatório"),
  })
});

export const step10Schema = z.discriminatedUnion('method', [creditCardSchema, debitSchema, payrollSchema]);

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step6Data = z.infer<typeof step6Schema>;
export type Step7Data = z.infer<typeof step7Schema>;
export type Step8Data = z.infer<typeof step8Schema>;
export type Step10Data = z.infer<typeof step10Schema>;