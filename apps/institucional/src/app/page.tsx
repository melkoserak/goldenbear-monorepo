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
  return (
    <>
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

      

      {/* O restante das seções (ex: Blog) viriam aqui... */}
      
      {/* Container para a FAQ */}
      <div id="content-faq" className="site-content">
        <div className="container mx-auto max-w-[1280px] px-6">
          <main id="primary-faq" className="site-main">
            <FadeInOnScroll>
              <FaqSection />
            </FadeInOnScroll>
          </main>
        </div>
      </div>
      {/* ... */}
    </>
  );
}