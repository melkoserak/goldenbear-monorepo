import { NextResponse } from 'next/server';
import { reserveProposal } from '@/lib/mag-api/client';
import { MAG_Logger } from '@/lib/mag-api/logger';

export const dynamic = 'force-dynamic';

/**
 * (Tradução de handle_reserve_proposal)
 *
 */
export async function POST() {
  try {
    const propResponse = await reserveProposal();
    const body = await propResponse.json();

    if (!propResponse.ok || !body.proposalReservedNumber) {
      throw new Error(body.message || 'Resposta inválida da API de reserva.');
    }
    
    return NextResponse.json({ proposalNumber: body.proposalReservedNumber });
  } catch (error) {
    const err = error as Error;
    MAG_Logger.error('Erro em /api/proposal/reserve', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}