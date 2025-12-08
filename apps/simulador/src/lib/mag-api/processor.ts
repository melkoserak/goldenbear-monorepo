// apps/simulador/src/lib/mag-api/processor.ts
import {
  FrontendFormData,
  FinalSimConfig,
  MagSimulationPayload,
  MagProposalPayload
} from './types';

function convertCardDate(mmAa: string | undefined): string {
    if (!mmAa || typeof mmAa !== 'string' || !mmAa.includes('/')) {
        const d = new Date();
        d.setFullYear(d.getFullYear() + 5); 
        return d.toISOString().split('T')[0];
    }
    try {
        const parts = mmAa.split('/');
        if (parts.length !== 2) throw new Error("Formato inválido");
        const mes = parseInt(parts[0], 10);
        let ano = parseInt(parts[1], 10);
        if (isNaN(mes) || isNaN(ano) || mes < 1 || mes > 12) throw new Error("Valores numéricos inválidos");
        if (ano < 100) ano += 2000;
        const dataUltimoDia = new Date(ano, mes, 0);
        const yyyy = dataUltimoDia.getFullYear();
        const mm = String(dataUltimoDia.getMonth() + 1).padStart(2, '0');
        const dd = String(dataUltimoDia.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    } catch (e) {
        return "2030-12-31";
    }
}

export function prepareSimulationPayload(data: FrontendFormData): MagSimulationPayload {
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

export function prepareProposalPayload(postData: FrontendFormData, finalSimConfig: FinalSimConfig): MagProposalPayload {
  const birthDate = new Date(`${postData.mag_data_nascimento}T00:00:00`);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  const profissao_cbo = postData.mag_profissao_cbo;
  const profissao_desc = 'Profissão Declarada'; 
  const nome_empresa = postData.mag_profissao_empresa || 'NÃO INFORMADO';

  const documentos = buildDocumentsArray(postData);
  const telefones = buildPhonesArray(postData);
  const planos = buildPlansArray(finalSimConfig);
  
  const primeiro_plano_id = planos.length > 0 ? planos[0].CODIGO : '0';
  const beneficiarios = buildBeneficiariesArray(postData, primeiro_plano_id);
  
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
        NOME: postData.mag_nome_completo.toUpperCase(),
        DT_NASCIMENTO: postData.mag_data_nascimento,
        IDADE: age,
        SEXO: (postData.mag_sexo || '').toUpperCase(),
        ESTADO_CIVIL: (postData.mag_estado_civil || 'SOLTEIRO').toUpperCase(),
        CPF: (postData.mag_cpf || '').replace(/\D/g, ''),
        TITULAR_CPF: true,
        RECEBE_INFO_EMAIL: !!postData.mag_email,
        EMAIL: postData.mag_email?.toUpperCase(),
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
              LOGRADOURO: (postData.mag_logradouro || '').toUpperCase(),
              NUMERO: postData.mag_numero || '',
              COMPLEMENTO: (postData.mag_complemento || '').toUpperCase(),
              BAIRRO: (postData.mag_bairro || '').toUpperCase(),
              CIDADE: (postData.mag_cidade || '').toUpperCase(),
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
          EMPRESA: { NOME: nome_empresa.toUpperCase() },
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
        CONV_ADESAO: process.env.MAG_USO_CONV_ADESAO || 'AD0000',
        ACAO_MARKETING: process.env.MAG_USO_ACAO_MARKETING || 'AM0000',
        ALTERNATIVA: parseInt(process.env.MAG_USO_ALTERNATIVA || '1', 10),
        SUCURSAL: process.env.MAG_USO_SUCURSAL || 'F24',
        DIR_REGIONAL: parseInt(process.env.MAG_USO_DIR_REGIONAL || '0', 10),
        GER_SUCURSAL: parseInt(process.env.MAG_USO_GER_SUCURSAL || '0', 10),
        GER_COMERCIAL: parseInt(process.env.MAG_USO_GER_COMERCIAL || '0', 10),
        AGENTE: parseInt(process.env.MAG_USO_AGENTE || '0', 10),
        CORRETOR1: parseInt(process.env.MAG_USO_CORRETOR1 || '19020399', 10),
        CORRETOR2: parseInt(process.env.MAG_USO_CORRETOR2 || '0', 10),
        AGENTE_FIDELIZACAO: parseInt(process.env.MAG_USO_AGENTE_FIDELIZACAO || '0', 10),
        MODELO_PROPOSTA: process.env.MAG_USO_MODELO_PROPOSTA || 'EIS',
        MODELO_PROPOSTA_GED: process.env.MAG_USO_MODELO_PROPOSTA_GED || 'EIS',
        TIPO_COMISSAO: parseInt(process.env.MAG_USO_TIPO_COMISSAO || '1', 10),
      },
    },
  };
}

function buildDocumentsArray(data: FrontendFormData) {
  const docs = [];
  if (data.mag_rg_num) {
    docs.push({
      NATUREZA_DOC: 'RG',
      DOCUMENTO: data.mag_rg_num.toUpperCase(),
      ORGAO_EXPEDIDOR: (data.mag_rg_orgao || 'SSP').toUpperCase(),
      DATA_EXPEDICAO: data.mag_rg_data || new Date().toISOString().split('T')[0],
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
        plans.push({
          CODIGO: String(produto.idProduto),
          NOME: (produto.descricao || 'Produto').toUpperCase(),
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

// --- CORREÇÃO: Mapeamento da Porcentagem ---
function buildBeneficiariesArray(data: FrontendFormData, primeiro_plano_id: string | number) {
  const beneficiaries: any[] = [];
  const idPlanoStr = String(primeiro_plano_id);

  // 1. Se o usuário marcou "Herdeiros Legais", enviamos lista vazia [].
  // Isso instrui a seguradora a usar a ordem de vocação hereditária (Código Civil).
  if (data.useLegalHeirs) {
      console.log("[PROCESSOR] Cliente optou por Herdeiros Legais. Enviando lista de beneficiários vazia.");
      
      // OBS: Mantenha este bloco comentado. Se o suporte reclamar que a lista vazia 
      // não funcionou, descomente para enviar um beneficiário explícito.
      /*
      beneficiaries.push({
          NOME: "HERDEIROS LEGAIS",
          NASCIMENTO: "1900-01-01",
          PARENTESCO: "OUTROS",
          PARTICIPACAO: 100,
          CD_PLANO: idPlanoStr
      });
      */
     
      return beneficiaries; 
  }

  // 2. Processamento normal de beneficiários nomeados (Novo Formato Array)
  const sourceList = (data.beneficiaries as any[]) || [];

  if (sourceList.length > 0) {
      sourceList.forEach(ben => {
          // Sanitização de segurança para evitar crash em .toUpperCase()
          const nome = ben.fullName ? String(ben.fullName).toUpperCase() : 'BENEFICIÁRIO';
          const parentesco = ben.relationship ? String(ben.relationship).toUpperCase() : 'OUTROS';
          const rawPercentage = ben.percentage ? String(ben.percentage).replace('%', '') : '0';

          beneficiaries.push({
            NOME: nome,
            NASCIMENTO: ben.birthDate, // Formato YYYY-MM-DD
            PARENTESCO: parentesco,
            PARTICIPACAO: parseFloat(rawPercentage) || 0,
            CD_PLANO: idPlanoStr 
          });
      });
  } else {
      // 3. Fallback Legado (Suporte a campos antigos mag_ben[0]...)
      // Mantemos isso para garantir retrocompatibilidade se algo falhar no frontend novo
      for (let i = 0; i < 5; i++) {
        const nomeKey = `mag_ben[${i}][nome]`;
        if (data[nomeKey]) {
            beneficiaries.push({
                NOME: (data[nomeKey] as string).toUpperCase(),
                NASCIMENTO: data[`mag_ben[${i}][nasc]`],
                PARENTESCO: String(data[`mag_ben[${i}][parentesco]`]).toUpperCase(),
                PARTICIPACAO: 0, // No legado a porcentagem não era capturada granularmente
                CD_PLANO: idPlanoStr
            });
        }
      }
  }
  
  return beneficiaries;
}

function buildPaymentData(data: FrontendFormData): any {
  const payment = data.payment as any;
  if (!payment || !payment.method) return {};

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

  // --- CARTÃO DE CRÉDITO ---
  if (payment.method === 'CREDIT_CARD' && payment.creditCard) {
    return {
      ...baseData,
      TIPO_COBRANCA: 'CARTAO', 
      CARTAO: {
        NUMERO: payment.creditCard.number.replace(/\D/g, ''),
        VALIDADE: convertCardDate(payment.creditCard.expirationDate), 
        BANDEIRA: (payment.creditCard.brand || 'MASTERCARD').toUpperCase(),
        PARCELA: 1,
        NUM_PRE_AUTORIZACAO: 0,
        PORTADOR: {
          NOME: payment.creditCard.holderName.toUpperCase(),
          TIPO_PESSOA: "FISICA",
          // Se for cartão de terceiro, idealmente o form de cartão também deveria capturar o CPF do titular.
          // Aqui mantivemos o CPF do segurado como fallback (comportamento original)
          DOCUMENTO: (data.mag_cpf || '').replace(/\D/g, '')
        }
      }
    };
  }

  // --- DÉBITO EM CONTA (Ajustado) ---
  if (payment.method === 'DEBIT_ACCOUNT' && payment.debitAccount) {
    // Verifica se existe um pagador terceiro definido no formulário
    const payer = payment.payer;
    const isThirdParty = payer && payer.isInsuredPayer === false;

    // Dados do Titular da Conta
    const nomeTitular = isThirdParty ? payer.payerName : data.mag_nome_completo;
    const cpfTitular = isThirdParty ? payer.payerCpf : data.mag_cpf;
    const parentesco = isThirdParty ? payer.payerRelationship : 'PROPRIO';

    return {
      ...baseData,
      TIPO_COBRANCA: 'DEBITO', 
      CONTA_CORRENTE: {
        BANCO: payment.debitAccount.bankCode,
        AGENCIA: payment.debitAccount.agency,
        CONTA: payment.debitAccount.accountNumber,
        DIGITO_CONTA: payment.debitAccount.accountDigit,
        
        // ESTRUTURA CORRETA PARA A MAG (TITULAR DA CONTA):
        TITULAR: {
            NOME: (nomeTitular || '').toUpperCase().substring(0, 50),
            CPF: (cpfTitular || '').replace(/\D/g, ''),
            PARENTESCO: (parentesco || 'OUTROS').toUpperCase(),
            // A flag de aceite vem do checkbox 'consentDebit'
            AUTORIZA_DEBITO: payment.consentDebit === true
        }
      }
    };
  }

  // --- DESCONTO EM FOLHA ---
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