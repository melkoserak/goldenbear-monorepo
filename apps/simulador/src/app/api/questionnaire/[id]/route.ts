// apps/simulador/src/app/api/questionnaire/[id]/route.ts
import { NextResponse } from 'next/server';
import { getQuestionnaireToken } from '@/lib/mag-api/client';

const BASE_URL = process.env.MAG_API_BASE_URL!;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // 1. Obter Token (Escopo api.questionario)
    const token = await getQuestionnaireToken();

    // 2. Buscar o JSON do Questionário na MAG
    const response = await fetch(`${BASE_URL}/questionario/api/v2/questionario/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[BFF] Erro ao buscar questionário ${id}:`, response.status, errorText);
      return NextResponse.json({ error: 'Falha ao buscar questionário na MAG' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('[BFF] Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}