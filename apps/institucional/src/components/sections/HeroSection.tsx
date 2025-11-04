import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@goldenbear/ui/components/button';

// Interface com as props (propriedades) que o componente recebe
interface HeroSectionProps {
  label: string;
  title: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  imageAlt: string;
}

export const HeroSection = ({
  label,
  title,
  ctaText,
  ctaLink,
  imageUrl,
  imageAlt,
}: HeroSectionProps) => {
  return (
    // A seção agora tem um padding vertical padrão
    <section id="hero" className="bg-background py-16 md:py-24">
      {/* Container principal de 1280px. 
        Todo o conteúdo (texto e imagem) fica dentro dele.
      */}
      <div className="container mx-auto max-w-[1280px] px-6">
        {/* Grid 50/50 para alinhar texto e imagem lado a lado.
          'gap-12' adiciona espaço entre eles.
          'items-center' alinha verticalmente.
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Coluna de Texto */}
          <div className="order-2 md:order-1 text-center md:text-left">
            <p className="block text-base font-bold text-primary">
              {label}
            </p>
            <h1 className="mt-3 mb-7 text-4xl font-bold leading-tight text-foreground md:text-5xl">
              {title}
            </h1>
            <div className="hero-cta-container">
              <Button asChild size="lg">
                <Link href={ctaLink}>
                  {ctaText}
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Coluna de Imagem */}
          <div className="order-1 md:order-2">
            <Image
              src={imageUrl}
              alt={imageAlt}
              width={800} // Proporção (ex: 8)
              height={700} // Proporção (ex: 7)
              className="h-auto w-full rounded-lg shadow-md" // Imagem responsiva
              priority // Importante para SEO e LCP (performance)
            />
          </div>

        </div>
      </div>
    </section>
  );
};