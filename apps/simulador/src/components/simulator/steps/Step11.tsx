"use client";
import React, { useState } from 'react';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { track } from '@/lib/tracking';
import { Loader2, PenTool, ShieldCheck, Mail, AlertTriangle } from 'lucide-react';
import { Button } from '@goldenbear/ui/components/button';
import { Input } from '@goldenbear/ui/components/input';
import { StepLayout } from '../StepLayout';

export const Step11 = () => {
    const { formData, actions: { nextStep, setFormData } } = useSimulatorStore();
    
    // Estados locais
    const [stepState, setStepState] = useState<'initial' | 'input_code'>('initial');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tokenCode, setTokenCode] = useState('');

    // Mascarar email para privacidade (ex: jo***@gmail.com)
    const maskedEmail = formData.email.replace(/(.{2})(.*)(@.*)/, "$1***$3");

    const handleRequestToken = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/simulador/api/signature/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
    username: formData.cpf.replace(/\D/g, ''),
    channel: 'SMS' // <--- TENTE ISTO
})
            });
            
            if (!res.ok) throw new Error('Não foi possível enviar o código.');
            
            track('signature_token_requested', { channel: 'Email' });
            setStepState('input_code');
        } catch (e) {
            setError("Erro ao solicitar código. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyToken = async () => {
        if (tokenCode.length < 6) return;
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/simulador/api/signature/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username: formData.cpf.replace(/\D/g, ''),
                    document: formData.cpf.replace(/\D/g, ''),
                    email: formData.email,
                    name: formData.fullName,
                    phone: formData.phone,
                    tokenCode: tokenCode
                })
            });

            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error || 'Código inválido.');

            // Sucesso! Salva o token e avança
            setFormData({ signatureToken: tokenCode });
           track('signature_success', {});
            nextStep(); // Vai para o Step 12 (Processamento)

        } catch (e) {
            setError("Código inválido ou expirado. Verifique e tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <StepLayout 
            title="Assinatura Digital" 
            description="Para sua segurança, valide sua identidade para finalizar a contratação."
        >
            <div className="flex flex-col items-center justify-center py-6 max-w-md mx-auto w-full">
                
                <div className="mb-8 p-4 bg-primary/5 rounded-full">
                    <PenTool className="h-10 w-10 text-primary" />
                </div>

                {stepState === 'initial' ? (
                    <div className="w-full space-y-6 text-center animate-fade-in">
                        <div className="bg-card border rounded-lg p-6 space-y-4 shadow-sm">
                            <h4 className="font-semibold text-foreground">Como funciona?</h4>
                            <p className="text-sm text-muted-foreground">
                                Enviaremos um código de 6 dígitos para o seu e-mail cadastrado.
                                Esse código servirá como sua assinatura digital legal para a apólice.
                            </p>
                            
                            <div className="flex items-center gap-3 p-3 bg-muted rounded-md text-sm text-left">
                                <Mail className="h-5 w-5 text-primary shrink-0" />
                                <div>
                                    <p className="font-medium">E-mail Cadastrado</p>
                                    <p className="text-muted-foreground">{maskedEmail}</p>
                                </div>
                            </div>
                        </div>

                        <Button 
                            onClick={handleRequestToken} 
                            size="lg" 
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                            Enviar Código de Segurança
                        </Button>
                    </div>
                ) : (
                    <div className="w-full space-y-6 text-center animate-fade-in">
                        <div>
                            <h4 className="text-lg font-semibold">Digite o código recebido</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                                Enviado para {maskedEmail}
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <Input 
                                value={tokenCode}
                                onChange={(e) => setTokenCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="0 0 0 0 0 0"
                                className="text-center text-3xl tracking-[0.5em] h-16 w-64 font-mono border-primary/50 focus:border-primary"
                                maxLength={6}
                                autoFocus
                            />
                        </div>

                        <Button 
                            onClick={handleVerifyToken} 
                            size="lg" 
                            className="w-full"
                            disabled={tokenCode.length < 6 || isLoading}
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Validar e Finalizar Contratação"}
                        </Button>

                        <button 
                            onClick={() => { setStepState('initial'); setError(null); }}
                            className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4"
                        >
                            Não recebi o código / Alterar método
                        </button>
                    </div>
                )}

                {error && (
                    <div className="mt-6 p-3 w-full bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md flex items-center gap-2 animate-in slide-in-from-top-2">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        {error}
                    </div>
                )}
            </div>
        </StepLayout>
    );
};