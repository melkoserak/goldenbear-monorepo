import { NextResponse } from 'next/server';
import { getDomains } from '@/lib/mag-api/client';
import { MAG_Logger } from '@/lib/mag-api/logger';

// Cache de 12 horas
export const revalidate = 43200;

export async function GET() {
  try {
    const data = await getDomains();
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=43200, stale-while-revalidate=3600',
      },
    });

  } catch (error) {
    const err = error as Error;
    MAG_Logger.error('Erro no BFF ao buscar domínios', err);
    
    return NextResponse.json(
      { error: err.message || 'Falha ao buscar domínios.' }, 
      { status: 500 }
    );
  }
}