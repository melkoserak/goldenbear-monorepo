const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  
  // --- A CORREÇÃO ESTÁ AQUI ---
  // Vamos adicionar o /simulador manualmente para garantir que a URL
  // esteja correta, correspondendo ao basePath do next.config.ts
  const correctUrl = `/simulador/api/${cleanEndpoint}`;
  
  console.log(`[BFF-FRONTEND] Chamando API interna: ${correctUrl}`);
  
  return correctUrl;
};



export interface ProfessionOption {
  value: string;
  label: string;
}

export const getProfessions = async (): Promise<ProfessionOption[]> => {
  const url = getApiUrl('professions'); // Gera a URL correta
  try {
    const response = await fetch(url, { 
      method: 'GET',
    });

    // --- LOG DE DEBUG (Aparecerá no CONSOLE DO NAVEGADOR) ---
    console.log(`[BFF-FRONTEND] Resposta de ${url}:`, {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
    });

    if (!response.ok) {
      const errorText = await response.text(); // Pega o texto do erro (pode ser HTML 404)
      console.error("[BFF-FRONTEND] Resposta de erro (texto):", errorText);
      
      const error = { error: `Falha ao buscar profissões (${response.statusText})` };
      throw new Error(error.error);
    }

    const data: { Auxiliar: string; Descricao: string }[] = await response.json();
    return data.map((prof) => ({
      value: prof.Auxiliar,
      label: prof.Descricao,
    }));

  } catch (error) {
    console.error(`[BFF-FRONTEND] Erro final em getProfessions (${url}):`, error);
    //
    throw new Error(`Falha ao buscar profissões. Verifique o console do terminal (Node.js) para o erro 404 ou 500.`);
  }
};

// (O restante do seu arquivo apiService.ts... cole-o aqui)
// ...
// ... (getSimulation, getWidgetToken, etc.)
// ...
// --- Copie o resto do seu apiService.ts aqui ---

// Interface de payload da simulação para garantir que está aqui
interface SimulationPayload {
  mag_nome_completo: string;
  mag_cpf: string;
  mag_data_nascimento: string;
  mag_sexo: string;
  mag_renda: string;
  mag_estado: string;
  mag_profissao_cbo: string;
}

export const getSimulation = async (formData: SimulationPayload) => {
  const url = getApiUrl('simulation');
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Falha ao buscar a simulação.');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erro na chamada da simulação (${url}):`, error);
    throw error;
  }
};

export interface AddressData {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export const getAddressByZipCode = async (zipCode: string): Promise<AddressData> => {
  const cleanedZip = zipCode.replace(/\D/g, '');
  if (cleanedZip.length !== 8) throw new Error('CEP deve conter 8 dígitos.');
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanedZip}/json/`);
    if (!response.ok) throw new Error('Não foi possível buscar o CEP.');
    
    const data = await response.json();
    if (data.erro) throw new Error('CEP não encontrado.');
    
    return {
      logradouro: data.logradouro,
      bairro: data.bairro,
      localidade: data.localidade,
      uf: data.uf,
    };
  } catch (error) {
    console.error("Erro na API ViaCEP:", error);
    throw error;
  }
};

export const getWidgetToken = async (): Promise<{ token: string }> => {
  const url = getApiUrl('widget/token');
  try {
    const response = await fetch(url, { method: 'POST' });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Falha ao obter token do widget.');
    }
    return await response.json();
  } catch (error) {
    console.error(`Erro na API getWidgetToken (${url}):`, error);
    throw error;
  }
};

export const reserveProposalNumber = async (): Promise<{ proposalNumber: string }> => {
  const url = getApiUrl('proposal/reserve');
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Falha ao reservar número da proposta.');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erro na API reserveProposalNumber (${url}):`, error);
    throw error;
  }
};

export const getQuestionnaireToken = async (): Promise<{ token: string }> => {
  const url = getApiUrl('questionnaire/token');
  try {
    const response = await fetch(url, { method: 'POST' });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Falha ao obter token do questionário.');
    }
    return await response.json();
  } catch (error) {
    console.error(`Erro na API getQuestionnaireToken (${url}):`, error);
    throw error;
  }
};

export const getPaymentToken = async (): Promise<{ token: string }> => {
  const url = getApiUrl('payment/token');
  try {
    const response = await fetch(url, { method: 'POST' });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Falha ao obter token de pagamento.');
    }
    return await response.json();
  } catch (error) {
    console.error(`Erro na API getPaymentToken (${url}):`, error);
    throw error;
  }
};

export type ProposalPayload = Record<string, string | number | boolean | undefined>;

export const submitProposal = async (payload: ProposalPayload) => {
  const url = getApiUrl('proposal');
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Falha ao enviar a proposta.');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erro na submissão da proposta (${url}):`, error);
    throw error;
  }
};