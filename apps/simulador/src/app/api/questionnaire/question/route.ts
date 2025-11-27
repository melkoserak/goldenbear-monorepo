import { NextResponse } from 'next/server';
import { createQuestion } from '@/lib/mag-api/client';
import { MAG_Logger } from '@/lib/mag-api/logger';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validação básica: O payload deve ter pelo menos um objeto "Valor" ou campos essenciais
    if (!body) {
        return NextResponse.json({ error: 'Payload vazio.' }, { status: 400 });
    }

    MAG_Logger.info(`Criando nova pergunta na MAG`);
    
    // Repassa o body do frontend direto para a MAG
    const data = await createQuestion(body);
    
    return NextResponse.json(data);

  } catch (error) {
    const err = error as Error;
    MAG_Logger.error('Erro no BFF ao criar pergunta', err);
    
    return NextResponse.json(
      { error: err.message || 'Falha ao criar pergunta.' }, 
      { status: 500 }
    );
  }
}