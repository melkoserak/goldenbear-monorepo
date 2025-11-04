import {
  Shield,
  HeartHandshake,
  HeartPulse,
  GraduationCap,
  Landmark,
} from "lucide-react";

// Dados dos benefícios, agora como um array de objetos
const beneficios = [
  {
    icon: Shield,
    text: "Cobertura para riscos inerentes à atividade militar.",
  },
  {
    icon: HeartHandshake,
    text: "Amparo financeiro em caso de invalidez por acidente em serviço ou fora dele.",
  },
  {
    icon: HeartPulse,
    text: "Suporte para doenças graves que podem surgir.",
  },
  {
    icon: GraduationCap,
    text: "Garantia de educação dos filhos e manutenção do lar.",
  },
  {
    icon: Landmark,
    text: "Indenização que complementa pensões e outros benefícios.",
  },
];

export const BeneficiosExercitoSection = () => {
  return (
    // Tradução de .beneficios-exercito-section
    <section className="bg-primary text-white py-20 md:py-24">
      <div className="container mx-auto max-w-[1280px] px-6">
        {/* Tradução de .beneficios-exercito-texto-superior-grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-20">
          <div className="md:col-span-1">
            {/* Tradução de .beneficios-exercito-texto-bloco h3 */}
            <h3 className="text-2xl font-semibold leading-snug md:border-r md:border-secondary pr-4">
              Você, militar brasileiro, dedica sua vida à proteção da nação.
            </h3>
          </div>
          <div className="md:col-span-2 flex items-center">
            <p className="text-lg text-white/90">
              Na Golden Bear Seguros, reconhecemos seu compromisso e oferecemos
              um Seguro de Vida Militar robusto, desenhado para garantir a
              segurança financeira e a tranquilidade da sua família.
            </p>
          </div>
        </div>

        {/* Tradução de .beneficios-exercito-subtitulo */}
        <div className="text-center mb-20">
          <h3 className="text-xl md:text-2xl font-medium text-white/90 max-w-2xl mx-auto">
            Entenda por que nosso seguro é a escolha inteligente para quem serve
            ao Brasil.
          </h3>
        </div>

        {/* Tradução de .beneficios-exercito-grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-12">
          {beneficios.map((beneficio, index) => (
            // Tradução de .beneficio-item
            <div key={index} className="flex flex-col items-center text-center md:items-start md:text-left">
              {/* Tradução de .beneficio-icon */}
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-secondary mb-4 shadow-md">
                <beneficio.icon className="h-8 w-8 text-text-color" aria-hidden="true" />
              </div>
              <p className="text-base font-medium text-white/90">
                {beneficio.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};