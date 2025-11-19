import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@goldenbear/ui/components/accordion';
import { Section } from '@goldenbear/ui/components/section';
import { Container } from '@goldenbear/ui/components/container';
import { Typography } from '@goldenbear/ui/components/typography';
import { HelpCircle } from 'lucide-react';
// 1. Importe os dados
import { faqData } from '@/lib/data/faqs';

export const FaqSection = () => {
  return (
    <Section variant="default">
      <Container className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="faq-intro">
          <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
            <HelpCircle className="w-8 h-8" />
          </div>
          
          <Typography variant="h2">
            Perguntas frequentes
          </Typography>
        </div>
        
        <div className="faq-accordion md:col-span-2">
          <Accordion type="single" collapsible className="w-full">
            {/* 2. Use os dados importados */}
            {faqData.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
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