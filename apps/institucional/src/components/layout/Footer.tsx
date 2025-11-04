import Link from 'next/link';
import Image from 'next/image';
// --- IMPORTAÇÃO DE ÍCONES (PERFORMANCE) ---
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

export const Footer = () => {
  const logoUrl = '/imagens/logo-golden-bear.svg'; // Logo é <Image>

  return (
    <footer id="colophon" className="site-footer bg-light-gray-color py-20 text-text-light">
      <div className="container mx-auto max-w-[1280px] px-6">
        {/* Grid de 5 colunas do footer.php */}
        <div className="footer-grid mb-10 grid grid-cols-1 gap-10 md:grid-cols-5 md:gap-8">
          
          {/* Coluna 1: Logo e Tagline */}
          <div className="footer-widget-1 md:col-span-1.5">
            <div className="site-branding footer-branding mb-4">
              <Link href="/" rel="home">
                <Image src={logoUrl} alt="Golden Bear Logo" width={160} height={35} className="max-h-[45px] w-auto" />
              </Link>
            </div>
            <p className="footer-tagline mt-4 text-base font-bold leading-snug text-primary">
              A proteção dos militares e da sua família
            </p>
          </div>

          {/* Coluna 2: Coberturas */}
          <div className="footer-widget-2">
            <h4 className="widget-title mb-5 text-base font-bold text-text-color">Coberturas</h4>
            <ul className="space-y-2.5">
              <li><Link href="#" className="font-normal text-text-light hover:text-primary hover:underline">Seguro de Vida</Link></li>
              <li><Link href="#" className="font-normal text-text-light hover:text-primary hover:underline">Doenças Graves</Link></li>
              <li><Link href="#" className="font-normal text-text-light hover:text-primary hover:underline">Invalidez Total</Link></li>
              <li><Link href="#" className="font-normal text-text-light hover:text-primary hover:underline">Assistência Funeral</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Golden Bear */}
          <div className="footer-widget-3">
            <h4 className="widget-title mb-5 text-base font-bold text-text-color">Golden Bear</h4>
            <ul className="space-y-2.5">
              <li><Link href="/quem-somos" className="font-normal text-text-light hover:text-primary hover:underline">Sobre</Link></li>
              <li><Link href="/blog" className="font-normal text-text-light hover:text-primary hover:underline">Blog</Link></li>
              <li><Link href="/contato" className="font-normal text-text-light hover:text-primary hover:underline">Contato</Link></li>
            </ul>
          </div>

          {/* Coluna 4: Suporte */}
          <div className="footer-widget-4">
            <h4 className="widget-title mb-5 text-base font-bold text-text-color">Suporte</h4>
            <ul className="space-y-2.5">
              <li><Link href="/faq" className="font-normal text-text-light hover:text-primary hover:underline">Perguntas Frequentes</Link></li>
              <li><Link href="/politica-de-privacidade" className="font-normal text-text-light hover:text-primary hover:underline">Política de Privacidade</Link></li>
              <li><Link href="#" className="font-normal text-text-light hover:text-primary hover:underline">Termos de Uso</Link></li>
            </ul>
          </div>

          {/* Coluna 5: Redes Sociais */}
          <div className="footer-widget-5">
            <h4 className="widget-title mb-5 text-base font-bold text-text">Rede Sociais</h4>
            {/* --- ÍCONES DE ALTA PERFORMANCE --- */}
            <ul className="social-links flex flex-wrap gap-4">
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="opacity-70 transition-opacity hover:opacity-100">
                  <Facebook className="h-6 w-6" />
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="opacity-70 transition-opacity hover:opacity-100">
                  <Instagram className="h-6 w-6" />
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="opacity-70 transition-opacity hover:opacity-100">
                  <Linkedin className="h-6 w-6" />
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="opacity-70 transition-opacity hover:opacity-100">
                  <Youtube className="h-6 w-6" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="site-info mt-8 border-t border-border-color pt-8 text-center text-sm">
          Copyright &copy; {new Date().getFullYear()} Golden Bear. Todos os direitos reservados.
          <span className="sep mx-2 hidden md:inline">|</span>
          <br className="md:hidden" />
          <Link href="/politica-de-privacidade" className="font-normal text-text-light underline hover:text-primary">
            Política de Privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
};