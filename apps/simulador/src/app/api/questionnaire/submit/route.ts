import { NextResponse } from 'next/server';
import { postQuestionnaireAnswers } from '@/lib/mag-api/client';
import { MAG_Logger } from '@/lib/mag-api/logger';
import { z } from 'zod';

// Validação básica do input
const submitSchema = z.object({
  proposalNumber: z.string().min(1),
  filledJson: z.string().min(10), // Garante que é uma string longa (JSON)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { proposalNumber, filledJson } = submitSchema.parse(body);

    MAG_Logger.info(`Enviando DPS para proposta ${proposalNumber}`);

    const result = await postQuestionnaireAnswers(proposalNumber, filledJson);

    return NextResponse.json(result);

  } catch (error) {
    const err = error as Error;
    MAG_Logger.error('Erro no BFF de envio de DPS', err);
    return NextResponse.json({ error: 'Falha ao registrar respostas de saúde.' }, { status: 500 });
  }
}