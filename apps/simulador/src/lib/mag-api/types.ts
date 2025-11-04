// Define os tipos de dados que vêm do frontend
// Baseado no seu useCoverageStore.ts e useSimulatorStore.ts

export interface FrontendCoverage {
  id: string;
  name: string;
  currentCapital: number;
  originalData: {
    productId?: number;
    itemProdutoId?: string;
    id?: string;
    premioBase?: string;
  };
  // Adicione quaisquer outros campos que o processor.ts possa precisar
}

export interface FrontendProduct {
  idProduto: number;
  descricao: string;
  coberturas: Array<{
    itemProdutoId?: string;
    id?: string;
    capitalContratado: number;
    premioCalculado: number;
  }>;
}

export interface FinalSimConfig {
  VL_TOTAL: number;
  produtos: FrontendProduct[];
}

export interface FrontendBeneficiary {
  id: string;
  fullName: string;
  rg: string;
  cpf: string;
  birthDate: string;
  relationship: string;
  // Adicione o legalRepresentative se for usá-lo no payload
}

export interface FrontendFormData {
  [key: string]: any; // Permite acesso dinâmico
  fullName: string;
  cpf: string;
  birthDate: string;
  gender: string;
  income: string;
  state: string;
  profession: string;
  mag_nome_completo?: string; // Campos do PHP podem ser mapeados
  mag_cpf?: string;
  mag_data_nascimento?: string;
  mag_sexo?: string;
  mag_renda?: string;
  mag_estado?: string;
  mag_profissao_cbo?: string;
}

// Define os tipos para os payloads da API MAG
// Baseado no seu class-mag-data-processor.php

export interface MagSimulationPayload {
  simulacoes: Array<{
    proponente: {
      tipoRelacaoSeguradoId: number;
      nome: string;
      cpf: string;
      dataNascimento: string;
      profissaoCbo: string;
      renda: number;
      sexoId: number;
      uf: string;
      declaracaoIRId: number;
    };
    periodicidadeCobrancaId: number;
    prazoCerto: number;
    prazoPagamentoAntecipado: number;
    prazoDecrescimo: number;
  }>;
}

// (Você pode expandir isso para o payload da proposta também)