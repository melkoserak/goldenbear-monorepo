import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@goldenbear/ui/components/button";
import { MAG_Logger } from "@/lib/mag-api/logger";

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
  onReset?: () => void; // Função para rodar ao clicar em "Tentar Novamente"
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // Ciclo de vida: Atualiza o estado para mostrar a UI de fallback na próxima renderização
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  // Ciclo de vida: Logar o erro (Aqui conectamos com o nosso Logger ou Sentry)
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    MAG_Logger.error("Uncaught Error in Component Tree", error, {
      componentStack: errorInfo.componentStack,
    });
  }

  public resetErrorBoundary = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-destructive/50 rounded-lg bg-destructive/5 animate-fade-in">
          <div className="p-3 bg-white rounded-full shadow-sm mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Ops! Algo deu errado.
          </h3>
          
          <p className="text-muted-foreground text-sm mb-6 max-w-md">
            {this.props.fallbackMessage || 
             "Não foi possível carregar este componente. Pode ser uma instabilidade temporária ou falha de conexão."}
          </p>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Recarregar Página
            </Button>
            
            <Button 
              onClick={this.resetErrorBoundary}
              className="gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Tentar Novamente
            </Button>
          </div>
          
          {/* Em desenvolvimento, mostramos o erro técnico */}
          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <pre className="mt-8 p-4 bg-slate-950 text-slate-50 text-xs text-left rounded overflow-auto max-w-full w-full">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}