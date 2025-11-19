import { MAG_Logger } from '@/lib/mag-api/logger';
import { MagSimulationPayload } from './types';

// Interface para o cache do token
interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

const tokenCache = new Map<string, TokenCache>();
const BASE_URL = process.env.MAG_API_BASE_URL!;

/**
 * Busca um token de acesso da MAG, usando cache.
 * Função de SERVIDOR.
 */
async function getMagToken(scope: string): Promise<string> {
  const cacheKey = `mag_token_${scope}`;
  const cached = tokenCache.get(cacheKey);

  if (cached && cached.expiresAt > Date.now() + 300 * 1000) {
    return cached.accessToken;
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
      cache: 'no-store', // Token não deve ser cacheado pelo fetch
    });

    const data = await response.json();

    if (!response.ok || !data.access_token) {
      MAG_Logger.error('Falha ao obter token da MAG', {
        status: response.status,
        scope,
        body: data,
      });
      throw new Error(`Falha na autenticação com a MAG (scope: ${scope}).`);
    }

    const expiresAt = Date.now() + (data.expires_in || 3600) * 1000;
    tokenCache.set(cacheKey, { accessToken: data.access_token, expiresAt });

    return data.access_token;
  } catch (error) {
    MAG_Logger.error('Erro de rede ao obter token da MAG', error, { scope });
    throw new Error('Erro de comunicação ao obter token.');
  }
}

/**
 * get_token (escopo apiseguradora)
 *
 */
const getApiSeguradoraToken = () => getMagToken('apiseguradora');

/**
 * get_widget_token (escopo combinado)
 *
 */
// --- CORREÇÃO AQUI ---
// Adicionamos 'export' para que a API route possa importá-la.
export const getWidgetToken = () => getMagToken('apiseguradora apiunderwriting');

/**
 * get_questionnaire_token (escopo api.questionario)
 *
 *
 * --- CORREÇÃO APLICADA E LOG ADICIONADO ---
 * Revertendo ao escopo original do PHP ('api.questionario').
 * O erro 401 indica que o escopo 'apiunderwriting' estava errado.
 */
export const getQuestionnaireToken = async () => {
  MAG_Logger.debug("[BFF-BACKEND] Iniciando busca de token para questionário.");
  
  const token = await getMagToken('api.questionario'); 
  
  // REMOVIDO: Log do token
  // MAG_Logger.debug(...)
  
  return token;
};

/**
 * get_payment_widget_token (escopo cartaocredito)
 *
 */
export const getPaymentWidgetToken = () => getMagToken('cartaocredito');

/**
 * get_professions
 *
 */
export async function getProfessions() {
  const token = await getApiSeguradoraToken();
  const url = `${BASE_URL}/apiseguradora/v3/dominio/CBO`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    MAG_Logger.error('API /professions falhou', { status: response.status });
    throw new Error('Não foi possível buscar as profissões.');
  }
  
  // CORREÇÃO AQUI:
  // Estávamos retornando 'data', mas 'data' é o objeto de resposta.
  // Devemos retornar o JSON.
  return response.json(); // <-- Retorne o JSON
}

/**
 * get_product_details_by_offer
 *
 */
export async function getProductDetailsByOffer(offerId: string) {
  const token = await getApiSeguradoraToken();
  const url = `${BASE_URL}/apiseguradora/v3/produto?codigoModeloProposta=${offerId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 3600 }, // Cache de 1 hora
  });

  if (!response.ok) {
    MAG_Logger.error('API /produto (details) falhou', { status: response.status });
    throw new Error('Não foi possível buscar detalhes do produto.');
  }
  return response.json();
}

/**
 * get_simulation
 *
 */
export async function postSimulation(payload: MagSimulationPayload) {
  const token = await getApiSeguradoraToken();
  const url = `${BASE_URL}/apiseguradora/v3/simulacao?cnpj=${process.env.MAG_CNPJ_PARCEIRO}&codigoModeloProposta=${process.env.MAG_OFFER_ID}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  return response; // Retornamos a resposta completa para o controller tratar
}

/**
 * reserve_proposal
 *
 */
export async function reserveProposal() {
  // Esta rota usa o token com escopo combinado
  const token = await getWidgetToken();
  const url = `${BASE_URL}/api.underwriting/v1/proposals/${process.env.MAG_MODELO_PROPOSTA}/next-number`;
  const requestId = `SIMULADOR_NEXT_${Date.now()}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Request-ID': requestId,
    },
    cache: 'no-store',
  });

  MAG_Logger.debug('[API_RESERVA] Resposta da API', {
    requestId,
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
  });

  return response;
}

/**
 * submit_proposal
 *
 */
export async function postProposal(payload: any) {
  const token = await getApiSeguradoraToken();
  const url = `${BASE_URL}/apiseguradora/v3/proposta?empresa=${process.env.MAG_CNPJ_PARCEIRO}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  return response;
}