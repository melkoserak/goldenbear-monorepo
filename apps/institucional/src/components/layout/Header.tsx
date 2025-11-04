"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
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
// --- CORREÇÃO 1: Removido 'User' e 'Accessibility', adicionado 'UniversalAccess' ---
import { Menu, X, ChevronDown, Accessibility } from 'lucide-react';

// 1. Importe o NOVO componente "inteligente"
import { AccessibilityController } from './AccessibilityController';

// ... (const navLinks, const logoUrl, const MobileNavLink) ...
const navLinks = [
  { href: "/quem-somos", label: "Sobre" },
  {
    label: "Seguro Militar",
    subLinks: [
      { href: "/seguro-militar", label: "Seguro Exército" },
    ],
  },
  { href: "/contato", label: "Contato" },
  { href: "/blog", label: "Blog" },
];
const logoUrl = '/imagens/logo-golden-bear.svg';
const MobileNavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <SheetClose asChild>
    <Link href={href} className="block px-4 py-3 text-base font-medium text-text-light transition-colors hover:text-primary">
      {children}
    </Link>
  </SheetClose>
);

export const Header = () => {
  // ... (toda a lógica de state e useEffect do Header) ...
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (Math.abs(lastScrollTop - scrollTop) <= 5) return;
      if (scrollTop > lastScrollTop && scrollTop > 200) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);


  return (
    <header 
      id="masthead" 
      className={cn(
        "site-header sticky top-0 z-50 w-full border-b border-border bg-background py-4 transition-transform duration-300 ease-in-out",
        isHidden ? "-translate-y-full" : "translate-y-0"
      )}
    >
      {/* --- CORREÇÃO 2: Aplicada a classe 'container' (1280px) --- */}
      <div className="container flex flex-wrap items-center justify-between">
        {/* Branding (logo) */}
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

        {/* Navegação Desktop (usa Popover para dropdowns) */}
        <nav id="site-navigation" className="main-navigation hidden flex-grow justify-center md:flex">
          {/* ... (código do .map dos navLinks - sem alteração) ... */}
          <ul id="primary-menu" className="flex flex-wrap justify-start">
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

        {/* Ações (Login e CTA) - Desktop */}
        <div className="header-actions ml-5 hidden flex-shrink-0 items-center gap-2 md:flex">
          {/* 2. Adicione o Popover de Acessibilidade (Desktop) */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Opções de acessibilidade">
                {/* --- CORREÇÃO 3: Ícone trocado --- */}
                <Accessibility className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0">
              {/* 3. Renderize o Controller "inteligente" */}
              <AccessibilityController />
            </PopoverContent>
          </Popover>

          {/* --- CORREÇÃO 4: Botão "Entrar" removido --- */}

          <Button asChild>
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
              
              {/* Navegação Mobile (Accordion) */}
              <nav className="flex-grow overflow-y-auto p-4">
                {/* ... (código do .map dos navLinks no mobile - sem alteração) ... */}
                <Accordion type="single" collapsible className="w-full">
                  {navLinks.map((link) => (
                    <div key={link.label}>
                      {!link.subLinks ? (
                        <MobileNavLink href={link.href || "#"}>
                          {link.label}
                        </MobileNavLink>
                      ) : (
                        <AccordionItem value={link.label} className="border-none">
                          <AccordionTrigger className="px-4 py-3 text-base font-medium text-text-light transition-colors hover:text-primary hover:no-underline">
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

              {/* 4. Adicione os controles de Acessibilidade (Mobile) */}
              <div className="border-t">
                <AccessibilityController />
              </div>

              {/* Ações (Login e CTA) - Mobile */}
              <div className="border-t p-4 space-y-3">
                <Button asChild className="w-full">
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