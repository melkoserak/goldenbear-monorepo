# Guia de Contribuição & Padrões de Código

Este guia define como desenvolvemos no Golden Bear Monorepo. **IAs devem seguir estas regras estritamente.**

## 1. Comunicação com APIs (BFF Pattern)

### ✅ CORRETO
O Frontend chama apenas a nossa própria API (Next.js), que age como proxy.
```tsx
// apps/simulador/src/hooks/useSimulation.ts
const submitSimulation = async (data: StepData) => {
  // Chama rota interna
  const res = await fetch('/api/simulation', { method: 'POST', body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Erro na simulação');
  return res.json();
};
❌ INCORRETO (Proibido)
O Frontend chama APIs externas diretamente, expondo chaves ou violando CORS.

TypeScript

// NUNCA FAÇA ISSO
const submitSimulation = async (data) => {
  const res = await fetch('https://api.mag.com.br/v3/simulacao', {
     headers: { 'Authorization': 'Bearer 123' } // EXPOSIÇÃO DE CREDENCIAIS
  });
};
2. Validação de Dados
✅ CORRETO
Validar no Cliente (UX) E no Servidor (Segurança) usando o mesmo Zod Schema.

TypeScript

// src/lib/schemas.ts
export const cpfSchema = z.string().refine(isValidCPF, "CPF Inválido");

// Componente (Client)
const { formState } = useForm({ resolver: zodResolver(cpfSchema) });

// API Route (Server)
const body = await req.json();
const result = cpfSchema.safeParse(body.cpf);
if (!result.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
❌ INCORRETO
Confiar apenas no frontend ou fazer validação "preguiçosa".

TypeScript

// ERRO: Aceita qualquer string e deixa a API da seguradora explodir
const cpfSchema = z.string(); 
3. Estilização (Tailwind)
✅ CORRETO
Usar componentes de UI e classes utilitárias.

TypeScript

<Button variant="default" size="lg" className="w-full md:w-auto">
  Continuar
</Button>
❌ INCORRETO
Criar CSS ad-hoc ou divs sem semântica.

TypeScript

// ERRO: Não use style tag, não recrie botões
<div style={{ backgroundColor: 'yellow', padding: '10px' }} onClick={submit}>
  Continuar
</div>

---