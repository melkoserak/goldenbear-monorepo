import Image from 'next/image';
// Importa o Accordion do pacote de UI, não de um arquivo local
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@goldenbear/ui/components/accordion'; // <-- CORREÇÃO: Importa do pacote

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
    <section className="faq-section py-16 md:py-32">
      <div className="faq-layout grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Coluna do Título */}
        <div className="faq-intro">
          <div className="faq-icon mb-4 text-primary"> {/* Usa cor do Tailwind */}
            <Image src="/imagens/icon-info-circle.svg" alt="" width={32} height={32} />
          </div>
          <h2 className="faq-title text-3xl font-bold text-text">
            Perguntas frequentes
          </h2>
        </div>
        
        {/* Coluna do Acordeão */}
        <div className="faq-accordion md:col-span-2">
          {/* O componente Accordion agora vem do seu Design System */}
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>
                  <p>{faq.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};