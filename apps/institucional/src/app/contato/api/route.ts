import { NextResponse } from 'next/server';
import { z } from 'zod';

// --- REMOVIDO: Imports do Upstash (Rate Limit) ---
// import { Ratelimit } from '@upstash/ratelimit';
// import { Redis } from '@upstash/redis';

const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    // --- REMOVIDO: Lógica de Rate Limit ---
    // Se quiser reativar no futuro, precisa das chaves no .env
    
    const body = await request.json();
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Dados inválidos." },
        { status: 400 }
      );
    }

    const { name, email, subject, message, phone } = result.data;

    // AQUI: Implementar o envio real de e-mail (ex: Resend, SendGrid, Nodemailer)
    // Por enquanto, apenas simulamos um sucesso com um log
    console.log(`[Formulário Contato] De: ${name} <${email}> | Assunto: ${subject}`);
    console.log(`Mensagem: ${message}`);

    // Simula delay de rede
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Erro no formulário:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar mensagem." },
      { status: 500 }
    );
  }
}