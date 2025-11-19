// apps/simulador/src/lib/mag-api/processor.ts
import {
  FrontendFormData,
  FinalSimConfig,
  MagSimulationPayload,
  MagProposalPayload
} from './types';

/**
 * Prepara o payload para a API de Simulação da MAG.
 */
export function prepareSimulationPayload(
  data: FrontendFormData
): MagSimulationPayload {
  const nome = data.mag_nome_completo;
  const cpf = (data.mag_cpf || '').replace(/\D/g, '');
  const data_nasc = data.mag_data_nascimento;
  const sexo = data.mag_sexo;
  const renda = parseFloat(data.mag_renda || '0');
  const estado = (data.mag_estado || '').toUpperCase();
  const profissao_cbo = data.mag_profissao_cbo;

  return {
    simulacoes: [
      {
        proponente: {
          tipoRelacaoSeguradoId: 1,
          nome: nome,
          cpf: cpf,
          dataNascimento: data_nasc,
          profissaoCbo: profissao_cbo,
          renda: renda,
          sexoId: sexo === 'masculino' ? 1 : 2,
          uf: estado,
          declaracaoIRId: 1,
        },
        periodicidadeCobrancaId: 30,
        prazoCerto: 30,
        prazoPagamentoAntecipado: 10,
        prazoDecrescimo: 10,
      },
    ],
  };
}

/**
 * Prepara o payload completo para a API de Proposta da MAG.
 */
export function prepareProposalPayload(
  postData: FrontendFormData,
  finalSimConfig: FinalSimConfig
): MagProposalPayload {
  
  // Cálculos auxiliares
  const birthDate = new Date(`${postData.mag_data_nascimento}T00:00:00`);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  const profissao_cbo = postData.mag_profissao_cbo;
  // Nota: Idealmente buscaríamos a descrição da profissão via CBO
  const profissao_desc = 'Profissão Declarada'; 

  const documentos = buildDocumentsArray(postData);
  const telefones = buildPhonesArray(postData);
  const planos = buildPlansArray(finalSimConfig);
  
  // Pega o ID do primeiro plano para associar aos beneficiários
  const primeiro_plano_id = planos.length > 0 ? planos[0].CODIGO : '0';
  const beneficiarios = buildBeneficiariesArray(postData, primeiro_plano_id);
  
  const dados_cobranca = buildPaymentData(postData);
  
  // Montagem do Payload Estrito
  return {
    PROPOSTA: {
      NUMERO: 0, // Será gerado pela MAG ou substituído se tiver reserva
      DT_PROTOCOLO: new Date().toISOString().split('T')[0],
      DT_ASSINATURA: new Date().toISOString().split('T')[0],
      DT_INDEXACAO: new Date().toISOString().split('T')[0],
      DADOS_PROPONENTE: {
        MATRICULA: parseInt(process.env.NEXT_PUBLIC_MAG_MATRICULA || '0', 10),
        NOME: postData.mag_nome_completo,
        DT_NASCIMENTO: postData.mag_data_nascimento,
        IDADE: age,
        SEXO: (postData.mag_sexo || '').toUpperCase(),
        ESTADO_CIVIL: (postData.mag_estado_civil || 'SOLTEIRO').toUpperCase(),
        CPF: (postData.mag_cpf || '').replace(/\D/g, ''),
        TITULAR_CPF: true,
        RECEBE_INFO_EMAIL: !!postData.mag_email,
        EMAIL: postData.mag_email,
        RESIDE_BRASIL: true,
        RENDA_MENSAL: parseFloat(postData.mag_renda || '0'),
        NUM_FILHOS: parseInt(postData.mag_num_filhos || '0', 10),
        PPE: postData.mag_ppe === 'true',
        DOCUMENTOS: { DOCUMENTO: documentos },
        ENDERECOS: {
          TP_CORRESPONDENCIA: 'RESIDENCIAL',
          ENDERECO: [
            {
              TIPO: 'RESIDENCIAL',
              LOGRADOURO: postData.mag_logradouro || '',
              NUMERO: postData.mag_numero || '',
              COMPLEMENTO: postData.mag_complemento || '',
              BAIRRO: postData.mag_bairro || '',
              CIDADE: postData.mag_cidade || '',
              ESTADO: (postData.mag_estado || '').toUpperCase(),
              CEP: parseInt((postData.mag_cep || '').replace(/\D/g, ''), 10),
            },
          ],
        },
        TELEFONES: { TELEFONE: telefones },
        PROFISSAO: {
          CODIGO: profissao_cbo,
          DESCRICAO: profissao_desc.toUpperCase(),
          CATEGORIA: 'EMPREGADO',
          EMPRESA: postData.mag_profissao_empresa ? { NOME: postData.mag_profissao_empresa } : null,
        },
      },
      PLANOS: {
        VL_TOTAL: finalSimConfig.VL_TOTAL || 0.0,
        PLANO: planos,
      },
      BENEFICIARIOS: {
        BENEFICIARIO: beneficiarios,
      },
      DADOS_COBRANCA: dados_cobranca,
      USO_MONGERAL: {
        CONV_ADESAO: process.env.NEXT_PUBLIC_MAG_CONV_ADESAO || 'AD0000',
        ACAO_MARKETING: process.env.NEXT_PUBLIC_MAG_ACAO_MARKETING || 'AM0000',
        ALTERNATIVA: parseInt(process.env.NEXT_PUBLIC_MAG_ALTERNATIVA || '1', 10),
        SUCURSAL: process.env.NEXT_PUBLIC_MAG_SUCURSAL || 'F24',
        DIR_REGIONAL: 0,
        GER_SUCURSAL: 0,
        GER_COMERCIAL: 0,
        AGENTE: 0,
        CORRETOR1: parseInt(process.env.NEXT_PUBLIC_MAG_CORRETOR1 || '19020399', 10),
        CORRETOR2: 0,
        AGENTE_FIDELIZACAO: 0,
        MODELO_PROPOSTA: process.env.MAG_MODELO_PROPOSTA || 'EIS',
        MODELO_PROPOSTA_GED: process.env.MAG_MODELO_PROPOSTA || 'EIS',
        TIPO_COMISSAO: parseInt(process.env.NEXT_PUBLIC_MAG_TIPO_COMISSAO || '1', 10),
      },
    },
  };
}

// --- Funções Auxiliares (Privadas) ---

function buildDocumentsArray(data: FrontendFormData) {
  const docs = [];
  if (data.mag_rg_num) {
    docs.push({
      NATUREZA_DOC: 'RG',
      DOCUMENTO: data.mag_rg_num,
      ORGAO_EXPEDIDOR: data.mag_rg_orgao || 'SSP',
      DATA_EXPEDICAO: data.mag_rg_data || '',
    });
  }
  return docs;
}

function buildPhonesArray(data: FrontendFormData) {
  const phones = [];
  
  if (data.mag_celular) {
    const cleanPhone = data.mag_celular.replace(/\D/g, '');
    if (cleanPhone.length >= 10) {
       phones.push({
        TIPO: 'CELULAR',
        DDI: 55,
        DDD: parseInt(cleanPhone.substring(0, 2), 10),
        NUMERO: parseInt(cleanPhone.substring(2), 10),
      });
    }
  }
  
  if (data.mag_tel_residencial) {
    const cleanHome = data.mag_tel_residencial.replace(/\D/g, '');
    if (cleanHome.length >= 10) {
      phones.push({
        TIPO: 'RESIDENCIAL',
        DDI: 55,
        DDD: parseInt(cleanHome.substring(0, 2), 10),
        NUMERO: parseInt(cleanHome.substring(2), 10),
      });
    }
  }
  return phones;
}

function buildPlansArray(config: FinalSimConfig) {
  const plans: any[] = [];
  
  if (config.produtos && Array.isArray(config.produtos)) {
    config.produtos.forEach((produto) => {
      const coberturas: any[] = [];
      
      produto.coberturas.forEach((cobertura) => {
        coberturas.push({
          CODIGO: parseInt(cobertura.itemProdutoId || cobertura.id || '0', 10),
          VL_CONTRIB: cobertura.premioCalculado || 0.0,
          VL_COBERTURA: cobertura.capitalContratado || 0.0,
        });
      });

      if (coberturas.length > 0) {
        let nome_plano = produto.descricao || 'Plano';
        if (nome_plano.length > 50) {
          nome_plano = nome_plano.substring(0, 50);
        }
        
        plans.push({
          CODIGO: String(produto.idProduto),
          NOME: nome_plano,
          VL_AP_INICIAL: 0.0,
          VL_PORTAB: 0.0,
          TP_TRIBUTACAO: 'NENHUM',
          DT_CONCESSAO: '1900-01-01',
          PRAZO_CERTO: 0,
          PRAZO_DECRESCIMO: 0,
          COBERTURAS: { COBERTURA: coberturas },
        });
      }
    });
  }
  return plans;
}

function buildBeneficiariesArray(data: FrontendFormData, primeiro_plano_id: string) {
  const beneficiaries: any[] = [];
  
  // Como os beneficiários vêm de chaves dinâmicas mag_ben[0][nome], etc.
  // Precisamos extrair manualmente se o frontend não enviar um array estruturado.
  // Neste caso, assumimos que o frontend (Step11) enviou chaves dinâmicas.
  
  // Uma abordagem mais segura seria o frontend enviar um array JSON stringificado em 'beneficiaries_json',
  // mas vamos manter a lógica de extração baseada em índices para compatibilidade.
  
  // Exemplo de extração simples (limitado a 5 beneficiários por segurança)
  for (let i = 0; i < 5; i++) {
    const nomeKey = `mag_ben[${i}][nome]`;
    const nascKey = `mag_ben[${i}][nasc]`;
    const parentKey = `mag_ben[${i}][parentesco]`;
    
    if (data[nomeKey]) {
        beneficiaries.push({
            CD_PLANO: primeiro_plano_id,
            NOME: data[nomeKey],
            NASCIMENTO: data[nascKey],
            PARENTESCO: (data[parentKey] || 'OUTROS').toUpperCase(),
            PARTICIPACAO: 0, // Será calculado abaixo
        });
    }
  }

  // Distribui a participação igualmente
  if (beneficiaries.length > 0) {
    const participation = parseFloat((100 / beneficiaries.length).toFixed(2));
    beneficiaries.forEach((b, idx) => {
        // Ajuste no último para fechar 100%
        if (idx === beneficiaries.length - 1) {
             b.PARTICIPACAO = parseFloat((100 - (participation * (beneficiaries.length - 1))).toFixed(2));
        } else {
             b.PARTICIPACAO = participation;
        }
    });
  }
  
  return beneficiaries;
}

function buildPaymentData(data: FrontendFormData): any {
  const preAuthCode = data.payment_pre_auth_code;
  
  if (preAuthCode) {
    return {
      PERIODICIDADE: 'MENSAL',
      TIPO_COBRANCA: 'CREDITO',
      DIA_VENCIMENTO: 10, // Pode ser parametrizado
      COMP_DEBITO: new Date().toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' }),
      NUM_CONVENIO: '0',
      CARTAO: {
        NUMERO: '', // Tokenizado
        VALIDADE: '1990-01-01',
        NUM_PRE_AUTORIZACAO: preAuthCode,
        BANDEIRA: '',
        PARCELA: 1,
        PORTADOR: {
          NOME: data.mag_nome_completo,
          TIPO_PESSOA: 'F',
          DOCUMENTO: (data.mag_cpf || '').replace(/\D/g, ''),
        },
      },
    };
  }
  
  // Caso não tenha código de pré-autorização (ex: débito), retorna vazio ou lança erro
  return {}; 
}