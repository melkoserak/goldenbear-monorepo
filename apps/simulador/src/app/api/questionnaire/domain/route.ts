import { NextResponse } from 'next/server';
import { getDomains } from '@/lib/mag-api/client';
import { MAG_Logger } from '@/lib/mag-api/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    MAG_Logger.info(`Buscando lista de domínios na MAG`);
    
    const data = await getDomains();
    
    // Opcional: Se quiser retornar apenas o array 'Valor' limpo
    // return NextResponse.json(data.Valor);
    
    return NextResponse.json(data);

  } catch (error) {
    const err = error as Error;
    MAG_Logger.error('Erro no BFF ao buscar domínios', err);
    
    return NextResponse.json(
      { error: err.message || 'Falha ao buscar domínios.' }, 
      { status: 500 }
    );
  }
}