import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// 1. Captura as variáveis de ambiente
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

let ratelimit: Ratelimit | null = null;

// 2. Inicialização Condicional (Segura)
// Só tenta conectar se tivermos URL válida e Token.
// O "startsWith('https')" previne o erro "UrlError" que você viu.
if (redisUrl && redisUrl.startsWith('https://') && redisToken) {
  try {
    const redis = new Redis({
      url: redisUrl,
      token: redisToken,
    });

    ratelimit = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(10, '10 s'),
      analytics: true,
      prefix: '@upstash/ratelimit',
    });
  } catch (err) {
    console.warn("Falha ao inicializar Redis no build time:", err);
    // Mantém ratelimit como null
  }
}

export async function middleware(request: NextRequest) {
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');

  if (isApiRoute) {
    // 3. Fail Open: Se o Rate Limit não foi iniciado (ex: falta .env), permite o acesso.
    if (!ratelimit) {
      return NextResponse.next();
    }

    // Obtém o IP através do header padrão
    let ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
    
    if (ip.includes(',')) {
        ip = ip.split(',')[0].trim();
    }
    
    try {
      const { success, limit, reset, remaining } = await ratelimit.limit(ip);

      if (!success) {
        return NextResponse.json(
          { error: 'Muitas requisições. Por favor, tente novamente mais tarde.' },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            },
          }
        );
      }
      
      const res = NextResponse.next();
      res.headers.set('X-RateLimit-Remaining', remaining.toString());
      return res;

    } catch (error) {
      // Log estruturado para ferramentas de monitoramento (Sentry/Datadog/Vercel Logs)
      // O prefixo [CRITICAL_FAIL_OPEN] permite criar alertas automáticos
      console.error(JSON.stringify({
        level: 'error',
        type: 'RATE_LIMIT_FAILURE',
        message: 'Redis indisponível. Acesso liberado (Fail Open).',
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      }));
      
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
};