import { NextResponse } from 'next/server';
import { getProfessions } from '@/lib/mag-api/client';
import { MAG_Logger } from '@/lib/mag-api/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  console.log(`
  ===============================================
  [BFF-BACKEND]: /api/professions/route.ts foi ATINGIDA!
  Data: ${new Date().toISOString()}
  ===============================================
  `);

  try {
    const data = await getProfessions(); // Isso retorna o OBJETO COMPLETO da MAG
    
    // O erro está aqui:
    // Nós já estamos retornando `data.Valor` do client.ts
    // O client.ts deve retornar a resposta completa.
    
    // CORREÇÃO:
    if (data && data.Valor) {
      return NextResponse.json(data.Valor); // Retorna apenas o array
    } else {
      // Se 'data.Valor' não existir, é um erro
      throw new Error(data?.Mensagens?.[0]?.Descricao || "Resposta inválida da API da MAG: 'Valor' não encontrado.");
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