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

  // --- ADICIONADO: Campos obrigatórios para o processamento ---
  final_simulation_config: string; // Resolvido o erro do JSON.parse
  payment?: Record<string, any>;   // Tipagem para o objeto de pagamento
  
  // Campos opcionais
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
  
  // Campos que agora vêm de slices separados, mas a API espera neste formato flat
  payment_pre_auth_code?: string;
  reserved_proposal_number?: string;
  widget_answers?: string; 

  // Index Signature para permitir campos dinâmicos (ex: beneficiários) de forma segura
  [key: string]: string | number | boolean | undefined | Record<string, unknown> | unknown[];
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

// --- ENUMS DE TIPAGEM DO QUESTIONÁRIO ---

export enum MagTipoItem {
  PERGUNTA = 1,
  AGRUPADOR = 2,
  INFORMATIVO = 3
}

export enum MagTipoResposta {
  SIM_NAO = 1,
  TEXTO_LIVRE = 2,
  VALOR = 3,
  DOMINIO = 4,
  NAO_INFORMADO = 5,
  DATA = 6
}

export enum MagTipoVariacao {
  // Para Domínio (Id 4)
  SELECAO_UNICA = 1,
  MULTI_SELECAO = 2,
  
  // Para Informativo/Geral
  NAO_INFORMADO = 3,
  
  // Para Perguntas/Texto
  DIGITACAO_COMUM = 4,
  
  // Para Data
  DATA_PADRAO = 6,
  
  // Para Valor (Id 3)
  DIGITACAO_NUMERO_TEXTO = 4, // Ex: "1" ou "um"
  DIGITACAO_PESO = 10,        // Ex: "80" (Inteiro)
  DIGITACAO_ALTURA = 11       // Ex: "1,80" (Decimal com vírgula)
}

// Interface atualizada da Pergunta
export interface MagQuestion {
  Id: number;
  Descricao: string;
  TipoItem: { Id: number; Sigla: string };
  TipoResposta: { Id: number; Sigla: string };
  TipoVariacaoResposta?: { Id: number; Sigla: string };
  Opcoes?: MagOption[];
  Perguntas?: MagQuestion[]; // Filhos de Agrupadores
  Obrigatorio: boolean;
  CodigoInterno?: string;
  Observacao?: string;
}

export interface MagOption {
  Id: number;
  Descricao: string;
  SubItens?: MagQuestion[];
}

// Adicione esta interface para a resposta detalhada da Pergunta
export interface MagQuestionDetailResponse {
  Valor: {
    Id: number;
    Descricao: string;
    TipoResposta: { Id: number; Sigla: string; Descricao: string };
    TipoItem: { Id: number; Sigla: string; Descricao: string };
    TipoVariacaoResposta?: { Id: number; Sigla: string; Descricao: string };
    OrdemApresentacao: number;
    Opcoes: any[]; // Pode refinar se tiver a estrutura de opções
    CodigoItem?: number;
    Status: { Id: number; Sigla: string; Descricao: string };
    DataCriacao: string;
    DataAtualizacao: string;
    Observacao?: string;
    Obrigatorio: boolean;
    Identificador?: string;
    CodigoInterno?: string;
  };
  Mensagens: any[];
  HouveErrosDuranteProcessamento: boolean;
}

export interface MagDomainResponse {
  Valor: {
    Nome: string;
    Url: string;
  }[];
  Mensagens: any[];
  HouveErrosDuranteProcessamento: boolean;
  CondicaoFalha: number;
}