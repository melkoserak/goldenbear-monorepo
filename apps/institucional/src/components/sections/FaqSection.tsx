import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@goldenbear/ui/components/accordion';
import { Section } from '@goldenbear/ui/components/section';
import { Container } from '@goldenbear/ui/components/container';
import { Typography } from '@goldenbear/ui/components/typography';
// 1. Remova a importação do 'next/image' se não for mais usada
// import Image from 'next/image';
// 2. Adicione o ícone do Lucide
import { HelpCircle } from 'lucide-react';

// Seus dados do front-page.php
const faqs = [
  {
    q: 'O seguro cobre acidentes ocorridos fora do horário de serviço?',
    a: 'Sim, geralmente a cobertura é válida 24 horas por dia, em serviço ou fora dele, conforme as condições gerais da sua apólice. É importante verificar os detalhes específicos do plano contratado.',
  },
  {
    q: 'Como funciona a cobertura durante missões ou destacamentos no Brasil e exterior?',
    a: 'A maioria dos nossos planos mantém a cobertura durante missões e destacamentos. Recomendamos confirmar as condições específicas para viagens ou missões internacionais antes do embarque.',
  },
  {
    q: 'O processo de contratação exige muitos exames médicos ou documentos complicados?',
    a: 'Não. Para a maioria dos planos e capitais segurados, a contratação é simplificada, baseada em uma Declaração Pessoal de Saúde (DPS), sem necessidade de exames complexos, agilizando o processo.',
  },
  // ... (outras perguntas do front-page.php)
];

export const FaqSection = () => {
  return (
    <Section variant="default">
      <Container className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="faq-intro">
          {/* 3. Substitua a div do ícone */}
          <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
            <HelpCircle className="w-8 h-8" />
          </div>
          
          <Typography variant="h2">
            Perguntas frequentes
          </Typography>
        </div>
        
        <div className="faq-accordion md:col-span-2">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                {/* AccordionTrigger e Content provavelmente já estilizam o texto internamente, 
                    mas podemos garantir que o conteúdo seja tipografado corretamente */}
                <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                <AccordionContent>
                  <Typography variant="body" color="muted">
                    {faq.a}
                  </Typography>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </Section>
  );
};