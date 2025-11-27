"use client";
import React, { useEffect, useState } from 'react';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { useCoverageStore, type ApiCoverage } from '@/stores/useCoverageStore';
import { submitProposal, type ProposalPayload } from '@/services/apiService';
import { track } from '@/lib/tracking';
import { Loader2, AlertTriangle, PartyPopper, CheckCircle2 } from 'lucide-react';
import { Button } from '@goldenbear/ui/components/button';
import { fillQuestionnaireTree } from '@/lib/mag-api/questionnaireUtils';

// Tipos auxiliares para o mapeamento
interface MappedCoverage extends ApiCoverage {
    capitalContratado: number;
    premioCalculado: number;
}
interface MappedProduct {
    idProduto: number;
    descricao: string;
    coberturas: MappedCoverage[];
}

export const Step11 = () => {
    const { 
        formData, 
        reservedProposalNumber,
        paymentPreAuthCode 
    } = useSimulatorStore();
    
    const coverageState = useCoverageStore();

    const [status, setStatus] = useState<'processing' | 'sending_dps' | 'success' | 'error'>('processing');
    const [error, setError] = useState<string | null>(null);
    const [proposalNumber, setProposalNumber] = useState<string | null>(null);

    // Função auxiliar para enviar o questionário (BFF)
    const submitQuestionnaire = async (propNumber: string, filledJson: string) => {
        const res = await fetch('/simulador/api/questionnaire/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ proposalNumber: propNumber, filledJson })
        });
        
        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || 'Falha ao enviar respostas de saúde.');
        }
        return res.json();
    };

    useEffect(() => {
        track('step_view', { step: 11, step_name: 'Processamento Final' });

        const handleFinalSubmit = async () => {
            try {
                // --- 1. PREPARAÇÃO DO PAYLOAD DA PROPOSTA ---
                const productMap = new Map<string, MappedProduct>();
                coverageState.coverages.forEach(coverage => {
                    if (coverage.isActive) {
                        const productId = coverage.originalData.productId;
                        if (productId !== undefined) {
                            const productIdStr = String(productId);
                            if (!productMap.has(productIdStr)) {
                                productMap.set(productIdStr, {
                                    idProduto: productId,
                                    descricao: `Produto ${productId}`,
                                    coberturas: []
                                });
                            }
                            const product = productMap.get(productIdStr);
                            if (product) {
                                 product.coberturas.push({
                                    ...coverage.originalData,
                                    capitalContratado: coverage.currentCapital,
                                    premioCalculado: coverageState.getCalculatedPremium(coverage)
                                });
                            }
                        }
                    }
                });

                const finalSimulationConfig = {
                    VL_TOTAL: coverageState.getTotalPremium(),
                    produtos: Array.from(productMap.values())
                };

                const payload: ProposalPayload = {
                    mag_nome_completo: formData.fullName,
                    mag_cpf: formData.cpf,
                    mag_email: formData.email,
                    mag_celular: formData.phone,
                    mag_estado: formData.state,
                    mag_data_nascimento: formData.birthDate,
                    mag_sexo: formData.gender,
                    mag_renda: formData.income,
                    mag_profissao_cbo: formData.profession,
                    mag_cep: formData.zipCode,
                    mag_logradouro: formData.street,
                    mag_numero: formData.number,
                    mag_complemento: formData.complement,
                    mag_bairro: formData.neighborhood,
                    mag_cidade: formData.city,
                    mag_estado_civil: formData.maritalStatus,
                    mag_tel_residencial: formData.homePhone,
                    mag_rg_num: formData.rgNumber,
                    mag_rg_orgao: formData.rgIssuer,
                    mag_rg_data: formData.rgDate,
                    mag_num_filhos: formData.childrenCount,
                    mag_profissao_empresa: formData.company,
                    mag_ppe: formData.isPPE,
                    
                    // JSONs complexos como string
                    final_simulation_config: JSON.stringify(finalSimulationConfig),
                    widget_answers: JSON.stringify(formData.dpsAnswers || {}), // Fallback antigo, mantido por segurança
                    
                    payment_pre_auth_code: paymentPreAuthCode || '',
                    reserved_proposal_number: reservedProposalNumber || '',
                };
                
                // Adiciona beneficiários dinamicamente
                formData.beneficiaries.forEach((ben, index) => {
                    payload[`mag_ben[${index}][nome]`] = ben.fullName;
                    payload[`mag_ben[${index}][nasc]`] = ben.birthDate;
                    payload[`mag_ben[${index}][parentesco]`] = ben.relationship;
                });
                
                // --- 2. ENVIO DA PROPOSTA ---
                const result = await submitProposal(payload);
                
                if (!result.proposal_number) {
                    throw new Error('A API não retornou um número de proposta.');
                }

                setProposalNumber(result.proposal_number);
                track('proposal_success', { proposal_number: result.proposal_number });

                // --- 3. ENVIO DO QUESTIONÁRIO (DPS) ---
                // Verifica se temos respostas E o template original para preencher
                if (formData.dpsAnswers && formData.questionnaireOriginalData) {
                    setStatus('sending_dps');
                    
                    // Gera o JSON final preenchido mantendo a árvore original
                    const filledJsonString = fillQuestionnaireTree(
                        formData.questionnaireOriginalData,
                        formData.dpsAnswers
                    );

                    // Envia para o novo endpoint
                    await submitQuestionnaire(String(result.proposal_number), filledJsonString);
                    
                    track('dps_success', { proposal_number: result.proposal_number });
                }

                // Tudo certo!
                setStatus('success');

            } catch (err) {
                const error = err as Error;
                console.error(error);
                setError(error.message || 'Ocorreu um erro desconhecido ao enviar a proposta.');
                track('proposal_error', { error_message: error.message });
                setStatus('error');
            }
        };

        handleFinalSubmit();
    }, []); // Executa apenas uma vez na montagem

    // --- RENDERIZAÇÃO DOS ESTADOS ---

    if (status === 'processing' || status === 'sending_dps') {
        return (
            <div className="animate-fade-in text-center py-16 px-6">
                <Loader2 className="animate-spin h-16 w-16 text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-foreground mb-2">
                    {status === 'processing' ? 'Gerando sua Apólice...' : 'Validando Declaração de Saúde...'}
                </h3>
                <p className="text-muted-foreground">
                    Estamos conectando com a seguradora. Por favor, não feche esta janela.
                </p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="animate-fade-in text-center p-8 bg-destructive/5 border border-destructive/30 rounded-xl mx-auto max-w-lg mt-8">
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-xl font-bold text-destructive mb-2">Não foi possível finalizar</h3>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                    Tentar Novamente
                </Button>
            </div>
        );
    }

    if (status === 'success' && proposalNumber) {
        return (
            <div className="animate-fade-in text-center py-12 px-6">
                <div className="mb-8 inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full">
                    <PartyPopper className="h-12 w-12 text-green-600" />
                </div>
                
                <h3 className="text-3xl font-bold text-foreground mb-2">Parabéns!</h3>
                <p className="text-xl text-muted-foreground mb-8">
                    Sua proposta foi enviada com sucesso.
                </p>

                <div className="bg-card border border-border rounded-xl p-8 max-w-md mx-auto shadow-sm mb-8">
                    <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold mb-2">Número da Proposta</p>
                    <p className="text-4xl font-mono font-bold text-primary tracking-tight select-all">
                        {proposalNumber}
                    </p>
                </div>

                <div className="max-w-lg mx-auto text-sm text-muted-foreground space-y-4">
                    <div className="flex items-center gap-3 justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span>Dados recebidos pela seguradora</span>
                    </div>
                    <div className="flex items-center gap-3 justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span>Pagamento pré-autorizado</span>
                    </div>
                    <div className="flex items-center gap-3 justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span>Declaração de saúde registrada</span>
                    </div>
                </div>

                <div className="mt-10">
                    <Button onClick={() => window.location.href = '/'} size="lg" className="px-8">
                        Voltar ao Início
                    </Button>
                </div>
            </div>
        );
    }

    return null;
};