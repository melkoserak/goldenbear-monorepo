import { NextResponse } from 'next/server';
import { getUser, createUser, requestSignatureOtp } from '@/lib/mag-api/client';
import { MAG_Logger } from '@/lib/mag-api/logger';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, name, email, phone } = body;

    if (!username || !email) {
       return NextResponse.json({ error: 'CPF e Email são obrigatórios.' }, { status: 400 });
    }

    // 1. Verificar/Criar Usuário na MAG (Mantemos essa lógica que já funcionou)
    try {
        const existingUser = await getUser(username);
        if (!existingUser) {
            // Se não tem nome/telefone, não dá pra criar
            if (name && phone) {
                await createUser({
                    username,
                    name,
                    email,
                    cellphone: phone
                });
                MAG_Logger.info(`[SIGNATURE] Usuário ${username} criado com sucesso na base MAG.`);
            } else {
                MAG_Logger.warn(`[SIGNATURE] Usuário ${username} não encontrado e dados insuficientes para criação.`);
            }
        } else {
            MAG_Logger.info(`[SIGNATURE] Usuário ${username} já existe na base MAG.`);
        }
    } catch (userError) {
        // Loga mas não trava, tenta pedir o token mesmo assim (a API de token valida o user)
        MAG_Logger.error('[SIGNATURE] Aviso ao verificar usuário:', userError as Error);
    }

    // 2. Solicitar OTP (Fluxo REAL)
    // O suporte pediu explicitamente para usar 'Email' em Homologação para gerar logs
    const channel = 'Email'; 

    MAG_Logger.info(`[SIGNATURE] Solicitando token real para ${username} via ${channel}`);
    
    await requestSignatureOtp(username, channel);
    
    return NextResponse.json({ 
      success: true, 
      message: `Token enviado para o e-mail cadastrado (Ambiente MAG).` 
    });

  } catch (error) {
    const err = error as Error;
    MAG_Logger.error('Erro em /api/signature/request', err);
    return NextResponse.json({ error: err.message || 'Falha ao solicitar token.' }, { status: 500 });
  }
}