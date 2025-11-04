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
 * Logger estruturado do lado do servidor (BFF).
 * Emite logs como JSON para fácil análise em produção.
 * Tradução do class-mag-logger.php.
 */
class Logger {
  private log(level: LogLevel, message: string, context: object = {}) {
    // Não registrar logs de DEBUG em produção para não poluir
    if (level === LogLevel.DEBUG && process.env.NODE_ENV === 'production') {
      return;
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };

    // Formata a saída como JSON
    const logOutput = `[MAG_SIMULATOR_BFF] ${JSON.stringify(logEntry)}`;

    // Direciona para o console apropriado
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

  // --- Métodos Públicos ---

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
    // Trata o erro para que ele seja serializável
    const errorContext = {
      ...context,
      errorMessage: (error instanceof Error) ? error.message : String(error),
      errorStack: (error instanceof Error) ? error.stack : undefined,
    };
    this.log(LogLevel.ERROR, message, errorContext);
  }
}

/**
 * Instância singleton do Logger para uso em todo o backend.
 */
export const MAG_Logger = new Logger();