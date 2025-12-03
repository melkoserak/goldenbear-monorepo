"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { IMaskMixin } from 'react-imask';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { useCoverageStore, type ApiCoverage } from '@/stores/useCoverageStore';
import { submitProposal, type ProposalPayload } from '@/services/apiService';
import { track } from '@/lib/tracking';
// --- CORREÇÃO: CheckCircle2 ADICIONADO ---
import { Loader2, AlertTriangle, PartyPopper, CheckCircle2, UserCog } from 'lucide-react';
import { Button } from '@goldenbear/ui/components/button';
import { Input } from '@goldenbear/ui/components/input';
import { Label } from '@goldenbear/ui/components/label';
import { fillQuestionnaireTree } from '@/lib/mag-api/questionnaireUtils';

// ... (o restante do código permanece EXATAMENTE igual ao que você já tinha)
const MaskedInput = IMaskMixin(({ inputRef, ...props }) => (
  <Input {...props} ref={inputRef as React.Ref<HTMLInputElement>} />
));

interface MappedCoverage extends ApiCoverage {
    capitalContratado: number;
    premioCalculado: number;
}
interface MappedProduct {
    idProduto: number;
    descricao: string;
    coberturas: MappedCoverage[];
}

export const Step12 = () => {
    // ... (Mantenha todo o código do componente Step12 igual à versão completa anterior)
    const { 
        formData, 
        reservedProposalNumber,
        paymentPreAuthCode,
        actions: { setFormData } 
    } = useSimulatorStore();
    
    const coverageState = useCoverageStore();

    const [status, setStatus] = useState<'processing' | 'sending_dps' | 'success' | 'error'>('processing');
    const [error, setError] = useState<string | null>(null);
    const [proposalNumber, setProposalNumber] = useState<string | null>(null);
    
    // Self-Healing States
    const [isCpfError, setIsCpfError] = useState(false);
    const [tempCpf, setTempCpf] = useState(formData.cpf);
    const [retryTrigger, setRetryTrigger] = useState(0);

    const submitQuestionnaire = async (propNumber: string, filledJson: any) => {
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

    const handleFinalSubmit = useCallback(async () => {
        setStatus('processing');
        setError(null);
        setIsCpfError(false);

        try {
            // 1. Montar Produtos
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
                        productMap.get(productIdStr)?.coberturas.push({
                            ...coverage.originalData,
                            capitalContratado: coverage.currentCapital,
                            premioCalculado: coverageState.getCalculatedPremium(coverage)
                        });
                    }
                }
            });

            const finalSimulationConfig = {
                VL_TOTAL: coverageState.getTotalPremium(),
                produtos: Array.from(productMap.values())
            };

            // 2. Montar Payload da Proposta
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
                
                final_simulation_config: JSON.stringify(finalSimulationConfig),
                widget_answers: JSON.stringify(formData.dpsAnswers || {}),
                payment_pre_auth_code: paymentPreAuthCode || '',
                reserved_proposal_number: reservedProposalNumber || '',
                payment: formData.payment,
            };
            
            formData.beneficiaries.forEach((ben, index) => {
                payload[`mag_ben[${index}][nome]`] = ben.fullName;
                payload[`mag_ben[${index}][nasc]`] = ben.birthDate;
                payload[`mag_ben[${index}][parentesco]`] = ben.relationship;
            });
            
            // 3. Enviar Proposta
            const result = await submitProposal(payload);
            
            if (!result.proposal_number) {
                throw new Error('A API não retornou um número de proposta.');
            }

            setProposalNumber(result.proposal_number);
            track('proposal_success', { proposal_number: result.proposal_number });

            // 4. Enviar DPS (se houver)
            if (formData.dpsAnswers && formData.questionnaireOriginalData) {
                setStatus('sending_dps');
                const filledJsonObject = fillQuestionnaireTree(
                    formData.questionnaireOriginalData,
                    formData.dpsAnswers
                );
                await submitQuestionnaire(String(result.proposal_number), filledJsonObject);
                track('dps_success', { proposal_number: result.proposal_number });
            }

            setStatus('success');

        } catch (err) {
            const error = err as Error;
            console.error("Erro no Step 12:", error);
            
            const errorMsg = error.message || '';
            if (errorMsg.toLowerCase().includes('cpf') || errorMsg.toLowerCase().includes('inválido')) {
                setIsCpfError(true);
                setError("O CPF informado foi rejeitado. Por favor, corrija abaixo.");
            } else {
                setError(errorMsg || 'Erro no processamento da proposta.');
            }
            
            track('proposal_error', { error_message: errorMsg });
            setStatus('error');
        }
    }, [coverageState, formData, paymentPreAuthCode, reservedProposalNumber]);

    useEffect(() => {
        handleFinalSubmit();
    }, [retryTrigger, handleFinalSubmit]); 

    const handleFixCpfAndRetry = () => {
        if (tempCpf && tempCpf.length >= 11) {
            setFormData({ cpf: tempCpf }); 
            setTimeout(() => {
                setRetryTrigger(prev => prev + 1);
            }, 100);
        }
    };

    if (status === 'processing' || status === 'sending_dps') {
        return (
            <div className="animate-fade-in text-center py-16 px-6">
                <Loader2 className="animate-spin h-16 w-16 text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-foreground mb-2">
                    {status === 'processing' ? 'Gerando Apólice...' : 'Registrando Declaração de Saúde...'}
                </h3>
                <p className="text-muted-foreground">
                    Sua assinatura foi validada. Estamos finalizando a contratação.
                </p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="animate-fade-in text-center p-8 bg-destructive/5 border border-destructive/30 rounded-xl mx-auto max-w-lg mt-8">
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-xl font-bold text-destructive mb-2">Falha no Processamento</h3>
                <p className="text-muted-foreground mb-6">{error}</p>
                {isCpfError ? (
                    <div className="bg-background p-4 rounded-lg border border-border shadow-sm text-left space-y-4">
                         <div className="flex items-center gap-2 text-primary font-semibold">
                            <UserCog className="w-5 h-5" />
                            <span>Correção de Dados</span>
                         </div>
                         <div className="space-y-1.5">
                            <Label htmlFor="fix-cpf">Novo CPF</Label>
                            <MaskedInput
                                id="fix-cpf"
                                mask="000.000.000-00"
                                value={tempCpf}
                                onAccept={(v: string) => setTempCpf(v)}
                                className="border-primary ring-primary"
                                autoFocus
                            />
                         </div>
                         <Button onClick={handleFixCpfAndRetry} className="w-full">
                            Atualizar e Tentar Novamente
                         </Button>
                    </div>
                ) : (
                    <Button onClick={() => setRetryTrigger(prev => prev + 1)} variant="outline">
                        Tentar Novamente
                    </Button>
                )}
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
                        <span>Forma de pagamento registrada</span>
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