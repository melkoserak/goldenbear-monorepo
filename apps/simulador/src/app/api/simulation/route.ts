import { NextResponse } from 'next/server';
import { getProductDetailsByOffer, postSimulation } from '@/lib/mag-api/client';
import { prepareSimulationPayload } from '@/lib/mag-api/processor';
import { MAG_Logger } from '@/lib/mag-api/logger';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// 1. Schema de Validação para Simulação
const simulationSchema = z.object({
  mag_nome_completo: z.string().min(3, "Nome completo é obrigatório"),
  mag_cpf: z.string().transform(val => val.replace(/\D/g, '')).refine(val => val.length === 11, "CPF inválido"),
  mag_data_nascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve ser YYYY-MM-DD"),
  mag_sexo: z.enum(['masculino', 'feminino']),
  mag_renda: z.string().min(1, "Renda é obrigatória"),
  mag_estado: z.string().length(2, "Estado inválido (UF)"),
  mag_profissao_cbo: z.string().min(1, "Profissão é obrigatória"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 2. Validação e Sanitização
    const validation = simulationSchema.safeParse(body);

    if (!validation.success) {
      // --- CORREÇÃO: Usar .issues ao invés de .errors ---
      const errorMessages = validation.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      MAG_Logger.warn('Tentativa de simulação com dados inválidos', { errors: errorMessages });
      return NextResponse.json({ error: `Dados inválidos: ${errorMessages}` }, { status: 400 });
    }

    const cleanData = validation.data;

    // 3. Lógica de Negócio
    const offerId = process.env.MAG_OFFER_ID!;
    const detailsData = await getProductDetailsByOffer(offerId);
    
    const coverageDetailsMap = new Map<string, any>();
    if (detailsData && detailsData.Valor) {
      detailsData.Valor.forEach((product: any) => {
        const productId = product.id;
        if (productId && product.coberturas) {
          product.coberturas.forEach((coverage: any) => {
            const compositeKey = `${productId}::${coverage.descricao}`;
            coverageDetailsMap.set(compositeKey, coverage);
          });
        }
      });
    }

    const payload = prepareSimulationPayload(cleanData as any);
    
    const simResponse = await postSimulation(payload);
    const simData = await simResponse.json();

    if (!simResponse.ok) {
      throw new Error(simData?.Mensagens?.[0]?.Descricao || 'Falha na API de simulação');
    }

    if (simData.Valor?.simulacoes?.[0]?.produtos && coverageDetailsMap.size > 0) {
      simData.Valor.simulacoes[0].produtos.forEach((simProduct: any) => {
        const simProductId = simProduct.idProduto;
        if (simProductId && simProduct.coberturas) {
          simProduct.coberturas.forEach((simCoverage: any) => {
            const compositeKey = `${simProductId}::${simCoverage.descricao}`;
            if (coverageDetailsMap.has(compositeKey)) {
              const details = coverageDetailsMap.get(compositeKey);
              simCoverage.numeroProcessoSusep = details.numeroProcessoSusep || '';
              simCoverage.descricaoDigitalCurta = details.descricaoDigitalCurta || '';
              simCoverage.descricaoDigitalLonga = details.descricaoDigitalLonga || '';
            }
          });
        }
      });
    }

    return NextResponse.json(simData);

  } catch (error) {
    const err = error as Error;
    MAG_Logger.error('Erro em /api/simulation', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}