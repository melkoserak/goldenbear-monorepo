import { NextResponse } from 'next/server';
import { getQuestionnaireToken } from '@/lib/mag-api/client';
import { MAG_Logger } from '@/lib/mag-api/logger';

export const dynamic = 'force-dynamic';

/**
 * (Tradução de handle_get_questionnaire_token)
 *
 */
export async function POST() {
  // --- LOG ADICIONADO ---
  MAG_Logger.debug("[BFF-BACKEND] Rota /api/questionnaire/token ATINGIDA.");
  try {
    const token = await getQuestionnaireToken();
    // --- LOG ADICIONADO ---
    MAG_Logger.debug("[BFF-BACKEND] Rota /api/questionnaire/token enviando token (início) para o frontend:", { token: token.substring(0, 10) + "..." });
    return NextResponse.json({ token });
  } catch (error) {
    const err = error as Error;
    MAG_Logger.error('Erro em /api/questionnaire/token', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}