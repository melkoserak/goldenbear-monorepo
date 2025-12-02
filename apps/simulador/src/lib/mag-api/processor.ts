import {
  FrontendFormData,
  FinalSimConfig,
  MagSimulationPayload,
  MagProposalPayload
} from './types';

// Função auxiliar para converter MM/YY para YYYY-MM-DD (Mantida)
function convertCardDate(mmAa: string | undefined): string {
    if (!mmAa || !mmAa.includes('/')) return '2030-01-01';
    const [mes, ano] = mmAa.split('/');
    return `20${ano}-${mes}-01`;
}

export function prepareSimulationPayload(
  data: FrontendFormData
): MagSimulationPayload {
  const nome = data.mag_nome_completo;
  const cpf = (data.mag_cpf || '').replace(/\D/g, '');
  const data_nasc = data.mag_data_nascimento;
  const sexo = data.mag_sexo;
  const renda = parseFloat(String(data.mag_renda || '0'));
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

export function prepareProposalPayload(
  postData: FrontendFormData,
  finalSimConfig: FinalSimConfig
): MagProposalPayload {
  
  const birthDate = new Date(`${postData.mag_data_nascimento}T00:00:00`);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  const profissao_cbo = postData.mag_profissao_cbo;
  const profissao_desc = 'Profissão Declarada'; 

  const documentos = buildDocumentsArray(postData);
  const telefones = buildPhonesArray(postData);
  const planos = buildPlansArray(finalSimConfig);
  
  const primeiro_plano_id = planos.length > 0 ? planos[0].CODIGO : '0';
  const beneficiarios = buildBeneficiariesArray(postData, primeiro_plano_id);
  
  // CHAMADA DA FUNÇÃO CORRIGIDA
  const dados_cobranca = buildPaymentData(postData);
  
  const matricula = parseInt(process.env.NEXT_PUBLIC_MAG_MATRICULA || '0', 10);
  const numFilhos = parseInt(String(postData.mag_num_filhos || '0'), 10);
  const rendaMensal = parseFloat(String(postData.mag_renda || '0'));
  const cep = parseInt((postData.mag_cep || '').replace(/\D/g, ''), 10);

  return {
    PROPOSTA: {
      NUMERO: 0, 
      DT_PROTOCOLO: new Date().toISOString().split('T')[0],
      DT_ASSINATURA: new Date().toISOString().split('T')[0],
      DT_INDEXACAO: new Date().toISOString().split('T')[0],
      DADOS_PROPONENTE: {
        MATRICULA: matricula,
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
        RENDA_MENSAL: rendaMensal,
        NUM_FILHOS: numFilhos,
        PPE: String(postData.mag_ppe) === 'true',
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
              CEP: cep,
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
          CODIGO: parseInt(cobertura.itemProdutoId || (cobertura.id as string) || '0', 10),
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
  
  for (let i = 0; i < 5; i++) {
    const nomeKey = `mag_ben[${i}][nome]`;
    const nascKey = `mag_ben[${i}][nasc]`;
    const parentKey = `mag_ben[${i}][parentesco]`;
    
    if (data[nomeKey]) {
        const parentescoStr = String(data[parentKey] || 'OUTROS').toUpperCase();

        beneficiaries.push({
            CD_PLANO: primeiro_plano_id,
            NOME: data[nomeKey],
            NASCIMENTO: data[nascKey],
            PARENTESCO: parentescoStr,
            PARTICIPACAO: 0, 
        });
    }
  }

  if (beneficiaries.length > 0) {
    const participation = parseFloat((100 / beneficiaries.length).toFixed(2));
    beneficiaries.forEach((b, idx) => {
        if (idx === beneficiaries.length - 1) {
             b.PARTICIPACAO = parseFloat((100 - (participation * (beneficiaries.length - 1))).toFixed(2));
        } else {
             b.PARTICIPACAO = participation;
        }
    });
  }
  
  return beneficiaries;
}

// --- FUNÇÃO DE PAGAMENTO CORRIGIDA ---
function buildPaymentData(data: FrontendFormData): any {
  const payment = data.payment as any;
  
  if (!payment || !payment.method) return {};

  // Geração da Competência (Mês/Ano atual) para passar no Regex
  const today = new Date();
  const mes = String(today.getMonth() + 1).padStart(2, '0');
  const ano = today.getFullYear();
  const compDebito = `${mes}/${ano}`;

  const baseData = {
    PERIODICIDADE: 'MENSAL',
    DIA_VENCIMENTO: 10,
    COMP_DEBITO: compDebito, 
    NUM_CONVENIO: '0'
  };

  // 1. Cartão de Crédito
  if (payment.method === 'CREDIT_CARD' && payment.creditCard) {
    return {
      ...baseData,
      TIPO_COBRANCA: 'CARTAO', 
      CARTAO: {
        NUMERO: payment.creditCard.number.replace(/\s/g, ''),
        VALIDADE: convertCardDate(payment.creditCard.expirationDate),
        BANDEIRA: (payment.creditCard.brand || 'VISA').toUpperCase(),
        PARCELA: 1,
        // --- CORREÇÃO AQUI: Campo obrigatório pela API, mesmo sem widget ---
        NUM_PRE_AUTORIZACAO: 0, 
        PORTADOR: {
          NOME: payment.creditCard.holderName.toUpperCase(),
          TIPO_PESSOA: "FISICA",
          DOCUMENTO: (data.mag_cpf || '').replace(/\D/g, '')
        }
      }
    };
  }

  // 2. Débito em Conta
  if (payment.method === 'DEBIT_ACCOUNT' && payment.debitAccount) {
    return {
      ...baseData,
      TIPO_COBRANCA: 'DEBITO', 
      CONTA_CORRENTE: {
        BANCO: payment.debitAccount.bankCode,
        AGENCIA: payment.debitAccount.agency,
        CONTA: payment.debitAccount.accountNumber,
        DIGITO_CONTA: payment.debitAccount.accountDigit
      }
    };
  }

  // 3. Desconto em Folha
  if (payment.method === 'PAYROLL_DEDUCTION' && payment.payroll) {
    return {
      ...baseData,
      TIPO_COBRANCA: 'FOLHA', 
      CONSIGNACAO: {
        MATRICULA: payment.payroll.registrationNumber,
        ORGAO: payment.payroll.orgCode
      }
    };
  }

  return {};
}