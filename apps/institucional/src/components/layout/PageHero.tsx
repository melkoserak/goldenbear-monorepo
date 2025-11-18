import React from 'react';
import { 
  Section, 
  Container, 
  Typography 
} from "@goldenbear/ui";

type PageHeroProps = {
  tag: string;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  ctaNode?: React.ReactNode; // Prop opcional para o botão CTA
};

/**
 * Hero padronizado para todas as páginas internas (exceto Homepage).
 * Usa o variant="accent" (cinza claro) com um tag, título e subtítulo.
 */
export const PageHero = ({ tag, title, subtitle, ctaNode }: PageHeroProps) => {
  return (
    <Section variant="accent" padding="default">
      {/* 1. Alteração do User APROVADA: Removido max-w-3xl para consistência */}
      <Container className="text-left">
        
        {/* 2. Alteração da Tag CORRIGIDA para contraste */}
        <Typography 
          variant="small" 
          as="div" 
          color="default" 
          className={
            "inline-block bg-border text-foreground py-1.5 px-4 rounded-full tracking-wider"
          }
        >
          {tag}
        </Typography>
        
        <Typography variant="display" color="primary" className="mt-6 mb-4 max-w-2xl">
          {title}
        </Typography>
        
        {/* 3. Alteração do User APROVADA: max-w-2xl para legibilidade */}
        <Typography variant="large" color="default" className="max-w-2xl">
          {subtitle}
        </Typography>
        
        {/* Se um CTA for fornecido, ele será renderizado aqui */}
        {ctaNode && (
          <div className="mt-8">
            {ctaNode}
          </div>
        )}
      </Container>
    </Section>
  );
};