import { NextResponse } from 'next/server';
import { createDigitalSignature } from '@/lib/mag-api/client';
import { MAG_Logger } from '@/lib/mag-api/logger';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, tokenCode, name, email, phone } = body;

    // Validação básica dos dados recebidos do front
    if (!username || !tokenCode || !name || !email || !phone) {
        return NextResponse.json({ error: 'Dados incompletos para assinatura.' }, { status: 400 });
    }

    // --- FLUXO 100% REAL ---
    // Chama a API da MAG para validar o código que o usuário (ou suporte) digitou.
    MAG_Logger.info(`[SIGNATURE] Validando token REAL para ${username}`);

    const result = await createDigitalSignature({
        username,
        document: username, // Geralmente é o CPF
        email,
        name,
        phone,
        tokenCode, // O código que chegou no e-mail da MAG
        ip: "127.0.0.1", // Em produção, idealmente capturar o IP real
        userAgent: "SimuladorWeb"
    });

    MAG_Logger.info(`Assinatura realizada com sucesso para ${username}`, { signatureId: result?.id });

    return NextResponse.json({ 
        success: true, 
        signature: result 
    });

  } catch (error) {
    const err = error as Error;
    
    // Loga o erro técnico no servidor
    MAG_Logger.error('Erro em /api/signature/verify', err);
    
    // Retorna mensagem amigável para o frontend
    const msg = err.message.includes('Token inválido') || err.message.includes('400') 
        ? 'Código inválido ou expirado. Verifique o e-mail.' 
        : 'Erro ao validar assinatura. Tente novamente.';
        
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}