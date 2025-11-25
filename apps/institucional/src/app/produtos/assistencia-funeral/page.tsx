import { Metadata } from "next";
import { 
  ShieldCheck,     // <-- Ícone
  Users,           // <-- Ícone
  ClipboardCheck,  // <-- Ícone
} from "lucide-react";

import { ProductPageLayout } from "@/components/layout/ProductPageLayout";

export const metadata: Metadata = {
  title: "Assistência Funeral | Golden Bear Seguros",
  description: "Um ato de cuidado que ampara sua família no momento mais difícil, cuidando de toda a burocracia e despesas. Contrate online de forma simples.",
  openGraph: {
    title: "Assistência Funeral | Golden Bear Seguros",
    description: "Cuidado e respeito para sua família no momento mais difícil."
  }
};

export default function AssistenciaFuneralPage() {
  const pageData = {
    hero: {
      tag: "Amparo e Respeito",
      title: "Assistência Funeral Familiar",
      subtitle: "Um ato de cuidado que ampara sua família no momento mais difícil, cuidando de toda a burocracia e despesas para que possam focar apenas na despedida."
    },
    keyBenefits: {
      title: "Por que esta cobertura é um ato de cuidado?",
      subtitle: "No momento de luto, questões financeiras e burocráticas são um fardo enorme. A assistência funeral resolve isso de forma imediata.",
      features: [
        {
          icon: ShieldCheck,
          title: "Amparo Burocrático",
          description: "A seguradora cuida de toda a documentação, registros e autorizações necessárias, aliviando a família de processos desgastantes."
        },
        {
          icon: Users,
          title: "Cuidado com a Família",
          description: "Garante uma despedida digna, cobrindo custos de sepultamento ou cremação, urna, ornamentação e transporte, em todo o Brasil."
        },
        {
          icon: ClipboardCheck,
          title: "Planejamento",
          description: "Contratar em vida é uma forma de planejamento sucessório que evita despesas inesperadas e garante que suas vontades sejam respeitadas."
        }
      ]
    },
    coverage: {
      title: "O que a Assistência Funeral cobre?",
      subtitle: "Uma cobertura completa para garantir que nada falte, em conformidade com o padrão de serviço contratado.",
      lists: [
        {
          title: "Serviços Inclusos",
          items: [
            "Urna mortuária (caixão).",
            "Preparação e higienização do corpo.",
            "Ornamentação com flores.",
            "Taxas de sepultamento ou cremação.",
            "Traslado nacional do corpo (até o município de residência).",
            "Registro de óbito e documentação."
          ]
        },
        {
          title: "Cobertura Familiar",
          items: ["A cobertura pode ser estendida para cônjuge, filhos e pais, conforme o plano contratado."]
        }
      ]
    }
  };

  return (
    <ProductPageLayout {...pageData} />
  );
}