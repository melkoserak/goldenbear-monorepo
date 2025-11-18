"use client"; // <-- Marca este como um Client Component

import { useState } from "react";
import { 
  Typography, 
  Button, 
  Input, 
  Textarea,
  Label 
} from "@goldenbear/ui";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";

// Tipo para o estado da mensagem de feedback
type FormMessage = {
  type: 'success' | 'error';
  text: string;
} | null;

export const ContactForm = () => {
  // Estado para os campos do formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  
  // Estado para o feedback (loading, success, error)
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState<FormMessage>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFormMessage(null); // Limpa mensagens antigas

    try {
      const response = await fetch('/contato/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Falha ao enviar mensagem.');
      }

      // Sucesso
      setFormMessage({ type: 'success', text: result.message });
      setFormData({ // Limpa o formulário
        name: '', email: '', phone: '', subject: '', message: '',
      });

    } catch (error) {
      const err = error as Error;
      setFormMessage({ type: 'error', text: err.message || 'Não foi possível enviar sua mensagem. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Typography variant="h2" color="primary">
        Envie uma Mensagem
      </Typography>
      <Typography variant="body" color="muted" className="-mt-4">
        Para dúvidas detalhadas, preencha o formulário abaixo e retornaremos o mais breve possível.
      </Typography>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="name">
            Nome Completo <span className="text-destructive">*</span>
          </Label>
          <Input 
            id="name" 
            placeholder="Seu nome completo" 
            value={formData.name}
            onChange={handleChange}
            required 
            disabled={isLoading}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">
              E-mail <span className="text-destructive">*</span>
            </Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="seu.email@exemplo.com" 
              value={formData.email}
              onChange={handleChange}
              required 
              disabled={isLoading}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Telefone</Label>
            <Input 
              id="phone" 
              type="tel" 
              placeholder="(XX) XXXXX-XXXX" 
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="subject">
            Assunto <span className="text-destructive">*</span>
          </Label>
          <Input 
            id="subject" 
            placeholder="Ex: Dúvida sobre cobertura" 
            value={formData.subject}
            onChange={handleChange}
            required 
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-1.5">
          <Label htmlFor="message">
            Mensagem <span className="text-destructive">*</span>
          </Label>
          <Textarea 
            id="message" 
            placeholder="Escreva sua mensagem aqui..." 
            value={formData.message}
            onChange={handleChange}
            required 
            disabled={isLoading}
          />
        </div>
        
        <div className="pt-2 space-y-4">
          <Button 
            type="submit" 
            size="lg" 
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isLoading ? 'A Enviar...' : 'Enviar Mensagem'}
          </Button>

          {/* Feedback de Sucesso/Erro */}
          {formMessage && (
            <div 
              className={`flex items-center gap-3 rounded-md border p-4 ${
                formMessage.type === 'success' 
                  ? 'border-green-500/20 bg-green-500/10 text-green-700' 
                  : 'border-destructive/20 bg-destructive/10 text-destructive'
              }`}
            >
              {formMessage.type === 'success' ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              )}
              <Typography variant="small" color="default" className="font-medium">
                {formMessage.text}
              </Typography>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};