import { NextResponse } from 'next/server';
import { postProposal } from '@/lib/mag-api/client';
import { prepareProposalPayload } from '@/lib/mag-api/processor';
import { MAG_Logger } from '@/lib/mag-api/logger';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// 1. Schema Parcial para Proposta
const proposalBaseSchema = z.object({
  mag_nome_completo: z.string().min(3),
  mag_cpf: z.string().min(11),
  mag_email: z.string().email(),
  mag_celular: z.string(),
  final_simulation_config: z.string().refine((val) => {
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, "Configuração final inválida"),
  payment_pre_auth_code: z.string().optional(),
}).passthrough();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 2. Validação
    const validation = proposalBaseSchema.safeParse(body);

    if (!validation.success) {
      const errorMsg = "Dados da proposta inválidos/incompletos.";
      // --- CORREÇÃO: Usar .issues ---
      MAG_Logger.warn(errorMsg, { issues: validation.error.issues });
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }
    
    const validData = validation.data;

    // 3. Processamento
    const finalSimConfig = JSON.parse(validData.final_simulation_config);
    
    if (!finalSimConfig.produtos) {
      throw new Error("Configuração final da simulação (final_simulation_config) está faltando produtos.");
    }
    
    const payload = prepareProposalPayload(validData as any, finalSimConfig);
    
    const propResponse = await postProposal(payload);
    const propData = await propResponse.json();

    if (!propResponse.ok || !propData.numeroProposta) {
      MAG_Logger.error('Falha na API de Proposta', { status: propResponse.status, body: propData });
      throw new Error(propData?.Mensagens?.[0]?.Descricao || 'Falha ao registrar proposta.');
    }

    MAG_Logger.info('Proposta submetida com sucesso', { num: propData.numeroProposta });
    return NextResponse.json({ proposal_number: propData.numeroProposta });

  } catch (error) {
    const err = error as Error;
    MAG_Logger.error('Erro em /api/proposal', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}