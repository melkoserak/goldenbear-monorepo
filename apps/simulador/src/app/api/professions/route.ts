import { NextResponse } from 'next/server';
import { getProfessions } from '@/lib/mag-api/client';
import { MAG_Logger } from '@/lib/mag-api/logger';

// Cache de 24 horas (86400 segundos)
export const revalidate = 86400; 

export async function GET(request: Request) {
  try {
    const data = await getProfessions();
    
    if (data && data.Valor) {
      return NextResponse.json(data.Valor, {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
        },
      });
    } else {
      throw new Error(data?.Mensagens?.[0]?.Descricao || "Resposta inválida da API da MAG");
    }

  } catch (error) {
    const err = error as Error;
    MAG_Logger.error('Erro em /api/professions', err);
    return NextResponse.json(
      { error: err.message || 'Erro ao buscar profissões.' },
      { status: 500 }
    );
  }
}