import { NextResponse } from 'next/server';
import { getProductDetailsByOffer, postSimulation } from '@/lib/mag-api/client';
import { prepareSimulationPayload } from '@/lib/mag-api/processor';
import { MAG_Logger } from '@/lib/mag-api/logger';

export const dynamic = 'force-dynamic';

/**
 * API Route para simulação
 * (Tradução de handle_simulation_request)
 *
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Buscar detalhes do produto (para SUSEP, etc.)
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

    // 2. Enviar simulação
    const payload = prepareSimulationPayload(body);
    const simResponse = await postSimulation(payload);
    const simData = await simResponse.json();

    if (!simResponse.ok) {
      throw new Error(simData?.Mensagens?.[0]?.Descricao || 'Falha na API de simulação');
    }

    // 3. Unir os dados (lógica do PHP)
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
    MAG_Logger.error('Erro em /api/simulation', err, { body: await request.text() });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}