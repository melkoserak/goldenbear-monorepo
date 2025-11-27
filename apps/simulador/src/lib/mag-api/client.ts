import { MAG_Logger } from '@/lib/mag-api/logger';
import { MagSimulationPayload } from './types';

// Remove barra final se houver para evitar erros de URL
const BASE_URL = process.env.MAG_API_BASE_URL?.replace(/\/$/, '') || '';

// 1. Função Genérica de Token
async function getMagToken(scope: string): Promise<string> {
  // SÓ loga em desenvolvimento
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[BFF-BACKEND] Solicitando token. Escopo: "${scope}"`);
  }

  const url = `${BASE_URL}/connect/token`;
  const body = new URLSearchParams({
    client_id: process.env.MAG_CLIENT_ID!,
    client_secret: process.env.MAG_CLIENT_SECRET!,
    grant_type: 'client_credentials',
    scope: scope,
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok || !data.access_token) {
      console.error('[BFF-BACKEND] ❌ Erro Token:', { status: response.status, error: data });
      throw new Error(`Falha auth MAG: ${response.status}`);
    }

    return data.access_token;
  } catch (error) {
    console.error('[BFF-BACKEND] ❌ Exceção Token:', error);
    throw error;
  }
}

// --- Tokens Específicos ---

// Token para Simulação e Proposta (Escopo padrão)
const getApiSeguradoraToken = () => getMagToken('apiseguradora');

// Token para Widget (Se ainda for usar em algum lugar)
export const getWidgetToken = () => getMagToken('apiseguradora apiunderwriting');

// Token para Pagamento
export const getPaymentWidgetToken = () => getMagToken('cartaocredito');

// --- O TOKEN DO QUESTIONÁRIO (CORRIGIDO) ---
// Escopo confirmado: api.questionario
export const getQuestionnaireToken = async () => {
  return getMagToken('api.questionario');
};

// --- Funções de Negócio: Questionário ---

/**
 * Busca a estrutura do questionário (GET)
 * Endpoint confirmado: /api.questionario/v2/Questionario/{id}
 */
export async function getQuestionnaireStructure(id: string | number) {
  try {
    // 1. Pega o token com escopo 'api.questionario'
    const token = await getQuestionnaireToken();
    
    // 2. Monta a URL exata que você confirmou
    const url = `${BASE_URL}/api.questionario/v2/Questionario/${id}`;

    console.log(`[MAG Client] GET ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      next: { revalidate: 3600 } 
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[MAG Client] Erro GET Questionário (${response.status}):`, errorText);
      throw new Error(`Erro MAG (${response.status}): ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error("[MAG Client] Falha crítica em getQuestionnaireStructure:", error);
    throw error;
  }
}

export async function getDomains() {
  try {
    const token = await getQuestionnaireToken();
    
    const cleanBaseUrl = process.env.MAG_API_BASE_URL?.replace(/\/$/, '') || '';
    const url = `${cleanBaseUrl}/api.questionario/v2/Dominio`;

    console.log(`[MAG Client] GET Domínios: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      // Cache longo (24h) pois metadados mudam raramente
      next: { revalidate: 86400 } 
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[MAG Client] Erro ao buscar domínios:`, errorText);
      throw new Error(`Erro MAG Domínios (${response.status}): ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error("[MAG Client] Falha em getDomains:", error);
    throw error;
  }
}

/**
 * Envia as respostas (POST)
 * Assumindo o padrão do endpoint: /api.questionario/v2/Resposta
 */
export async function postQuestionnaireAnswers(proposalNumber: string, filledJsonString: string) {
  try {
    const token = await getQuestionnaireToken();
    
    // Mantendo o mesmo padrão de URL do serviço
    const url = `${BASE_URL}/api.questionario/v2/Resposta`;

    const body = {
      Localizador: {
        Origem: "Venda",
        IdentificadorExterno: String(proposalNumber)
      },
      Resposta: filledJsonString
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[MAG Client] Erro POST Resposta (${response.status}):`, errorText);
      throw new Error(`Falha envio DPS: ${response.status} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error("[MAG Client] Falha crítica em postQuestionnaireAnswers:", error);
    throw error;
  }
}

export async function getQuestion(id: string | number) {
  try {
    const token = await getQuestionnaireToken();
    
    // Monta a URL: remove barra final da base e adiciona o endpoint
    const cleanBaseUrl = process.env.MAG_API_BASE_URL?.replace(/\/$/, '') || '';
    const url = `${cleanBaseUrl}/api.questionario/v2/Pergunta/${id}`;

    console.log(`[MAG Client] GET Pergunta: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store' // Dados administrativos geralmente não devem ser cacheados
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[MAG Client] Erro ao buscar pergunta ${id}:`, errorText);
      throw new Error(`Erro MAG Pergunta (${response.status}): ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error("[MAG Client] Falha em getQuestion:", error);
    throw error;
  }
}

/**
 * Cria uma nova pergunta (POST)
 * Endpoint: /api.questionario/v2/Pergunta
 */
export async function createQuestion(payload: any) {
  try {
    const token = await getQuestionnaireToken();
    
    const cleanBaseUrl = process.env.MAG_API_BASE_URL?.replace(/\/$/, '') || '';
    const url = `${cleanBaseUrl}/api.questionario/v2/Pergunta`;

    console.log(`[MAG Client] POST Criar Pergunta: ${url}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[MAG Client] Erro ao criar pergunta:`, errorText);
      throw new Error(`Erro MAG Criar Pergunta (${response.status}): ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error("[MAG Client] Falha em createQuestion:", error);
    throw error;
  }
}

// --- Funções de Negócio: Simulação e Proposta (Mantidas) ---

export async function getProfessions() {
  const token = await getApiSeguradoraToken();
  const url = `${BASE_URL}/apiseguradora/v3/dominio/CBO`;
  const response = await fetch(url, { method: 'GET', headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 86400 } });
  if (!response.ok) throw new Error('Erro ao buscar profissões');
  return response.json();
}

export async function getProductDetailsByOffer(offerId: string) {
  const token = await getApiSeguradoraToken();
  const url = `${BASE_URL}/apiseguradora/v3/produto?codigoModeloProposta=${offerId}`;
  const response = await fetch(url, { method: 'GET', headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 3600 } });
  if (!response.ok) throw new Error('Erro ao buscar detalhes do produto');
  return response.json();
}

export async function postSimulation(payload: MagSimulationPayload) {
  const token = await getApiSeguradoraToken();
  const url = `${BASE_URL}/apiseguradora/v3/simulacao?cnpj=${process.env.MAG_CNPJ_PARCEIRO}&codigoModeloProposta=${process.env.MAG_OFFER_ID}`;
  return fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload), cache: 'no-store' });
}

export async function reserveProposal() {
  const token = await getWidgetToken();
  const url = `${BASE_URL}/api.underwriting/v1/proposals/${process.env.MAG_MODELO_PROPOSTA}/next-number`;
  return fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json', 'X-Request-ID': `SIMULADOR_NEXT_${Date.now()}` }, cache: 'no-store' });
}

export async function postProposal(payload: any) {
  const token = await getApiSeguradoraToken();
  const url = `${BASE_URL}/apiseguradora/v3/proposta?empresa=${process.env.MAG_CNPJ_PARCEIRO}`;
  return fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload), cache: 'no-store' });
}