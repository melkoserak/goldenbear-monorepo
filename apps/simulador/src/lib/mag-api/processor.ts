import {
  FrontendFormData,
  FinalSimConfig,
  MagSimulationPayload,
  FrontendBeneficiary, // <-- CORREÇÃO AQUI
} from './types';

/**
 * Tradução de MAG_Data_Processor::prepare_simulation_payload
 *
 */
export function prepareSimulationPayload(
  data: FrontendFormData
): MagSimulationPayload {
  const nome = data.mag_nome_completo || data.fullName;
  const cpf = (data.mag_cpf || data.cpf).replace(/\D/g, '');
  const data_nasc = data.mag_data_nascimento || data.birthDate;
  const sexo = data.mag_sexo || data.gender;
  const renda = parseFloat(data.mag_renda || data.income);
  const estado = (data.mag_estado || data.state).toUpperCase();
  const profissao_cbo = data.mag_profissao_cbo || data.profession;

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
 * Tradução de MAG_Data_Processor::prepare_proposal_payload
 *
 */
export function prepareProposalPayload(
  postData: FrontendFormData,
  finalSimConfig: FinalSimConfig
): any {
  const birthDate = new Date(`${postData.birthDate}T00:00:00`);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  const profissao_cbo = postData.profession;
  // Nota: A descrição da profissão não está sendo passada.
  // Precisamos buscá-la ou remover do payload.
  const profissao_desc = 'Profissão placeholder'; // TODO: Corrigir isso se necessário

  const documentos = buildDocumentsArray(postData);
  const telefones = buildPhonesArray(postData);
  const planos = buildPlansArray(finalSimConfig);
  const primeiro_plano_id = planos.length > 0 ? planos[0].CODIGO : '0';
  const beneficiarios = buildBeneficiariesArray(
    postData,
    primeiro_plano_id
  );
  const dados_cobranca = buildPaymentData(postData, finalSimConfig);
  const widgetAnswers = postData.dpsAnswers || {}; //

  // Tradução direta do payload do PHP
  return {
    PROPOSTA: {
      NUMERO: 0,
      DT_PROTOCOLO: new Date().toISOString().split('T')[0],
      DT_ASSINATURA: new Date().toISOString().split('T')[0],
      DT_INDEXACAO: new Date().toISOString().split('T')[0],
      DADOS_PROPONENTE: {
        MATRICULA: parseInt(process.env.NEXT_PUBLIC_MAG_MATRICULA || '0', 10),
        NOME: postData.fullName,
        DT_NASCIMENTO: postData.birthDate,
        IDADE: age,
        SEXO: postData.gender.toUpperCase(),
        ESTADO_CIVIL: postData.maritalStatus.toUpperCase(),
        CPF: postData.cpf.replace(/\D/g, ''),
        TITULAR_CPF: true,
        RECEBE_INFO_EMAIL: !!postData.email,
        EMAIL: postData.email,
        RESIDE_BRASIL: true,
        RENDA_MENSAL: parseFloat(postData.income),
        NUM_FILHOS: parseInt(postData.childrenCount, 10) || 0,
        PPE: postData.isPPE === 'true',
        DOCUMENTOS: { DOCUMENTO: documentos },
        ENDERECOS: {
          TP_CORRESPONDENCIA: 'RESIDENCIAL',
          ENDERECO: [
            {
              TIPO: 'RESIDENCIAL',
              LOGRADOURO: postData.street,
              NUMERO: postData.number,
              COMPLEMENTO: postData.complement,
              BAIRRO: postData.neighborhood,
              CIDADE: postData.city,
              ESTADO: postData.state.toUpperCase(),
              CEP: parseInt(postData.zipCode.replace(/\D/g, ''), 10),
            },
          ],
        },
        TELEFONES: { TELEFONE: telefones },
        PROFISSAO: {
          CODIGO: profissao_cbo,
          DESCRICAO: profissao_desc.toUpperCase(),
          CATEGORIA: 'EMPREGADO',
          EMPRESA: postData.company ? { NOME: postData.company } : null,
        },
      },
      PLANOS: {
        VL_TOTAL: finalSimConfig.VL_TOTAL || 0.0,
        PLANO: planos,
      },
      BENEFICIARIOS: {
        BENEFICIARIO: beneficiarios,
      },
      // DPS será enviado separadamente ou já está em outro fluxo?
      // Por enquanto, vamos omitir o bloco DECLARACOES
      DADOS_COBRANCA: dados_cobranca,
      USO_MONGERAL: {
        CONV_ADESAO: process.env.NEXT_PUBLIC_MAG_CONV_ADESAO || 'AD0000',
        ACAO_MARKETING:
          process.env.NEXT_PUBLIC_MAG_ACAO_MARKETING || 'AM0000',
        ALTERNATIVA: parseInt(
          process.env.NEXT_PUBLIC_MAG_ALTERNATIVA || '1',
          10
        ),
        SUCURSAL: process.env.NEXT_PUBLIC_MAG_SUCURSAL || 'F24',
        DIR_REGIONAL: 0,
        GER_SUCURSAL: 0,
        GER_COMERCIAL: 0,
        AGENTE: 0,
        CORRETOR1: parseInt(
          process.env.NEXT_PUBLIC_MAG_CORRETOR1 || '19020399',
          10
        ),
        CORRETOR2: 0,
        AGENTE_FIDELIZACAO: 0,
        MODELO_PROPOSTA: process.env.MAG_MODELO_PROPOSTA || 'EIS',
        MODELO_PROPOSTA_GED: process.env.MAG_MODELO_PROPOSTA || 'EIS',
        TIPO_COMISSAO: parseInt(
          process.env.NEXT_PUBLIC_MAG_TIPO_COMISSAO || '1',
          10
        ),
      },
    },
  };
}

// --- Funções Auxiliares (privadas) ---

function buildDocumentsArray(data: FrontendFormData) {
  const docs = [];
  if (data.rgNumber) {
    docs.push({
      NATUREZA_DOC: 'RG',
      DOCUMENTO: data.rgNumber,
      ORGAO_EXPEDIDOR: data.rgIssuer || 'SSP',
      DATA_EXPEDICAO: data.rgDate || '',
    });
  }
  return docs;
}

function buildPhonesArray(data: FrontendFormData) {
  const phones = [];
  if (data.phone) {
    const cleanPhone = data.phone.replace(/\D/g, '');
    phones.push({
      TIPO: 'CELULAR',
      DDI: 55,
      DDD: parseInt(cleanPhone.substring(0, 2), 10),
      NUMERO: parseInt(cleanPhone.substring(2), 10),
    });
  }
  if (data.homePhone) {
    const cleanHomePhone = data.homePhone.replace(/\D/g, '');
    phones.push({
      TIPO: 'RESIDENCIAL',
      DDI: 55,
      DDD: parseInt(cleanHomePhone.substring(0, 2), 10),
      NUMERO: parseInt(cleanHomePhone.substring(2), 10),
    });
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
          TP_TRIBUTACAO: 'NENHUM', // Valor fixo
          DT_CONCESSAO: '1900-01-01', // Valor fixo
          PRAZO_CERTO: 0,
          PRAZO_DECRESCIMO: 0,
          COBERTURAS: { COBERTURA: coberturas },
        });
      }
    });
  }
  return plans;
}

function buildBeneficiariesArray(
  data: FrontendFormData,
  primeiro_plano_id: string
) {
  const beneficiaries: any[] = [];
  if (data.beneficiaries && Array.isArray(data.beneficiaries)) {
    data.beneficiaries.forEach((ben: FrontendBeneficiary) => { // <--
      beneficiaries.push({
        CD_PLANO: primeiro_plano_id,
        NOME: ben.fullName,
        NASCIMENTO: ben.birthDate,
        PARENTESCO: ben.relationship.toUpperCase(),
        PARTICIPACAO: 0, // TODO: O formulário precisa coletar a participação
      });
    });
  }
  // Lógica de participação precisa ser definida (ex: dividir igualmente)
  if (beneficiaries.length > 0) {
    const participation = 100 / beneficiaries.length;
    beneficiaries.forEach((b) => (b.PARTICIPACAO = participation));
  }
  return beneficiaries;
}

function buildPaymentData(
  data: FrontendFormData,
  config: FinalSimConfig
): any {
  const preAuthCode = data.paymentPreAuthCode;
  if (preAuthCode) {
    return {
      PERIODICIDADE: 'MENSAL',
      TIPO_COBRANCA: 'CREDITO',
      DIA_VENCIMENTO: 10,
      COMP_DEBITO: new Date().toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' }), // ex: "11/2025"
      NUM_CONVENIO: '0',
      CARTAO: {
        NUMERO: '',
        VALIDADE: '1990-01-01',
        NUM_PRE_AUTORIZACAO: preAuthCode,
        BANDEIRA: '',
        PARCELA: 1,
        PORTADOR: {
          NOME: data.fullName,
          TIPO_PESSOA: 'F',
          DOCUMENTO: data.cpf.replace(/\D/g, ''),
        },
      },
    };
  }
  // TODO: Adicionar lógica para 'debit' (Débito em Conta)
  return {};
}