import { NextResponse } from 'next/server';
import { postQuestionnaireAnswers } from '@/lib/mag-api/client';
import { MAG_Logger } from '@/lib/mag-api/logger';
import { z } from 'zod';

const submitSchema = z.object({
  proposalNumber: z.string().min(1),
  // CORREÇÃO: z.record exige chave e valor explícitos nesta versão do Zod
  filledJson: z.union([
    z.record(z.string(), z.any()), // Objeto: Record<string, any>
    z.array(z.any())               // Array: any[]
  ]), 
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { proposalNumber, filledJson } = submitSchema.parse(body);

    MAG_Logger.info(`Enviando DPS para proposta ${proposalNumber}`);

    // Agora o client.ts aceita 'filledJson' como objeto/array
    const result = await postQuestionnaireAnswers(proposalNumber, filledJson);

    return NextResponse.json(result);

  } catch (error) {
    const err = error as Error;
    MAG_Logger.error('Erro no BFF de envio de DPS', err);
    return NextResponse.json({ error: 'Falha ao registrar respostas de saúde.' }, { status: 500 });
  }
}