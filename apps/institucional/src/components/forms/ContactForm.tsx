"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Typography, Button, Input, Textarea, Label } from "@goldenbear/ui";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(3, "Digite seu nome completo."),
  email: z.string().email("E-mail inválido."),
  phone: z.string().min(10, "Telefone inválido."),
  subject: z.string().min(3, "Assunto muito curto."),
  message: z.string().min(10, "A mensagem deve ter pelo menos 10 caracteres."),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur", // Considerar mudar para 'onChange' após o primeiro submit para melhor UX
  });

  const onSubmit = async (data: ContactFormData) => {
    setServerError(null);
    try {
      const response = await fetch('/contato/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Erro ao enviar.');

      setIsSuccess(true);
      reset();
      setTimeout(() => setIsSuccess(false), 5000);

    } catch (error) {
      setServerError("Erro ao enviar. Tente novamente ou chame no WhatsApp.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Typography variant="h2" color="primary">Envie uma Mensagem</Typography>
        <Typography variant="body" color="muted">
          Preencha o formulário abaixo e retornaremos em breve.
        </Typography>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="name">Nome Completo <span className="text-destructive">*</span></Label>
          <Input 
            id="name" 
            placeholder="Seu nome completo" 
            className={errors.name ? "border-destructive" : ""}
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name && <span className="text-sm text-destructive">{errors.name.message}</span>}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail <span className="text-destructive">*</span></Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="seu.email@exemplo.com" 
              className={errors.email ? "border-destructive" : ""}
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && <span className="text-sm text-destructive">{errors.email.message}</span>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Telefone</Label>
            <Input 
              id="phone" 
              type="tel" 
              placeholder="(XX) 99999-9999" 
              className={errors.phone ? "border-destructive" : ""}
              {...register("phone")}
            />
             {errors.phone && <span className="text-sm text-destructive">{errors.phone.message}</span>}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="subject">Assunto <span className="text-destructive">*</span></Label>
          <Input 
            id="subject" 
            placeholder="Ex: Dúvida sobre cobertura" 
            className={errors.subject ? "border-destructive" : ""}
            {...register("subject")}
          />
          {errors.subject && <span className="text-sm text-destructive">{errors.subject.message}</span>}
        </div>
        
        <div className="space-y-1.5">
          <Label htmlFor="message">Mensagem <span className="text-destructive">*</span></Label>
          <Textarea 
            id="message" 
            placeholder="Escreva sua mensagem aqui..." 
            className={errors.message ? "border-destructive" : ""}
            {...register("message")}
          />
          {errors.message && <span className="text-sm text-destructive">{errors.message.message}</span>}
        </div>
        
        <div className="pt-2 space-y-4">
          <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
          </Button>

          {/* Feedback de Sucesso Refatorado */}
          {isSuccess && (
            <div className="flex items-center gap-3 rounded-md border border-success/20 bg-success-light p-4 text-success animate-in fade-in slide-in-from-bottom-2">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <Typography variant="small" className="font-medium text-success">
                Mensagem enviada com sucesso!
              </Typography>
            </div>
          )}
          
          {/* Feedback de Erro (Mantido com tokens destructive existentes) */}
          {serverError && (
            <div className="flex items-center gap-3 rounded-md border border-destructive/20 bg-destructive/10 p-4 text-destructive animate-in fade-in">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <Typography variant="small" className="font-medium text-destructive">
                {serverError}
              </Typography>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};