import { NextResponse } from 'next/server';
import { postProposal } from '@/lib/mag-api/client';
import { prepareProposalPayload } from '@/lib/mag-api/processor';
import { MAG_Logger } from '@/lib/mag-api/logger';
import { z } from 'zod';
import { FrontendFormData } from '@/lib/mag-api/types'; 

export const dynamic = 'force-dynamic';

// 1. Defina o Schema do Beneficiário separado para ficar limpo
const beneficiarySchema = z.object({
  fullName: z.string().min(3, "Nome do beneficiário inválido"),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida (AAAA-MM-DD)"),
  relationship: z.string().min(2),
  percentage: z.union([z.string(), z.number()]), // Aceita "50" ou 50
  // Campos opcionais do representante legal se houver
  legalRepresentative: z.object({
      fullName: z.string().optional(),
      cpf: z.string().optional()
  }).optional()
});

const proposalBaseSchema = z.object({
  mag_nome_completo: z.string().min(3),
  mag_cpf: z.string().min(11),
  mag_email: z.string().email(),
  mag_celular: z.string(),
  // Campos opcionais
  mag_estado: z.string().optional(),
  mag_data_nascimento: z.string().optional(),
  mag_sexo: z.string().optional(),
  mag_renda: z.any().optional(), 
  mag_profissao_cbo: z.string().optional(),
  mag_cep: z.string().optional(),
  mag_logradouro: z.string().optional(),
  mag_numero: z.string().optional(),
  mag_complemento: z.string().optional(),
  mag_bairro: z.string().optional(),
  mag_cidade: z.string().optional(),
  mag_estado_civil: z.string().optional(),
  mag_tel_residencial: z.string().optional(),
  mag_rg_num: z.string().optional(),
  mag_rg_orgao: z.string().optional(),
  mag_rg_data: z.string().optional(),
  mag_num_filhos: z.any().optional(),
  mag_profissao_empresa: z.string().optional(),
  mag_ppe: z.any().optional(),
  
  // Campos técnicos
  final_simulation_config: z.string(),
  payment_pre_auth_code: z.string().optional(),
  payment: z.record(z.string(), z.any()).optional(),
  reserved_proposal_number: z.string().optional(),
  widget_answers: z.string().optional(),
  useLegalHeirs: z.boolean().optional(),
  beneficiaries: z.array(beneficiarySchema).optional(),
}).strip(); // .catchall(z.any()) se precisar passar campos extras de beneficiários dinâmicos sem validar

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const validation = proposalBaseSchema.safeParse(body);

    if (!validation.success) {
      const errorMsg = "Dados da proposta inválidos/incompletos.";
      MAG_Logger.warn(errorMsg, { issues: validation.error.issues });
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }
    
    const validData = validation.data as unknown as FrontendFormData;
    const finalSimConfig = JSON.parse(validData.final_simulation_config);
    
    if (!finalSimConfig.produtos) {
      throw new Error("Configuração final inválida (sem produtos).");
    }
    
    // 1. Preparar Payload
    const payload = prepareProposalPayload(validData, finalSimConfig);
    
    // --- DEBUG: Log preliminar (opcional, já que vamos logar tudo no final) ---
    // console.log("[PROPOSAL] Iniciando envio...");

    // 2. Enviar
    const propResponse = await postProposal(payload);
    const propData = await propResponse.json();

    // 3. Tratar Erro com Visibilidade
    if (!propResponse.ok || !propData.numeroProposta) {
      
      MAG_Logger.error('Erro MAG Completo (Sanitizado)', new Error('Falha na API'), { 
        responseBody: propData 
      }); 

      const msgErro = propData?.Mensagens?.[0]?.Descricao || 'Falha ao registrar proposta.';
      
      MAG_Logger.error('Falha na API de Proposta', new Error(msgErro), { 
          status: propResponse.status, 
          body: propData 
      });

      throw new Error(msgErro);
    }

    const numeroProposta = propData.numeroProposta;

    MAG_Logger.info('Proposta submetida com sucesso', { num: numeroProposta });

    // --- LOG COMPLETO PARA SUPORTE ---
    // Imprime o JSON formatado no terminal do servidor
    console.log("\n==========================================");
    console.log(`[SUPORTE MAG] Payload JSON da Proposta ${numeroProposta}:`);
    console.log(JSON.stringify(payload, null, 2));
    console.log("==========================================\n");

    // Retorna o payload na resposta também, para facilitar a cópia via Network tab do navegador
    return NextResponse.json({ 
        proposal_number: numeroProposta,
        debug_payload: payload 
    });

  } catch (error) {
    const err = error as Error;
    MAG_Logger.error('Erro em /api/proposal', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}