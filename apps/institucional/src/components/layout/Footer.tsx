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
import { Section } from '@goldenbear/ui/components/section';
import { Container } from '@goldenbear/ui/components/container';
import { Typography } from '@goldenbear/ui/components/typography';
import { Button } from '@goldenbear/ui/components/button';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const logoUrl = '/imagens/logo-golden-bear.svg';

  return (
    // 1. Usando o componente <Section> com a variante 'accent' (fundo cinza claro/accent)
    <Section as="footer" variant="accent">
      {/* 2. Usando o componente <Container> */}
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
            {/* 3. Usando <Typography> para parágrafos */}
            <Typography variant="small" color="default" className="mb-4 opacity-80">
              Especialistas em seguros de vida para militares das Forças
              Armadas. Parceiros oficiais da Mag Seguros.
            </Typography>
            <div className="flex gap-3 pt-4">
              {/* 4. Usando <Button> para ícones sociais com estilo unificado */}
              <Button asChild variant="ghost" size="icon" className="text-white bg-foreground hover:bg-primary hover:text-primary-foreground rounded-4">
                <a href="#" aria-label="Facebook">
                  <Facebook className="w-6 h-6" />
                </a>
              </Button>
              <Button asChild variant="ghost" size="icon" className="text-white bg-foreground hover:bg-primary hover:text-primary-foreground rounded-4">
                <a href="#" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
              </Button>
              <Button asChild variant="ghost" size="icon" className="text-white bg-foreground hover:bg-primary hover:text-primary-foreground rounded-4">
                <a href="#" aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
              </Button>
              <Button asChild variant="ghost" size="icon" className="text-white bg-foreground hover:bg-primary hover:text-primary-foreground rounded-4">
                <a href="#" aria-label="Youtube">
                  <Youtube className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* 2. Links Rápidos */}
          <div>
            {/* 5. Usando <Typography> para títulos de coluna */}
            <Typography variant="h4" color="default" className="mb-4 font-bold">
              Links Rápidos
            </Typography>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/quem-somos" className="hover:underline">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/seguro-militar" className="hover:underline">
                  Nossos Planos
                </Link>
              </li>
              <li>
                <Link href="/simulador" className="hover:underline">
                  Fazer Simulação
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:underline">
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
                <Link href="/seguro-militar/exercito" className="hover:underline">
                  Exército
                </Link>
              </li>
              <li>
                <Link href="/seguro-militar/marinha" className="hover:underline">
                  Marinha
                </Link>
              </li>
              <li>
                <Link href="/seguro-militar/aeronautica" className="hover:underline">
                  Aeronáutica
                </Link>
              </li>
              <li>
                <Link href="/seguro-militar/policia-militar" className="hover:underline">
                  Policiais Militares
                </Link>
              </li>
              <li>
                <Link href="/seguro-militar/bombeiros" className="hover:underline">
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
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <div>(11) 9999-9999</div>
                  <Typography variant="small" color="default" className="hover:underline">
                    WhatsApp disponível
                  </Typography>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="hover:underline">contato@goldenbear.com.br</div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="hover:underline">
                  São Paulo - SP
                  <br />
                  Atendimento em todo Brasil
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra Inferior */}
        {/* 6. Corrigida a cor da borda para usar 'foreground/20' para contraste adequado no fundo accent */}
        <div className="border-t border-foreground/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="text-center md:text-left">
              <Typography variant="small" color="default" className="opacity-100">
                © {currentYear} Golden Bear - Especialistas em Seguros para Militares<br></br>
              </Typography>
              <Typography variant="small" color="default" className="opacity-100 mt-1">
                Todos os direitos reservados. CNPJ: XX.XXX.XXX/XXXX-XX | SUSEP:
                XXXXX.XXXXXX/XXXX-XX
              </Typography>
            </div>
            <div className="flex flex-row gap-6">
              <Link href="/politica-de-privacidade" className="text-xs text-foreground hover:underline transition-colors">
                Política de Privacidade
              </Link>
              <Link href="#" className="text-xs text-foreground hover:underline transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};