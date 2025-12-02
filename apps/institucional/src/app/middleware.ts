import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  // Cria uma política CSP rigorosa
  // script-src: permite 'self', domínios confiáveis E o nosso 'nonce'
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: http: 'unsafe-inline';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https:;
    font-src 'self' data: https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  const requestHeaders = new Headers(request.headers);
  
  // Passa o nonce para ser lido no layout via headers (truque do Next.js)
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Define o header na resposta para o navegador impor as regras
  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
}

export const config = {
  matcher: [
    /*
     * Aplica a todas as rotas, exceto:
     * - api (rotas de API)
     * - _next/static (ficheiros estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico (ícone)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};