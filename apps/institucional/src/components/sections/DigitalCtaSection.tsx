import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@goldenbear/ui/components/button';
import { Section } from '@goldenbear/ui/components/section';
import { Container } from '@goldenbear/ui/components/container';
import { Typography } from '@goldenbear/ui/components/typography';
import { 
  Smartphone, 
  Zap, 
  FileSignature, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

// Features destacadas para leitura rápida
const digitalFeatures = [
  { icon: Zap, text: "Cotação em 2 minutos" },
  { icon: Smartphone, text: "100% pelo celular" },
  { icon: FileSignature, text: "Assinatura eletrônica" },
];

export const DigitalCtaSection = () => {
  return (
    <Section variant="accent" className="overflow-hidden">
      <Container className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* --- COLUNA DA IMAGEM --- */}
        <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end order-1 lg:order-1">
           
           <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl transform scale-90 translate-y-4" />
           
          <div className="relative z-10 w-full max-w-[500px]">
             <Image 
                className="w-full h-auto drop-shadow-2xl transition-transform duration-700 hover:scale-105" 
                src="/imagens/familia-foto-segurados.png"
                alt="Família feliz protegida pela Golden Bear"
                width={680}
                height={696}
                sizes="(max-width: 1024px) 100vw, 580px"
                priority={false}
              />
              
              {/* Floating Card Corrigido: Removido o 'flex' duplicado */}
              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-border/50 items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 hidden sm:flex">
                 <div className="bg-green-100 p-2.5 rounded-full text-green-600 shadow-sm">
                    <CheckCircle2 className="w-6 h-6" strokeWidth={3} />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-foreground leading-none mb-1">Aprovação Rápida</p>
                    <p className="text-xs text-muted-foreground font-medium">Sem papelada física</p>
                 </div>
              </div>
          </div>
        </div>

        {/* --- COLUNA DE CONTEÚDO --- */}
        <div className="w-full lg:w-1/2 flex flex-col items-start gap-8 order-2 lg:order-2">
          <div className="space-y-6">
             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-border shadow-sm text-primary text-xs font-bold uppercase tracking-wider">
                <Smartphone className="w-3 h-3" />
                Experiência 100% Digital
             </div>
             
             <Typography variant="h2" color="primary" className="leading-tight">
               Contratação simplificada, <br />
               <span className="text-foreground">pensada para sua rotina.</span>
             </Typography>
             
             <Typography variant="body" className="text-lg text-muted-foreground leading-relaxed max-w-lg">
               Esqueça a burocracia dos bancos tradicionais. Desenvolvemos um processo seguro e adaptado à vida militar: sem exames complexos e sem perder tempo.
             </Typography>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
             {digitalFeatures.map((feature, idx) => (
               <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-transparent hover:border-primary/20 hover:shadow-sm transition-all">
                  <feature.icon className="w-5 h-5 text-primary" strokeWidth={2} />
                  <span className="text-sm font-semibold text-foreground">{feature.text}</span>
               </div>
             ))}
          </div>

          <div className="pt-4 w-full sm:w-auto">
            <Button asChild variant="default" size="hero" className="w-full sm:w-auto hover:shadow-primary/30 transition-all">
              <Link href="/simulador" className="flex items-center gap-2">
                Iniciar Simulação Digital
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <p className="mt-4 text-xs text-muted-foreground text-center sm:text-left">
               * Ambiente seguro e criptografado.
            </p>
          </div>
        </div>

      </Container>
    </Section>
  );
};