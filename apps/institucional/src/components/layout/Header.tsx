"use client";

import Link from 'next/link';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@goldenbear/ui/components/button';
import { cn } from '@goldenbear/ui/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@goldenbear/ui/components/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@goldenbear/ui/components/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@goldenbear/ui/components/accordion";
import { Menu, ChevronDown } from 'lucide-react';

// --- CORREÇÃO DA ESTRUTURA DE NAVEGAÇÃO ---
// Ordem atualizada e remoção de 'isHighlighted'
const navLinks = [
  { href: "/quem-somos", label: "Sobre" },
  {
    label: "Produtos", // Renomeado
    subLinks: [
      { href: "/produtos/seguro-vida-morte", label: "Seguro de Vida (Morte)" },
      { href: "/produtos/doencas-graves", label: "Doenças Graves" },
      { href: "/produtos/invalidez-acidente", label: "Invalidez por Acidente" },
      { href: "/produtos/assistencia-funeral", label: "Assistência Funeral" },
    ],
  },
  {
    label: "Para Militares",
    subLinks: [
      // --- ALTERAÇÃO AQUI ---
      // Atualizado para apontar para as novas LPs dedicadas
      { href: "/seguro-militar/exercito", label: "Exército" },
      { href: "/seguro-militar/marinha", label: "Marinha" },
      { href: "/seguro-militar/aeronautica", label: "Aeronáutica" },
      { href: "/seguro-militar/policia-militar", label: "Policiais Militares" },
      { href: "/seguro-militar/bombeiros", label: "Bombeiros" },
    ],
  },
  {
    label: "Veja Mais", // Renomeado
    subLinks: [
      { href: "/blog", label: "Blog" },
      { href: "/duvidas-frequentes", label: "Dúvidas Frequentes" },
    ],
  },
  { href: "/contato", label: "Contato" }, // Adicionado
];
// --- FIM DA CORREÇÃO ---

const logoUrl = '/imagens/logo-golden-bear.svg';
const MobileNavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <SheetClose asChild>
    <Link href={href} className="block px-4 py-3 text-base font-medium text-text-light transition-colors hover:text-primary">
      {children}
    </Link>
  </SheetClose>
);

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // USEREF: Mantém o valor entre renders sem disparar atualização de UI
  const lastScrollTop = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      // Performance: Ignora pequenas variações (debounce simples)
      if (Math.abs(lastScrollTop.current - scrollTop) <= 5) return;

      // Lógica de esconder/mostrar
      if (scrollTop > lastScrollTop.current && scrollTop > 200) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      // Atualiza a ref (não causa re-render)
      lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
    };

    // Adiciona listener passivo (melhor performance de scroll)
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Array de dependências vazio = Listener criado apenas uma vez!


  return (
    <header 
      id="masthead" 
      className={cn(
        "site-header sticky top-0 z-50 w-full border-b border-border bg-background py-2 md:py-4 transition-transform duration-300 ease-in-out",
        isHidden ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <div className="container flex flex-wrap items-center justify-between">
        <div className="site-branding mr-6 flex-shrink-0">
          <Link href="/" rel="home">
            <Image 
              src={logoUrl} 
              alt="Golden Bear Logo" 
              width={180} 
              height={40} 
              className="h-auto max-h-[50px] w-auto" 
              priority 
            />
          </Link>
        </div>

        {/* Navegação Desktop */}
        <nav id="site-navigation" className="main-navigation hidden flex-grow justify-center md:flex">
          <ul id="primary-menu" className="flex flex-wrap justify-start items-center">
            {navLinks.map((link) => (
              <li key={link.label} className="mx-1">
                {!link.subLinks ? (
                  <Button asChild variant="ghost">
                    <Link href={link.href || "#"}>
                      {link.label}
                    </Link>
                  </Button>
                ) : (
                  <Popover>
                    <PopoverTrigger asChild>
                      {/* --- CORREÇÃO: Todos os botões usam variant="ghost" --- */}
                      <Button variant="ghost">
                        {link.label}
                        <ChevronDown className="ml-1 h-4 w-4" aria-hidden="true" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2">
                      <ul className="space-y-1">
                        {link.subLinks.map((subLink) => (
                          <li key={subLink.href}>
                            <Button asChild variant="ghost" className="w-full justify-start">
                              <Link href={subLink.href}>
                                {subLink.label}
                              </Link>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </PopoverContent>
                  </Popover>
                )}
              </li>
            ))}
          </ul>
        </nav>

       {/* Ações (CTA) - Desktop */}
        <div className="header-actions ml-5 hidden flex-shrink-0 items-center gap-2 md:flex">
          
          {/* --- CORREÇÃO: CTA principal de volta para "default" (azul) --- */}
          <Button asChild variant="default">
            <Link href="/simulador">Faça a sua simulação</Link>
          </Button>
        </div>
        
        {/* Botão de Menu Mobile (Sheet) */}
        <div className="menu-toggle md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Abrir menu">
                <Menu className="h-6 w-6" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-sm p-0 flex flex-col">
              <SheetHeader className="border-b p-6">
                <SheetTitle className="text-left">
                  <Image 
                    src={logoUrl} 
                    alt="Golden Bear Logo" 
                    width={160} 
                    height={35} 
                    className="h-auto w-auto" 
                  />
                </SheetTitle>
              </SheetHeader>
              
              <nav className="flex-grow overflow-y-auto p-4">
                <Accordion type="single" collapsible className="w-full">
                  {navLinks.map((link) => (
                    <div key={link.label}>
                      {!link.subLinks ? (
                        <MobileNavLink href={link.href || "#"}>
                          {link.label}
                        </MobileNavLink>
                      ) : (
                        <AccordionItem value={link.label} className="border-none">
                          {/* --- CORREÇÃO: Removido o destaque condicional --- */}
                          <AccordionTrigger className={cn(
                            "px-4 py-3 text-base font-medium text-text-light transition-colors hover:text-primary hover:no-underline"
                          )}>
                            {link.label}
                          </AccordionTrigger>
                          <AccordionContent className="pb-0">
                            <ul className="ml-4 border-l border-border pl-4">
                              {link.subLinks.map((subLink) => (
                                <li key={subLink.href}>
                                  <MobileNavLink href={subLink.href}>
                                    {subLink.label}
                                  </MobileNavLink>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      )}
                    </div>
                  ))}
                </Accordion>
              </nav>

        {/* --- CORREÇÃO: CTA principal de volta para "default" (azul) --- */}
              <div className="border-t p-4 space-y-3">
                <Button asChild className="w-full" variant="default">
                  <Link href="/simulador">Faça a sua simulação</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};