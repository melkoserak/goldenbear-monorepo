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
});

// --- Passo 7: Perfil Detalhado ---
export const step7Schema = z.object({
  maritalStatus: z.string().min(1, "Estado civil é obrigatório."),
  homePhone: z.string().optional(), // Opcional
  rgNumber: z.string().min(1, "O número do RG é obrigatório."),
  rgIssuer: z.string().min(1, "O órgão emissor é obrigatório."),
  rgDate: z.string().regex(dateRegex, "Data de emissão inválida."),
  childrenCount: z.string().min(1, "Informe o nº de filhos (coloque 0 se nenhum)."),
  company: z.string().min(1, "A Empresa/Instituição é obrigatória."),
  // --- CORREÇÃO DO ERRO TS2769 ---
  // Removemos 'errorMap' e usamos 'message' que é aceito pela definição de tipo do ZodEnum
  isPPE: z.enum(["true", "false"], {
    message: "Este campo é obrigatório. Selecione Sim ou Não.",
  }),
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

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step6Data = z.infer<typeof step6Schema>;
export type Step7Data = z.infer<typeof step7Schema>;
export type Step8Data = z.infer<typeof step8Schema>;