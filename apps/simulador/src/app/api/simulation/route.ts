import { NextResponse } from 'next/server';
import { getProductDetailsByOffer, postSimulation } from '@/lib/mag-api/client';
import { prepareSimulationPayload } from '@/lib/mag-api/processor';
import { MAG_Logger } from '@/lib/mag-api/logger';
import { z, ZodIssue } from 'zod'; // Importei ZodIssue para tipagem

export const dynamic = 'force-dynamic';

// --- Validação Matemática de CPF ---
const isValidCPF = (cpf: string) => {
  if (typeof cpf !== "string") return false;
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  const cpfArr = cpf.split("").map((el) => +el);
  const rest = (count: number) =>
    ((cpfArr.slice(0, count - 12).reduce((syt, el, idx) => syt + el * (count - idx), 0) * 10) % 11) % 10;
  return rest(10) === cpfArr[9] && rest(11) === cpfArr[10];
};

const simulationSchema = z.object({
  mag_nome_completo: z.string().min(3, "Nome muito curto"),
  mag_cpf: z.string()
    .transform(val => val.replace(/\D/g, ''))
    .refine((val) => val.length === 11, "CPF deve ter 11 dígitos")
    .refine(isValidCPF, "CPF inválido (dígitos verificadores incorretos)"),
  mag_data_nascimento: z.string(),
  mag_sexo: z.string().optional(),
  mag_renda: z.string(),
  mag_estado: z.string().length(2),
  mag_profissao_cbo: z.string().min(1, "Profissão obrigatória"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Validação Zod
    const validation = simulationSchema.safeParse(body);

    if (!validation.success) {
      // [CORREÇÃO TS] Usando .issues e tipando (issue: ZodIssue)
      // Se .issues não funcionar na sua versão, use (validation.error as any).errors
      const errorMsg = validation.error.issues.map((issue: ZodIssue) => issue.message).join(', ');
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const cleanData = validation.data;
    if (!cleanData.mag_sexo) cleanData.mag_sexo = 'masculino';
    cleanData.mag_sexo = cleanData.mag_sexo.toLowerCase();

    const payload = prepareSimulationPayload(cleanData as any);
    console.log("[BFF] Payload Validado:", JSON.stringify(payload, null, 2));

    // 2. Envio para API MAG
    const simResponse = await postSimulation(payload);
    
    let simData;
    const responseText = await simResponse.text();
    
    try {
        simData = JSON.parse(responseText);
    } catch (e) {
        console.error("[BFF] Erro Crítico: Resposta não-JSON da MAG:", responseText);
        throw new Error(`Erro na API da Seguradora (${simResponse.status})`);
    }

    if (!simResponse.ok) {
      console.error("[BFF] ❌ Erro API MAG:", JSON.stringify(simData, null, 2));
      
      // [CORREÇÃO API] Adaptação para o formato de erro real da MAG (Array de Strings)
      // O log mostrou: "Mensagens": ["A Pré-Condição..."]
      let msg = 'Erro desconhecido na API MAG';

      if (simData?.Mensagens && Array.isArray(simData.Mensagens) && simData.Mensagens.length > 0) {
          // Pega a primeira mensagem, seja ela string ou objeto
          const primeiraMsg = simData.Mensagens[0];
          msg = typeof primeiraMsg === 'string' ? primeiraMsg : primeiraMsg?.Descricao || JSON.stringify(primeiraMsg);
      } else if (simData?.Message) {
          msg = simData.Message;
      } else if (typeof simData === 'string') {
          msg = simData;
      }

      throw new Error(msg);
    }

    // 3. Enriquecimento de Dados
    let produtosParaEnriquecer: any[] = [];
    if (simData.Valor?.produtos) {
        produtosParaEnriquecer = simData.Valor.produtos;
    } else if (simData.Valor?.simulacoes?.[0]?.produtos) {
        produtosParaEnriquecer = simData.Valor.simulacoes[0].produtos;
    }

    const offerId = process.env.MAG_OFFER_ID;
    if (offerId && produtosParaEnriquecer.length > 0) {
        try {
            const detailsData = await getProductDetailsByOffer(offerId);
            if (detailsData?.Valor) {
                const detailsMap = new Map();
                detailsData.Valor.forEach((p: any) => {
                    if (p.coberturas) {
                        p.coberturas.forEach((c: any) => {
                             const key = `${p.id}::${c.descricao}`; 
                             detailsMap.set(key, c);
                        });
                    }
                });

                produtosParaEnriquecer.forEach((prod: any) => {
                    const pId = prod.id || prod.idProduto;
                    if (prod.coberturas) {
                        prod.coberturas.forEach((cov: any) => {
                            const key = `${pId}::${cov.descricao}`;
                            const detail = detailsMap.get(key);
                            if (detail) {
                                cov.descricaoDigitalCurta = detail.descricaoDigitalCurta;
                                cov.descricaoDigitalLonga = detail.descricaoDigitalLonga;
                            }
                        });
                    }
                });
            }
        } catch (err) {
            console.warn("[BFF] Falha ao enriquecer produtos (não crítico):", err);
        }
    }

    return NextResponse.json(simData);

  } catch (error) {
    const err = error as Error;
    MAG_Logger.error('Erro em /api/simulation', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}