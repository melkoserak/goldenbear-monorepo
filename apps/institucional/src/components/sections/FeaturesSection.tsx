import { Info, FileText, MapPin } from 'lucide-react'; // Ícones do Lucide
import Link from 'next/link';

// Dados da seção, extraídos do front-page.php
const features = [
  {
    icon: Info,
    title: "Proteção completa",
    description: "A proteção que você e sua família merecem com uma seguradora de mais de 30 anos de mercado.",
    link: "#",
  },
  {
    icon: FileText,
    title: "Aprovação rápida", // Título atualizado do PHP
    description: "Nossa aprovação é rápida e eficaz, a partir do momento que você aplicou até em um dia útil.",
    link: "#",
  },
  {
    icon: MapPin,
    title: "Proteção completa", // O PHP tem um título repetido
    description: "A proteção que você e sua família merecem com uma seguradora de mais de 30 anos de mercado.",
    link: "#",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="bg-accent py-20 md:py-24">
      <div className="container mx-auto max-w-[1280px] px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* 1. Adicione "index" ao map */}
          {features.map((feature, index) => (
            
            // 2. Use "index" como a key
            <div key={index} className="text-left md:text-center">
              
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <feature.icon className="h-8 w-8 text-text-color" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-text-light mb-4">
                {feature.description}
              </p>
              <Link href={feature.link} className="font-bold text-primary underline hover:text-primary/80">
                Saiba mais
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};