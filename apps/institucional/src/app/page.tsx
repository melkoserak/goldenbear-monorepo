// Importe os componentes de seção que você criará
import { HeroSection } from '@/components/sections/HeroSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { BenefitsSection } from '@/components/sections/BenefitsSection';
import { HowToSection } from '@/components/sections/HowToSection';
import { Vantagens } from '@/components/sections/Vantagens';  // <-- 1. IMPORTE A NOVA SEÇÃO
import { FaqSection } from '@/components/sections/FaqSection';
import { FadeInOnScroll } from '@/components/layout/FadeInOnScroll';
import { ForcesSection } from '@/components/sections/ForcesSection';
import { CtaSection } from '@/components/sections/CtaSection';
import { DigitalCtaSection } from '@/components/sections/DigitalCtaSection';
import { PartnerSection } from '@/components/sections/PartnerSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { BlogSection } from '@/components/sections/BlogSection';


export default function HomePage() {
  const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'InsuranceAgency',
  name: 'Golden Bear Seguros',
  image: 'https://www.goldenbearseguros.com.br/imagens/logo-golden-bear.svg',
  description: 'Especialistas em seguros de vida para militares',
  url: 'https://www.goldenbearseguros.com.br',
  telephone: '+551199999999', // Seu telefone
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'São Paulo',
    addressRegion: 'SP',
    addressCountry: 'BR',
  },
  priceRange: '$$',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
};

 return (
  <>
    {/* Adicione o Script JSON-LD */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
      <HeroSection />

        <StatsSection />

      <FadeInOnScroll>
        <FeaturesSection />
      </FadeInOnScroll>

      {/* --- 2. ADICIONE A NOVA SEÇÃO AQUI --- */}
      <FadeInOnScroll>
        <HowToSection />
      </FadeInOnScroll>


      <FadeInOnScroll>
        <BenefitsSection />
      </FadeInOnScroll>

      <FadeInOnScroll>
        <ForcesSection />
      </FadeInOnScroll>

      <FadeInOnScroll>
        <CtaSection />
      </FadeInOnScroll>

      <FadeInOnScroll>
        <Vantagens />
      </FadeInOnScroll>

      <FadeInOnScroll>
        <DigitalCtaSection />
      </FadeInOnScroll>

      <FadeInOnScroll>
        <PartnerSection />
      </FadeInOnScroll>

      <FadeInOnScroll>
        <TestimonialsSection />
      </FadeInOnScroll>

      <FadeInOnScroll>
        <BlogSection />
      </FadeInOnScroll>

      

    
            <FadeInOnScroll>
              <FaqSection />
            </FadeInOnScroll>
          
     
    </>
  );
}