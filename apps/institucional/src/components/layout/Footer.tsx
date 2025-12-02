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
import { Section } from '@goldenbear/ui/components/section';
import { Container } from '@goldenbear/ui/components/container';
import { Typography } from '@goldenbear/ui/components/typography';
import { Button } from '@goldenbear/ui/components/button';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const logoUrl = '/imagens/logo-golden-bear.svg';

  return (
    <Section as="footer" variant="accent">
      <Container>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* 1. Sobre */}
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
            
            <Typography variant="small" color="default" className="mb-4 opacity-80 block">
              Especialistas em seguros de vida para militares das Forças
              Armadas. Parceiros oficiais da Mag Seguros.
            </Typography>
            
            <div className="flex gap-3 pt-4">
              {/* Social Links com Segurança (noopener noreferrer) */}
              <Button asChild variant="ghost" size="icon" className="text-white bg-foreground hover:bg-primary hover:text-primary-foreground rounded-md">
                <a 
                  href="https://facebook.com/goldenbearseguros" 
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </Button>
              
              <Button asChild variant="ghost" size="icon" className="text-white bg-foreground hover:bg-primary hover:text-primary-foreground rounded-md">
                <a 
                  href="https://instagram.com/goldenbearseguros" 
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </Button>
              
              <Button asChild variant="ghost" size="icon" className="text-white bg-foreground hover:bg-primary hover:text-primary-foreground rounded-md">
                <a 
                  href="https://linkedin.com/company/golden-bear-seguros" 
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </Button>
              
              <Button asChild variant="ghost" size="icon" className="text-white bg-foreground hover:bg-primary hover:text-primary-foreground rounded-md">
                <a 
                  href="https://youtube.com/@goldenbearseguros" 
                  aria-label="Youtube"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* 2. Links Rápidos */}
          <div>
            <Typography variant="h4" color="default" className="mb-4 font-bold">
              Links Rápidos
            </Typography>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/quem-somos" className="hover:underline hover:text-primary transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/seguro-militar" className="hover:underline hover:text-primary transition-colors">
                  Nossos Planos
                </Link>
              </li>
              <li>
                <Link href="/simulador" className="hover:underline hover:text-primary transition-colors">
                  Fazer Simulação
                </Link>
              </li>
              <li>
                <Link href="/duvidas-frequentes" className="hover:underline hover:text-primary transition-colors">
                  Perguntas Frequentes
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Para Militares */}
          <div>
            <Typography variant="h4" color="default" className="mb-4 font-bold">
              Para Militares
            </Typography>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/seguro-militar/exercito" className="hover:underline hover:text-primary transition-colors">
                  Exército
                </Link>
              </li>
              <li>
                <Link href="/seguro-militar/marinha" className="hover:underline hover:text-primary transition-colors">
                  Marinha
                </Link>
              </li>
              <li>
                <Link href="/seguro-militar/aeronautica" className="hover:underline hover:text-primary transition-colors">
                  Aeronáutica
                </Link>
              </li>
              <li>
                <Link href="/seguro-militar/policia-militar" className="hover:underline hover:text-primary transition-colors">
                  Policiais Militares
                </Link>
              </li>
              <li>
                <Link href="/seguro-militar/bombeiros" className="hover:underline hover:text-primary transition-colors">
                  Bombeiros
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Contato */}
          <div>
            <Typography variant="h4" color="default" className="mb-4 font-bold">
              Contato
            </Typography>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">(11) 9999-9999</div>
                  <Typography variant="small" color="muted" className="block text-xs mt-0.5">
                    WhatsApp disponível
                  </Typography>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <a href="mailto:contato@goldenbear.com.br" className="text-sm hover:underline hover:text-primary transition-colors">
                  contato@goldenbear.com.br
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  São Paulo - SP
                  <br />
                  <span className="text-muted-foreground text-xs">Atendimento em todo Brasil</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra Inferior */}
        <div className="border-t border-foreground/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="text-center md:text-left">
              <Typography variant="small" color="muted" className="block">
                © {currentYear} Golden Bear - Especialistas em Seguros para Militares
              </Typography>
              <Typography variant="small" color="muted" className="block mt-1 text-[10px] opacity-70">
                Todos os direitos reservados. CNPJ: XX.XXX.XXX/XXXX-XX | SUSEP: XXXXX.XXXXXX/XXXX-XX
              </Typography>
            </div>
            <div className="flex flex-row gap-6">
              <Link href="/politica-de-privacidade" className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors">
                Política de Privacidade
              </Link>
              <Link href="/termos-de-uso" className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};