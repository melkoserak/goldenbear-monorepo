import { MAG_Logger } from '@/lib/mag-api/logger';
import { MagSimulationPayload } from './types';

// Remove barra final se houver para evitar erros de URL
const BASE_URL = process.env.MAG_API_BASE_URL?.replace(/\/$/, '') || '';
// IDs do Sistema fornecidos pelo suporte
// STG: 78931e5a-0bba-4f96-b0e9-d4e6ae8395ff
// PRD: 8cd318ae-67fc-40a8-97d6-ccb09063143f
const SYSTEM_ID = process.env.NODE_ENV === 'production' 
  ? '8cd318ae-67fc-40a8-97d6-ccb09063143f' 
  : '78931e5a-0bba-4f96-b0e9-d4e6ae8395ff';

// 1. Função Genérica de Token
async function getMagToken(scope: string): Promise<string> {
  if (process.env.NODE_ENV !== 'production') {
    MAG_Logger.debug(`[BFF-BACKEND] Solicitando token. Escopo: "${scope}"`);
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
      // --- CORREÇÃO DE LOG ---
      // Loga o erro cru no terminal para leitura imediata
      console.error(`[DEBUG TOKEN] Falha ao obter token para escopo '${scope}':`, JSON.stringify(data, null, 2));
      
      const errorMsg = data.error_description || data.error || JSON.stringify(data);
      
      MAG_Logger.error('[BFF-BACKEND] ❌ Erro Token:', { 
        status: response.status, 
        scope: scope,
        error: errorMsg 
      });
      
      throw new Error(`Falha auth MAG (${scope}): ${errorMsg}`);
    }

    return data.access_token;
  } catch (error) {
    MAG_Logger.error('[BFF-BACKEND] ❌ Exceção Token:', error as Error);
    throw error;
  }
}

// --- Tokens Específicos ---

const getApiSeguradoraToken = () => getMagToken('apiseguradora');
export const getWidgetToken = () => getMagToken('apiseguradora apiunderwriting');
export const getPaymentWidgetToken = () => getMagToken('cartaocredito');

export const getQuestionnaireToken = async () => {
  return getMagToken('api.questionario');
};
// --- NOVO: Token para Controle de Acesso ---
export const getAccessControlToken = async () => getMagToken('apicontroleacesso');

// --- Funções de Negócio: Questionário ---

export async function getQuestionnaireStructure(id: string | number) {
  try {
    const token = await getQuestionnaireToken();
    const url = `${BASE_URL}/api.questionario/v2/Questionario/${id}`;

    MAG_Logger.info(`[MAG Client] GET Questionário`, { url });

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
      MAG_Logger.error(`[MAG Client] Erro GET Questionário (${response.status}):`, new Error(errorText));
      throw new Error(`Erro MAG (${response.status}): ${errorText}`);
    }

    return response.json();
  } catch (error) {
    MAG_Logger.error("[MAG Client] Falha crítica em getQuestionnaireStructure:", error as Error);
    throw error;
  }
}

export async function getDomains() {
  try {
    const token = await getQuestionnaireToken();
    const url = `${BASE_URL}/api.questionario/v2/Dominio`;

    MAG_Logger.info(`[MAG Client] GET Domínios`, { url });

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      next: { revalidate: 86400 } 
    });

    if (!response.ok) {
      const errorText = await response.text();
      MAG_Logger.error(`[MAG Client] Erro ao buscar domínios:`, new Error(errorText));
      throw new Error(`Erro MAG Domínios (${response.status}): ${errorText}`);
    }

    return response.json();
  } catch (error) {
    MAG_Logger.error("[MAG Client] Falha em getDomains:", error as Error);
    throw error;
  }
}

/**
 * Envia as respostas (POST)
 * CORREÇÃO: filledJson agora é 'any' para aceitar o objeto direto
 */
export async function postQuestionnaireAnswers(proposalNumber: string, filledJson: any) {
  try {
    const token = await getQuestionnaireToken();
    const url = `${BASE_URL}/api.questionario/v2/Resposta`;

    // Log seguro (apenas chaves ou resumo)
    MAG_Logger.info("[MAG Client] Enviando DPS (Objeto)", { proposalNumber });

    const body = {
      Localizador: {
        Origem: "Venda",
        IdentificadorExterno: String(proposalNumber)
      },
      // Aqui transformamos o objeto em string para satisfazer o contrato da API
      Resposta: JSON.stringify(filledJson) 
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body), // Serializa o envelope externo
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      MAG_Logger.error(`[MAG Client] Erro POST Resposta (${response.status}):`, new Error(errorText));
      throw new Error(`Falha envio DPS: ${response.status} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    MAG_Logger.error("[MAG Client] Falha crítica em postQuestionnaireAnswers:", error as Error);
    throw error;
  }
}

export async function getQuestion(id: string | number) {
  try {
    const token = await getQuestionnaireToken();
    const url = `${BASE_URL}/api.questionario/v2/Pergunta/${id}`;

    MAG_Logger.info(`[MAG Client] GET Pergunta`, { url });

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      MAG_Logger.error(`[MAG Client] Erro ao buscar pergunta ${id}:`, new Error(errorText));
      throw new Error(`Erro MAG Pergunta (${response.status}): ${errorText}`);
    }

    return response.json();
  } catch (error) {
    MAG_Logger.error("[MAG Client] Falha em getQuestion:", error as Error);
    throw error;
  }
}

export async function createQuestion(payload: any) {
  try {
    const token = await getQuestionnaireToken();
    const url = `${BASE_URL}/api.questionario/v2/Pergunta`;

    MAG_Logger.info(`[MAG Client] POST Criar Pergunta`, { url });

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
      MAG_Logger.error(`[MAG Client] Erro ao criar pergunta:`, new Error(errorText));
      throw new Error(`Erro MAG Criar Pergunta (${response.status}): ${errorText}`);
    }

    return response.json();
  } catch (error) {
    MAG_Logger.error("[MAG Client] Falha em createQuestion:", error as Error);
    throw error;
  }
}

// --- NOVAS FUNÇÕES: Assinatura Digital ---

/**
 * Solicita o envio do Token (OTP) para o usuário
 */
export async function requestSignatureOtp(username: string, channel: 'Email' | 'SMS' | 'Whatsapp' = 'Email') {
  try {
    const token = await getAccessControlToken(); // Scope: apicontroleacesso
    
    // URL Corrigida conforme e-mail do suporte
    const url = `${BASE_URL}/gestao-acesso/v1/token/user/${username}/system/${SYSTEM_ID}`;

    MAG_Logger.info(`[MAG Client] Solicitando OTP para ${username} via ${channel}`);

    const body = {
      output: channel === 'Whatsapp' ? 'SMS' : channel, // Fallback se Whats não for suportado
      timeoutInMinutes: "5",
      tokenSize: "6"
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
      MAG_Logger.error(`[MAG Client] Erro Solicitação OTP (${response.status}):`, new Error(errorText));
      throw new Error(`Falha ao solicitar token: ${response.status} - ${errorText}`);
    }

    return true;
  } catch (error) {
    MAG_Logger.error("[MAG Client] Falha em requestSignatureOtp:", error as Error);
    throw error;
  }
}

/**
 * Realiza a assinatura validando o Token
 */
export async function createDigitalSignature(payload: {
  username: string;
  document: string;
  email: string;
  name: string;
  phone: string;
  tokenCode: string;
  ip: string;
  userAgent: string;
}) {
  try {
    const token = await getAccessControlToken();
    const url = `${BASE_URL}/gestao-acesso/v1/signature`;

    MAG_Logger.info(`[MAG Client] Criando Assinatura para ${payload.username}`);

    const cleanDoc = payload.document.replace(/\D/g, '').substring(0, 11); 
    const cleanPhone = payload.phone.replace(/\D/g, '').substring(0, 11);

    // --- CORREÇÃO: Valores mínimos garantidos ---
    const body = {
      user: {
        username: cleanDoc, 
        document: cleanDoc,
        email: payload.email.substring(0, 50), // Garante corte
        nameProponente: payload.name.substring(0, 50),
        cellphone: cleanPhone 
      },
      token: {
        tokenCode: payload.tokenCode,
        sendType: "Email",
        systemId: SYSTEM_ID,
        tokenType: "ValidacaoCompra"
      },
      sender: {
        userAgent: "Simulador", // Valor fixo minúsculo
        ip: "127.0.0.1",        // Valor fixo seguro (IPv4)
        port: "443",
        timezone: "UTC"
      },
      description: "Sig" // Valor minúsculo
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
      MAG_Logger.error(`[MAG Client] Erro Assinatura (${response.status}):`, new Error(errorText));
      throw new Error(`Erro na assinatura (${response.status}). Verifique o token.`);
    }

    return await response.json(); 
  } catch (error) {
    MAG_Logger.error("[MAG Client] Falha em createDigitalSignature:", error as Error);
    throw error;
  }
}// --- Funções de Negócio: Simulação e Proposta ---

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