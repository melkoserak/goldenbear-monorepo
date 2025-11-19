// apps/simulador/src/lib/mag-api/types.ts

// --- Tipos do Frontend (Nossos dados) ---

export interface FrontendBeneficiary {
  id: string;
  fullName: string;
  rg: string;
  cpf: string;
  birthDate: string;
  relationship: string;
  legalRepresentative?: {
    fullName?: string;
    cpf?: string;
    rg?: string;
    birthDate?: string;
    relationship?: string;
  };
}

// O payload que vem do Zod (já validado)
export interface FrontendFormData {
  mag_nome_completo: string;
  mag_cpf: string;
  mag_data_nascimento: string;
  mag_sexo: string;
  mag_renda: string;
  mag_estado: string;
  mag_profissao_cbo: string;
  // Campos opcionais que podem vir no payload da proposta
  mag_email?: string;
  mag_celular?: string;
  mag_cep?: string;
  mag_logradouro?: string;
  mag_numero?: string;
  mag_complemento?: string;
  mag_bairro?: string;
  mag_cidade?: string;
  mag_estado_civil?: string;
  mag_tel_residencial?: string;
  mag_rg_num?: string;
  mag_rg_orgao?: string;
  mag_rg_data?: string;
  mag_num_filhos?: string;
  mag_profissao_empresa?: string;
  mag_ppe?: string;
  payment_pre_auth_code?: string;
  reserved_proposal_number?: string;
  widget_answers?: string; // JSON string
  // Campos dinâmicos de beneficiários (serão processados manualmente)
  [key: string]: any; 
}

export interface FrontendCoverage {
  itemProdutoId?: string;
  id?: string;
  descricao?: string;
  capitalContratado: number;
  premioCalculado: number;
}

export interface FrontendProduct {
  idProduto: number;
  descricao: string;
  coberturas: FrontendCoverage[];
}

export interface FinalSimConfig {
  VL_TOTAL: number;
  produtos: FrontendProduct[];
}

// --- Tipos da API MAG (O que enviamos) ---

export interface MagProponente {
  tipoRelacaoSeguradoId: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
  profissaoCbo: string;
  renda: number;
  sexoId: number;
  uf: string;
  declaracaoIRId: number;
}

export interface MagSimulationPayload {
  simulacoes: Array<{
    proponente: MagProponente;
    periodicidadeCobrancaId: number;
    prazoCerto: number;
    prazoPagamentoAntecipado: number;
    prazoDecrescimo: number;
  }>;
}

// Payload complexo da Proposta
export interface MagProposalPayload {
  PROPOSTA: {
    NUMERO: number;
    DT_PROTOCOLO: string;
    DT_ASSINATURA: string;
    DT_INDEXACAO: string;
    DADOS_PROPONENTE: {
      MATRICULA: number;
      NOME: string;
      DT_NASCIMENTO: string;
      IDADE: number;
      SEXO: string;
      ESTADO_CIVIL: string;
      CPF: string;
      TITULAR_CPF: boolean;
      RECEBE_INFO_EMAIL: boolean;
      EMAIL?: string;
      RESIDE_BRASIL: boolean;
      RENDA_MENSAL: number;
      NUM_FILHOS: number;
      PPE: boolean;
      DOCUMENTOS: { DOCUMENTO: Array<any> };
      ENDERECOS: { TP_CORRESPONDENCIA: string; ENDERECO: Array<any> };
      TELEFONES: { TELEFONE: Array<any> };
      PROFISSAO: {
        CODIGO: string;
        DESCRICAO: string;
        CATEGORIA: string;
        EMPRESA: { NOME: string } | null;
      };
    };
    PLANOS: {
      VL_TOTAL: number;
      PLANO: Array<any>;
    };
    BENEFICIARIOS: {
      BENEFICIARIO: Array<any>;
    };
    DADOS_COBRANCA: any;
    USO_MONGERAL: {
      CONV_ADESAO: string;
      ACAO_MARKETING: string;
      ALTERNATIVA: number;
      SUCURSAL: string;
      DIR_REGIONAL: number;
      GER_SUCURSAL: number;
      GER_COMERCIAL: number;
      AGENTE: number;
      CORRETOR1: number;
      CORRETOR2: number;
      AGENTE_FIDELIZACAO: number;
      MODELO_PROPOSTA: string;
      MODELO_PROPOSTA_GED: string;
      TIPO_COMISSAO: number;
    };
  };
}