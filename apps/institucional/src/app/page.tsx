// Importe os componentes de seção que você criará
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { BenefitsSection } from '@/components/sections/BenefitsSection';
import { HowToSection } from '@/components/sections/HowToSection'; // <-- 1. IMPORTE A NOVA SEÇÃO
import { FaqSection } from '@/components/sections/FaqSection';
import { FadeInOnScroll } from '@/components/layout/FadeInOnScroll';

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <FadeInOnScroll>
        <FeaturesSection />
      </FadeInOnScroll>

      <FadeInOnScroll>
        <BenefitsSection />
      </FadeInOnScroll>

      {/* --- 2. ADICIONE A NOVA SEÇÃO AQUI --- */}
      <FadeInOnScroll>
        <HowToSection />
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