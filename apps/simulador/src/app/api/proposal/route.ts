import { NextResponse } from 'next/server';
import { postProposal } from '@/lib/mag-api/client';
import { prepareProposalPayload } from '@/lib/mag-api/processor';
import { MAG_Logger } from '@/lib/mag-api/logger';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const proposalBaseSchema = z.object({
  mag_nome_completo: z.string().min(3),
  mag_cpf: z.string().min(11),
  mag_email: z.string().email(),
  mag_celular: z.string(),
  final_simulation_config: z.string(),
  payment_pre_auth_code: z.string().optional(),
  payment: z.record(z.string(), z.any()).optional(),
}).passthrough();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const validation = proposalBaseSchema.safeParse(body);

    if (!validation.success) {
      const errorMsg = "Dados da proposta inválidos/incompletos.";
      MAG_Logger.warn(errorMsg, { issues: validation.error.issues });
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }
    
    const validData = validation.data;
    const finalSimConfig = JSON.parse(validData.final_simulation_config);
    
    if (!finalSimConfig.produtos) {
      throw new Error("Configuração final inválida (sem produtos).");
    }
    
    // 1. Preparar Payload
    const payload = prepareProposalPayload(validData as any, finalSimConfig);
    
    // --- DEBUG: Ver o que estamos enviando ---
    console.log("==========================================");
    console.log("[PROPOSAL] Payload Enviado MAG (DADOS_COBRANCA):");
    console.log(JSON.stringify(payload.PROPOSTA.DADOS_COBRANCA, null, 2));
    console.log("==========================================");

    // 2. Enviar
    const propResponse = await postProposal(payload);
    const propData = await propResponse.json();

    // 3. Tratar Erro com Visibilidade
    if (!propResponse.ok || !propData.numeroProposta) {
      
      // Loga o erro COMPLETO no terminal para você ler
      console.error("[PROPOSAL] ❌ Erro MAG Completo:", JSON.stringify(propData, null, 2));

      const msgErro = propData?.Mensagens?.[0]?.Descricao || 'Falha ao registrar proposta.';
      
      // Passa o erro como string no 2º argumento para o Logger não gerar [object Object]
      MAG_Logger.error('Falha na API de Proposta', new Error(msgErro), { 
          status: propResponse.status, 
          body: propData 
      });

      throw new Error(msgErro);
    }

    MAG_Logger.info('Proposta submetida com sucesso', { num: propData.numeroProposta });
    return NextResponse.json({ proposal_number: propData.numeroProposta });

  } catch (error) {
    const err = error as Error;
    MAG_Logger.error('Erro em /api/proposal', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}