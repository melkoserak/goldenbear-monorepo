import { Calculator, FileText, PencilLine } from 'lucide-react';

export const HowToSection = () => {
  return (
    <section className="py-20 bg-accent">
      <div className="container">
        {/* Cabeçalho da Seção */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold leading-tight text-foreground">
            Como Contratar seu Seguro de Vida em 3 Passos Simples
          </h2>
        </div>
        
        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-[40px_1fr] gap-x-4">
            
            {/* --- Passo 1 --- */}
            <div className="flex flex-col items-center gap-2 pt-3">
              <div className="flex items-center justify-center size-10 rounded-full bg-primary/20 text-primary">
                <Calculator className="w-5 h-5" />
              </div>
              <div className="w-px bg-primary/30 grow"></div>
            </div>
            <div className="flex flex-1 flex-col pb-10 pt-3">
              <p className="text-lg font-bold text-foreground">
                1. Simule e Escolha
              </p>
              <p className="text-muted-foreground">
                Use nosso simulador para encontrar o plano ideal para você e sua
                família, de forma rápida e transparente.
              </p>
            </div>

            {/* --- Passo 2 --- */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-px bg-primary/30 grow"></div>
              <div className="flex items-center justify-center size-10 rounded-full bg-primary/20 text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <div className="w-px bg-primary/30 grow"></div>
            </div>
            <div className="flex flex-1 flex-col py-10">
              <p className="text-lg font-bold text-foreground">
                2. Preencha seus Dados
              </p>
              <p className="text-muted-foreground">
                Complete suas informações pessoais e a declaração de saúde de
                forma 100% segura em nosso ambiente protegido.
              </p>
            </div>

            {/* --- Passo 3 --- */}
            <div className="flex flex-col items-center gap-2 pb-3">
              <div className="w-px bg-primary/30 grow"></div>
              <div className="flex items-center justify-center size-10 rounded-full bg-primary/20 text-primary">
                <PencilLine className="w-5 h-5" />
              </div>
            </div>
            <div className="flex flex-1 flex-col pt-10">
              <p className="text-lg font-bold text-foreground">
                3. Assine Digitalmente
              </p>
              <p className="text-muted-foreground">
                Finalize o processo com a assinatura digital e configure o
                pagamento com facilidade. Sua apólice é emitida na hora.
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};