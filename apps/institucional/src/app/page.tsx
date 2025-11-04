// Importe os componentes de seção que você criará
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
// ... (outros imports de seção virão aqui) ...
import { FaqSection } from '@/components/sections/FaqSection';

export default function HomePage() {
  return (
    <>
      {/*
        COLE ESTE BLOCO ATUALIZADO
        Agora estamos passando as props que o HeroSection espera,
        tiradas diretamente do seu front-page.php
      */}
      <HeroSection
        label="Seguro de Vida para Militares:"
        title="A Proteção Essencial para Quem Dedica a Vida ao Brasil"
        ctaText="Simulação Gratuita e Rápida"
        ctaLink="/simulador" // Link para seu app simulador
        imageUrl="/imagens/familia-hero.jpg" // Caminho dentro da pasta /public
        imageAlt="Família sorrindo - Seguro de Vida Militar"
      />

      {/* Usando a nova FeaturesSection que traduzimos
      */}
      <FeaturesSection />
      
      {/* O restante das seções do front-page.php virão aqui...
        (Audience, Differentials, DigitalContract, Trust, etc.)
      */}
      
      {/* Container para as seções de conteúdo */}
      <div id="content" className="site-content">
        <div className="container mx-auto max-w-[1280px] px-6">
          <main id="primary" className="site-main">
            {/* <AudienceSection /> */}
            {/* <DifferentialsSection /> */}
            {/* ... etc ... */}
          </main>
        </div>
      </div>

      {/* <BlogPreviewSection /> */}
      
      {/* Container para a FAQ */}
      <div id="content-faq" className="site-content">
        <div className="container mx-auto max-w-[1280px] px-6">
          <main id="primary-faq" className="site-main">
            <FaqSection /> {/* Este você já tinha */}
          </main>
        </div>
      </div>

      {/* <NewsletterSection /> */}
    </>
  );
}