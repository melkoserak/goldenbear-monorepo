import { MAG_Logger } from '@/lib/mag-api/logger';
import { MagSimulationPayload } from './types';

const BASE_URL = process.env.MAG_API_BASE_URL!;

function getScopesFromToken(token: string): string {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return "Token inválido";
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    return payload.scope || "Sem escopo";
  } catch (e) {
    return "Erro ao decodificar";
  }
}

async function getMagToken(scope: string): Promise<string> {
  console.log(`[BFF-BACKEND] Solicitando token. Escopo pedido: "${scope}"`);

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
      console.error('[BFF-BACKEND] ❌ Erro MAG:', data);
      throw new Error(`Falha auth MAG: ${response.status}`);
    }

    const grantedScopes = getScopesFromToken(data.access_token);
    console.log(`[BFF-BACKEND] 🔑 Token gerado! Escopos concedidos: [ ${grantedScopes} ]`);

    return data.access_token;
  } catch (error) {
    console.error('[BFF-BACKEND] ❌ Exceção:', error);
    throw error;
  }
}

const getApiSeguradoraToken = () => getMagToken('apiseguradora');

export const getWidgetToken = () => getMagToken('apiseguradora apiunderwriting');

/**
 * get_questionnaire_token
 * VOLTANDO AO BÁSICO: Escopo estrito conforme solicitado pelo suporte.
 * Agora que corrigimos o ID do questionário no frontend, isso deve funcionar.
 */
export const getQuestionnaireToken = async () => {
  return getMagToken('api.questionario');
};

export const getPaymentWidgetToken = () => getMagToken('cartaocredito');

// --- Funções de Negócio ---

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