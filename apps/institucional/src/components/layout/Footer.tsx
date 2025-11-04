import Link from 'next/link';
import Image from 'next/image';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from 'lucide-react';
import { cn } from '@goldenbear/ui/lib/utils';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const logoUrl = '/imagens/logo-golden-bear.svg'; // Seu logo

  return (
    // Fundo escuro (cor principal de texto) e texto claro
    <footer className="bg-primary-foreground text-primary-foreground/80">
      <div className="container py-12"> {/* Container de 1280px */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* 1. Sobre (Com seu logo) */}
          <div>
            <div className="mb-4">
              <Link href="/" rel="home">
                <Image
                  src={logoUrl}
                  alt="Golden Bear Logo"
                  width={160}
                  height={35}
                  className="max-h-[45px] w-auto"
                />
              </Link>
            </div>
            <p className="text-sm mb-4">
              Especialistas em seguros de vida para militares das Forças
              Armadas. Parceiros oficiais da Mag Seguros.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className={cn(
                  // --- CORREÇÃO APLICADA AQUI ---
                  'w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center', 
                  'hover:bg-secondary hover:text-secondary-foreground transition-colors'
                )}
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className={cn(
                  // --- CORREÇÃO APLICADA AQUI ---
                  'w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center', 
                  'hover:bg-secondary hover:text-secondary-foreground transition-colors'
                )}
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className={cn(
                  // --- CORREÇÃO APLICADA AQUI ---
                  'w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center', 
                  'hover:bg-secondary hover:text-secondary-foreground transition-colors'
                )}
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="Youtube"
                className={cn(
                  // --- CORREÇÃO APLICADA AQUI ---
                  'w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center', 
                  'hover:bg-secondary hover:text-secondary-foreground transition-colors'
                )}
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* 2. Links Rápidos */}
          <div>
            <h3 className="text font-bold mb-4">
              Links Rápidos
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/quem-somos"
                  className="hover:text-secondary transition-colors"
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link
                  href="/seguro-militar"
                  className="hover:text-secondary transition-colors"
                >
                  Nossos Planos
                </Link>
              </li>
              <li>
                <Link
                  href="/simulador"
                  className="hover:text-secondary transition-colors"
                >
                  Fazer Simulação
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-secondary transition-colors"
                >
                  Perguntas Frequentes
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Para Militares */}
          <div>
            <h3 className="text font-bold mb-4">
              Para Militares
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/seguro-militar"
                  className="hover:text-secondary transition-colors"
                >
                  Exército
                </Link>
              </li>
              {/* Você pode adicionar mais links aqui */}
            </ul>
          </div>

          {/* 4. Contato */}
          <div>
            <h3 className="text-primary-foreground font-bold mb-4">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="w-5 h-5 text flex-shrink-0" />
                <div>
                  <div>(11) 9999-9999</div>
                  <div className="text-xs text-primary-foreground/60">
                    WhatsApp disponível
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-5 h-5 text-secondary flex-shrink-0" />
                <div>contato@goldenbear.com.br</div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-secondary flex-shrink-0" />
                <div>
                  São Paulo - SP
                  <br />
                  Atendimento em todo Brasil
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra Inferior */}
        <div className="border-t border-primary/50 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="text-center md:text-left">
              <p>
                © {currentYear} Golden Bear - Especialistas em Seguros para Militares
              </p>
              <p className="text-xs text-primary-foreground/60 mt-1">
                Todos os direitos reservados. CNPJ: XX.XXX.XXX/XXXX-XX | SUSEP:
                XXXXX.XXXXXX/XXXX-XX
              </p>
            </div>
            <div className="flex gap-6 text-xs">
              <Link
                href="/politica-de-privacidade"
                className="hover:text-secondary transition-colors"
              >
                Política de Privacidade
              </Link>
              <Link
                href="#"
                className="hover:text-secondary transition-colors"
              >
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};