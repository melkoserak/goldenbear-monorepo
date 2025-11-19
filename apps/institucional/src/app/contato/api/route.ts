import { NextResponse } from 'next/server';
import { z } from 'zod';

// 1. Definição do Schema de Validação
const contactFormSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  email: z.string().email("Formato de e-mail inválido."),
  phone: z.string().min(10, "Telefone deve ter DDD + número."),
  subject: z.string().min(3, "O assunto é muito curto."),
  message: z.string().min(10, "A mensagem deve ter pelo menos 10 caracteres."),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 2. Validação com Zod
    const data = contactFormSchema.parse(body);

    // --- Simulação de Envio ---
    console.log("--- NOVO LEAD VALIDADO (ZOD) ---");
    console.log("Dados:", data);
    console.log("--------------------------------");

    await new Promise(resolve => setTimeout(resolve, 1000)); 

    return NextResponse.json({ 
      success: true, 
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.' 
    });

  } catch (error) {
    // 3. Tratamento de Erros de Validação
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Dados inválidos.', 
        // --- CORREÇÃO: Usar .issues ---
        details: error.issues.map(e => e.message) 
      }, { status: 400 });
    }

    console.error("Erro interno:", error);
    return NextResponse.json({ 
      error: 'Ocorreu um erro interno no servidor.' 
    }, { status: 500 });
  }
}