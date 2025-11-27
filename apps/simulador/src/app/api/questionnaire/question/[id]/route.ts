import { NextResponse } from 'next/server';
import { getQuestion } from '@/lib/mag-api/client';
import { MAG_Logger } from '@/lib/mag-api/logger';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'ID da pergunta é obrigatório' }, { status: 400 });
    }

    MAG_Logger.info(`Buscando detalhes da pergunta ID: ${id}`);
    
    const data = await getQuestion(id);
    
    return NextResponse.json(data);

  } catch (error) {
    const err = error as Error;
    MAG_Logger.error(`Erro no BFF ao buscar pergunta [ID: ${await params.then(p => p.id)}]`, err);
    
    return NextResponse.json(
      { error: err.message || 'Falha ao buscar pergunta.' }, 
      { status: 500 }
    );
  }
}