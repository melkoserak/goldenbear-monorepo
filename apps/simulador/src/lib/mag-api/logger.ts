/**
 * Níveis de Log
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Lista de chaves sensíveis que devem ser ofuscadas nos logs
 * --- ATUALIZAÇÃO DE SEGURANÇA ---
 * Adicionados campos de endereço, data de nascimento e variações comuns.
 */
const SENSITIVE_KEYS = [
  // Tokens e Autenticação
  'access_token', 'token', 'Authorization', 'payment_pre_auth_code', 
  
  // Dados Pessoais
  'cpf', 'email', 'nome', 'rg', 'documento', 'nascimento', 'birthdate',
  
  // Contato
  'celular', 'telefone', 
  
  // Endereço (PII Indireto)
  'logradouro', 'rua', 'numero', 'complemento', 'cep', 'bairro',
  
  // Dados Bancários/Cartão (se houver no futuro)
  'cartao', 'cvv', 'senha'
];

/**
 * Logger estruturado do lado do servidor (BFF).
 */
class Logger {
  /**
   * Remove dados sensíveis (PII) do objeto de contexto.
   */
  private sanitizeContext(context: any): any {
    if (!context || typeof context !== 'object') return context;
    
    if (Array.isArray(context)) {
      return context.map(item => this.sanitizeContext(item));
    }

    // Cria uma cópia rasa para não mutar o objeto original
    const sanitized: any = { ...context };

    for (const key in sanitized) {
      if (Object.prototype.hasOwnProperty.call(sanitized, key)) {
        // Verifica se a chave é sensível (case insensitive parcial)
        const lowerKey = key.toLowerCase();
        const isSensitive = SENSITIVE_KEYS.some(s => lowerKey.includes(s.toLowerCase()));

        if (isSensitive && typeof sanitized[key] === 'string') {
            // Mascara o valor mantendo apenas os primeiros 3 caracteres (ou ***)
            const val = sanitized[key];
            // Se for muito curto, mascara tudo. Se for longo, mostra prefixo.
            sanitized[key] = val.length > 10 ? `${val.substring(0, 3)}***` : '***';
        } else if (isSensitive && typeof sanitized[key] === 'number') {
            sanitized[key] = '***'; // Mascara números sensíveis também
        } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
            // Recursão para objetos aninhados (ex: payload com endereço dentro)
            sanitized[key] = this.sanitizeContext(sanitized[key]);
        }
      }
    }
    return sanitized;
  }

  private log(level: LogLevel, message: string, context: object = {}) {
    // Não registrar logs de DEBUG em produção para economizar recursos e reduzir ruído
    if (level === LogLevel.DEBUG && process.env.NODE_ENV === 'production') {
      return;
    }

    // Sanitiza o contexto antes de logar
    const safeContext = this.sanitizeContext(context);

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: safeContext,
    };

    // Adiciona prefixo para facilitar filtragem em ferramentas como CloudWatch/Datadog
    const logOutput = `[MAG_SIMULATOR_BFF] ${JSON.stringify(logEntry)}`;

    switch (level) {
      case LogLevel.ERROR:
        console.error(logOutput);
        break;
      case LogLevel.WARN:
        console.warn(logOutput);
        break;
      case LogLevel.DEBUG:
        console.debug(logOutput);
        break;
      case LogLevel.INFO:
      default:
        console.log(logOutput);
        break;
    }
  }

  public debug(message: string, context: object = {}) {
    this.log(LogLevel.DEBUG, message, context);
  }

  public info(message: string, context: object = {}) {
    this.log(LogLevel.INFO, message, context);
  }

  public warn(message: string, context: object = {}) {
    this.log(LogLevel.WARN, message, context);
  }

  public error(message: string, error: unknown, context: object = {}) {
    const errorContext = {
      ...context,
      errorMessage: (error instanceof Error) ? error.message : String(error),
      // Stack trace pode conter caminhos de arquivo, mas geralmente é seguro e vital para debug
      errorStack: (error instanceof Error) ? error.stack : undefined,
    };
    this.log(LogLevel.ERROR, message, errorContext);
  }
}

export const MAG_Logger = new Logger();