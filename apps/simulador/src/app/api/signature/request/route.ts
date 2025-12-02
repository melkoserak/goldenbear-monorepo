import { NextResponse } from 'next/server';
import { MAG_Logger } from '@/lib/mag-api/logger';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // [MOCK] Em Staging, não conseguimos ler o SMS real.
    // Simulamos o sucesso para não travar o QA.
    MAG_Logger.info(`[MOCK] Solicitação de assinatura para ${body.username}. Código fixo: 123456`);
    
    // Simula delay de rede para UX realista
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ 
      success: true, 
      message: `(MOCK) Token enviado com sucesso.` 
    });

  } catch (error) {
    const err = error as Error;
    MAG_Logger.error('Erro em /api/signature/request', err);
    return NextResponse.json({ error: 'Falha ao solicitar token.' }, { status: 500 });
  }
}