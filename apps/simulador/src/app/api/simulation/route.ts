import { NextResponse } from 'next/server';
import { getProductDetailsByOffer, postSimulation } from '@/lib/mag-api/client';
import { prepareSimulationPayload } from '@/lib/mag-api/processor';
import { MAG_Logger } from '@/lib/mag-api/logger';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const simulationSchema = z.object({
  mag_nome_completo: z.string().min(3),
  mag_cpf: z.string().transform(val => val.replace(/\D/g, '')),
  mag_data_nascimento: z.string(),
  mag_sexo: z.string().optional(),
  mag_renda: z.string(),
  mag_estado: z.string().length(2),
  mag_profissao_cbo: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = simulationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    const cleanData = validation.data;
    if (!cleanData.mag_sexo) cleanData.mag_sexo = 'masculino';

    const payload = prepareSimulationPayload(cleanData as any);
    console.log("[BFF] Enviando simulação:", JSON.stringify(payload));

    const simResponse = await postSimulation(payload);
    const simData = await simResponse.json();

    if (!simResponse.ok) {
      const msg = simData?.Mensagens?.[0]?.Descricao || 'Erro na API MAG';
      console.error("[BFF] Erro MAG:", msg);
      throw new Error(msg);
    }

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
    // CORREÇÃO AQUI: Usar o MAG_Logger
    MAG_Logger.error('Erro em /api/simulation', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}