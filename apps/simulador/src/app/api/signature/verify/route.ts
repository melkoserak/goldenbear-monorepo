import { NextResponse } from 'next/server';
import { MAG_Logger } from '@/lib/mag-api/logger';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tokenCode } = body;

    // [MOCK] Valida apenas o nosso código mágico
    if (tokenCode !== '123456') {
        return NextResponse.json({ success: false, error: 'Código inválido (Dica: use 123456)' }, { status: 400 });
    }

    MAG_Logger.info(`[MOCK] Assinatura validada localmente.`);

    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({ 
        success: true, 
        signature: {
            id: "MOCK_SIGNATURE_" + Date.now(),
            status: "Signed",
            timestamp: new Date().toISOString()
        } 
    });

  } catch (error) {
    const err = error as Error;
    MAG_Logger.error('Erro em /api/signature/verify', err);
    return NextResponse.json({ error: 'Erro na validação.' }, { status: 400 });
  }
}