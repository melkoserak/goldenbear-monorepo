"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { IMaskMixin } from 'react-imask';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { useCoverageStore, type ApiCoverage } from '@/stores/useCoverageStore';
import { submitProposal, type ProposalPayload } from '@/services/apiService';
import { track } from '@/lib/tracking';
import { 
  Loader2, 
  AlertTriangle, 
  PartyPopper, 
  CheckCircle2, 
  UserCog, 
  ArrowLeft, 
  FileText,
  Stethoscope,
  CreditCard 
} from 'lucide-react';
import { Button } from '@goldenbear/ui/components/button';
import { Input } from '@goldenbear/ui/components/input';
import { Label } from '@goldenbear/ui/components/label';
import { fillQuestionnaireTree } from '@/lib/mag-api/questionnaireUtils';

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
    const { 
        formData, 
        reservedProposalNumber,
        paymentPreAuthCode,
        actions: { setFormData, setStep } 
    } = useSimulatorStore();
    
    const coverageState = useCoverageStore();

    const [status, setStatus] = useState<'processing' | 'sending_dps' | 'success' | 'error'>('processing');
    const [error, setError] = useState<string | null>(null);
    const [proposalNumber, setProposalNumber] = useState<string | null>(null);
    
    const [errorType, setErrorType] = useState<'API_ERROR' | 'MISSING_DATA' | 'CPF_ERROR'>('API_ERROR');
    const [missingStep, setMissingStep] = useState<number | null>(null);

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
        setErrorType('API_ERROR');
        setMissingStep(null);

        // --- 1. VALIDAÇÕES DE FLUXO ---
        if (coverageState.coverages.length === 0) {
             setError("Não encontramos os dados da sua simulação (planos).");
             setErrorType('MISSING_DATA');
             setMissingStep(4); 
             setStatus('error');
             return;
        }

        const requiresDPS = coverageState.coverages.some(c => 
            c.isActive && c.originalData?.questionariosPorFaixa && c.originalData.questionariosPorFaixa.length > 0
        );
        
        const hasAnswers = formData.dpsAnswers && Object.keys(formData.dpsAnswers).length > 0;
        
        if (requiresDPS && !hasAnswers) {
             setError("A Declaração Pessoal de Saúde é obrigatória para este plano e não foi preenchida.");
             setErrorType('MISSING_DATA');
             setMissingStep(9); 
             setStatus('error');
             return;
        }

        if (!formData.payment || !formData.payment.method) {
             setError("A forma de pagamento não foi selecionada.");
             setErrorType('MISSING_DATA');
             setMissingStep(10); 
             setStatus('error');
             return;
        }

        try {
            // --- 2. PROCESSAMENTO ---
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

            // Montar Payload
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
                
                // --- CORREÇÃO IMPORTANTE AQUI ---
                // Adicionamos os campos novos que o Backend espera
                useLegalHeirs: formData.useLegalHeirs,
                beneficiaries: formData.beneficiaries, // Envia o array completo
                // -------------------------------

                final_simulation_config: JSON.stringify(finalSimulationConfig),
                widget_answers: JSON.stringify(formData.dpsAnswers || {}),
                payment_pre_auth_code: paymentPreAuthCode || '',
                reserved_proposal_number: reservedProposalNumber || '',
                payment: formData.payment,
            };
            
            // Mantemos o legado apenas por segurança/retrocompatibilidade,
            // mas o processador vai ignorar se o array acima estiver preenchido.
            formData.beneficiaries.forEach((ben, index) => {
                payload[`mag_ben[${index}][nome]`] = ben.fullName;
                payload[`mag_ben[${index}][nasc]`] = ben.birthDate;
                payload[`mag_ben[${index}][parentesco]`] = ben.relationship;
            });
            
            const result = await submitProposal(payload);
            
            if (!result.proposal_number) {
                throw new Error('A API não retornou um número de proposta.');
            }

            setProposalNumber(result.proposal_number);
            track('proposal_success', { proposal_number: result.proposal_number });

            if (requiresDPS && hasAnswers && formData.questionnaireOriginalData) {
                setStatus('sending_dps');
                const filledJsonObject = fillQuestionnaireTree(
                    formData.questionnaireOriginalData,
                    formData.dpsAnswers || {} 
                );
                await submitQuestionnaire(String(result.proposal_number), filledJsonObject);
                track('dps_success', { proposal_number: result.proposal_number });
            }

            setStatus('success');

        } catch (err) {
            const error = err as Error;
            const errorMsg = error.message || '';
            
            if (errorMsg.toLowerCase().includes('cpf') || errorMsg.toLowerCase().includes('inválido')) {
                setErrorType('CPF_ERROR');
                setError("O CPF informado foi rejeitado pela seguradora.");
            } 
            else if (
                errorMsg.includes('perguntas obrigatórias') || 
                errorMsg.includes('Pré-Condição') || 
                errorMsg.includes('DPS')
            ) {
                setErrorType('MISSING_DATA');
                setMissingStep(9); 
                setError("A seguradora identificou pendências no Questionário de Saúde.");
            }
            else {
                setErrorType('API_ERROR');
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
                    Estamos finalizando a contratação do seu seguro.
                </p>
            </div>
        );
    }

    if (status === 'error') {
        let actionButtonText = "Corrigir";
        let ActionIcon = ArrowLeft;
        
        if (missingStep === 4) actionButtonText = "Ir para Simulação";
        if (missingStep === 9) { actionButtonText = "Preencher Questionário"; ActionIcon = Stethoscope; }
        if (missingStep === 10) { actionButtonText = "Dados de Pagamento"; ActionIcon = CreditCard; }

        return (
            <div className="animate-fade-in text-center p-8 bg-destructive/5 border border-destructive/30 rounded-xl mx-auto max-w-lg mt-8">
                
                <div className="p-4 bg-white rounded-full shadow-sm inline-flex mb-6">
                   {errorType === 'MISSING_DATA' ? (
                      <FileText className="h-10 w-10 text-primary" />
                   ) : (
                      <AlertTriangle className="h-10 w-10 text-destructive" />
                   )}
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">
                    {errorType === 'MISSING_DATA' ? 'Ação Necessária' : 'Falha no Processamento'}
                </h3>
                
                <p className="text-muted-foreground mb-8">{error}</p>
                
                {errorType === 'CPF_ERROR' && (
                    <div className="bg-background p-4 rounded-lg border border-border shadow-sm text-left space-y-4 mb-4">
                         <div className="space-y-1.5">
                            <Label htmlFor="fix-cpf">Corrigir CPF</Label>
                            <MaskedInput
                                id="fix-cpf"
                                mask="000.000.000-00"
                                value={tempCpf}
                                onAccept={(v: string) => setTempCpf(v)}
                                className="border-primary ring-primary"
                            />
                         </div>
                         <Button onClick={handleFixCpfAndRetry} className="w-full">
                            Salvar e Tentar Novamente
                         </Button>
                    </div>
                )}

                {errorType === 'MISSING_DATA' && missingStep && (
                    <Button 
                        onClick={() => setStep(missingStep)} 
                        size="lg"
                        className="gap-2 w-full sm:w-auto"
                    >
                        <ActionIcon className="w-4 h-4" />
                        {actionButtonText}
                    </Button>
                )}

                {errorType === 'API_ERROR' && (
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