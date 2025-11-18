import { NextResponse } from 'next/server';

// Esta é a sua API Route, que corre no servidor.
// Ela será acessível em /contato/api
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // --- Validação de Dados (Simples) ---
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ 
        error: 'Preencha todos os campos obrigatórios.' 
      }, { status: 400 });
    }

    // --- Simulação de Envio de Email ---
    // (Substitua esta secção pelo seu serviço de email real, ex: Resend, SendGrid)
    console.log("--- NOVO LEAD (FORMULÁRIO DE CONTATO) ---");
    console.log("Nome:", name);
    console.log("Email:", email);
    console.log("Assunto:", subject);
    console.log("Mensagem:", message);
    console.log("-----------------------------------------");

    // Simula o atraso da rede
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    
    // Simular um erro (descomente para testar)
    // return NextResponse.json({ error: 'Falha simulada no servidor.' }, { status: 500 });

    // Resposta de Sucesso
    return NextResponse.json({ 
      success: true, 
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.' 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ 
      error: 'Ocorreu um erro interno no servidor.' 
    }, { status: 500 });
  }
}