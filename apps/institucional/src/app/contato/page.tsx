import { Metadata } from "next";
import Link from "next/link";
import { 
  Section, 
  Container, 
  Typography, 
  Button
} from "@goldenbear/ui";
import { Mail, Phone, MessageSquareText } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero"; // <-- 1. Importar o PageHero
import { ContactForm } from "@/components/forms/ContactForm";

// 1. SEO (sem alterações)
export const metadata: Metadata = {
  title: "Contato | Golden Bear Seguros",
  description: "Fale conosco através dos nossos canais de atendimento. Envie sua mensagem, tire dúvidas ou fale com um especialista pelo WhatsApp.",
  openGraph: {
    title: "Contato | Golden Bear Seguros",
    description: "Estamos prontos para atender você."
  }
};

// 2. Componente InfoLinha (sem alterações)
const InfoLinha = ({ icon: Icon, title, children }: any) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 p-3 bg-accent rounded-lg">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div>
      <Typography variant="h4" className="mb-1">{title}</Typography>
      <Typography variant="body" color="muted">
        {children}
      </Typography>
    </div>
  </div>
);

// Estrutura da Página
export default function ContatoPage() {
  return (
    <>
      <PageHero
        tag="Fale Conosco"
        title="Estamos prontos para ajudar"
        subtitle="Estamos prontos para tirar todas as suas dúvidas e ajudar você a encontrar a proteção ideal. Escolha o canal de sua preferência."
      />

      <Section padding="lg">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Coluna da Esquerda: Canais Diretos (sem alterações) */}
            <div className="space-y-8">
              <Typography variant="h2" color="primary">
                Canais de Atendimento
              </Typography>
              <Typography variant="body" color="muted" className="-mt-4">
                Prefere uma resposta mais rápida? Entre em contato por aqui.
              </Typography>

              <div className="space-y-6">
                <InfoLinha icon={MessageSquareText} title="WhatsApp">
                  Nosso canal principal para um atendimento rápido e digital.
                  <br />
                  <Button asChild variant="link" className="p-0 h-auto mt-2">
                    <Link href="#" target="_blank" rel="noopener noreferrer">
                      Iniciar Conversa Agora
                    </Link>
                  </Button>
                </InfoLinha>

                <InfoLinha icon={Phone} title="Telefone">
                  (11) 9999-9999
                  <br />
                  <span className="text-sm">Seg. a Sex. das 9h às 18h.</span>
                </InfoLinha>

                <InfoLinha icon={Mail} title="E-mail">
                  contato@goldenbear.com.br
                  <br />
                  <span className="text-sm">Respondemos em até 24h úteis.</span>
                </InfoLinha>
              </div>
            </div>

            {/* --- 2. SUBSTITUIR O FORMULÁRIO ESTÁTICO --- */}
            {/* A lógica do formulário agora está encapsulada */}
            <ContactForm />
            {/* --- FIM DA SUBSTITUIÇÃO --- */}

          </div>
        </Container>
      </Section>
    </>
  );
}