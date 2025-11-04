import { NextResponse } from 'next/server';
import { postProposal } from '@/lib/mag-api/client';
import { prepareProposalPayload } from '@/lib/mag-api/processor';
import { MAG_Logger } from '@/lib/mag-api/logger';

export const dynamic = 'force-dynamic';

/**
 * API Route para envio da proposta
 * (Tradução de handle_proposal_submission)
 *
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const finalSimConfig = JSON.parse(body.final_simulation_config || '{}');
    if (!finalSimConfig.produtos) {
      throw new Error("Configuração final da simulação (final_simulation_config) está faltando.");
    }
    
    const payload = prepareProposalPayload(body, finalSimConfig);
    const propResponse = await postProposal(payload);
    const propData = await propResponse.json();

    if (!propResponse.ok || !propData.numeroProposta) {
      MAG_Logger.error('Falha na API de Proposta', { status: propResponse.status, body: propData });
      throw new Error(propData?.Mensagens?.[0]?.Descricao || 'Falha ao registrar proposta.');
    }

    MAG_Logger.info('Proposta submetida com sucesso', { num: propData.numeroProposta });
    return NextResponse.json({ proposal_number: propData.numeroProposta });

  } catch (error) {
    const err = error as Error;
    MAG_Logger.error('Erro em /api/proposal', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}