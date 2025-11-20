"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation'; // 1. Importe usePathname
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

const navLinks = [
  { href: "/quem-somos", label: "Sobre" },
  {
    label: "Produtos",
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
      { href: "/seguro-militar/exercito", label: "Exército" },
      { href: "/seguro-militar/marinha", label: "Marinha" },
      { href: "/seguro-militar/aeronautica", label: "Aeronáutica" },
      { href: "/seguro-militar/policia-militar", label: "Policiais Militares" },
      { href: "/seguro-militar/bombeiros", label: "Bombeiros" },
    ],
  },
  {
    label: "Veja Mais",
    subLinks: [
      { href: "/blog", label: "Blog" },
      { href: "/duvidas-frequentes", label: "Dúvidas Frequentes" },
    ],
  },
  { href: "/contato", label: "Contato" },
];

const logoUrl = '/imagens/logo-golden-bear.svg';

// Componente para Links Mobile com Altura Mínima (44px)
const MobileNavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <SheetClose asChild>
    <Link 
      href={href} 
      // UX MOBILE: min-h-[44px] e flex items-center garantem área de toque segura
      className="flex items-center min-h-[44px] px-4 py-2 text-base font-medium text-text-light transition-colors hover:text-primary hover:bg-accent/50 rounded-md"
    >
      {children}
    </Link>
  </SheetClose>
);

// NOVO COMPONENTE: Controla o estado do Dropdown Desktop
const NavDropdown = ({ link }: { link: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // EFEITO MÁGICO: Fecha o menu sempre que a rota mudar
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          className={cn("gap-1", isOpen && "bg-accent text-accent-foreground")}
        >
          {link.label}
          <ChevronDown 
            className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} 
            aria-hidden="true" 
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <ul className="space-y-1">
          {link.subLinks.map((subLink: any) => (
            <li key={subLink.href}>
              <Button 
                asChild 
                variant="ghost" 
                className="w-full justify-start h-auto py-2.5 font-normal"
                onClick={() => setIsOpen(false)} // Garante fechamento no clique também
              >
                <Link href={subLink.href}>
                  {subLink.label}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollTop = useRef(0);
  
  // Hook para fechar o menu mobile se a rota mudar (caso o SheetClose falhe ou navegação via código)
  const pathname = usePathname();
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (Math.abs(lastScrollTop.current - scrollTop) <= 5) return;
      if (scrollTop > lastScrollTop.current && scrollTop > 200) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      id="masthead" 
      className={cn(
        "site-header sticky top-0 z-50 w-full border-b border-border bg-background supports-[backdrop-filter]:bg-background/60 py-2 md:py-4 transition-transform duration-300 ease-in-out",
        isHidden ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <div className="container flex flex-wrap items-center justify-between">
        <div className="site-branding mr-6 flex-shrink-0">
          <Link href="/" rel="home" className="flex items-center">
            <Image 
              src={logoUrl} 
              alt="Golden Bear Logo" 
              width={180} 
              height={40} 
              className="h-auto max-h-[45px] md:max-h-[50px] w-auto" 
              priority 
            />
          </Link>
        </div>

        {/* Navegação Desktop */}
        <nav id="site-navigation" className="main-navigation hidden flex-grow justify-center md:flex">
          <ul id="primary-menu" className="flex flex-wrap justify-start items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                {!link.subLinks ? (
                  <Button asChild variant="ghost">
                    <Link href={link.href || "#"}>
                      {link.label}
                    </Link>
                  </Button>
                ) : (
                  // Uso do novo componente controlado
                  <NavDropdown link={link} />
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions ml-5 hidden flex-shrink-0 items-center gap-2 md:flex">
          <Button asChild variant="default">
            <Link href="/simulador">Faça a sua simulação</Link>
          </Button>
        </div>
        
        {/* Menu Mobile */}
        <div className="menu-toggle md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              {/* Área de toque aumentada para o ícone do menu */}
              <Button variant="ghost" size="icon" aria-label="Abrir menu" className="h-11 w-11">
                <Menu className="h-6 w-6" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-[300px] sm:max-w-sm p-0 flex flex-col bg-background border-r">
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
                <Accordion type="single" collapsible className="w-full space-y-2">
                  {navLinks.map((link) => (
                    <div key={link.label}>
                      {!link.subLinks ? (
                        <MobileNavLink href={link.href || "#"}>
                          {link.label}
                        </MobileNavLink>
                      ) : (
                        <AccordionItem value={link.label} className="border-none">
                          {/* UX MOBILE: Trigger com altura mínima de 44px */}
                          <AccordionTrigger className={cn(
                            "flex items-center min-h-[44px] px-4 py-2 text-base font-medium text-text-light transition-colors hover:text-primary hover:bg-accent/50 rounded-md hover:no-underline"
                          )}>
                            {link.label}
                          </AccordionTrigger>
                          <AccordionContent className="pb-2 pt-1">
                            <ul className="ml-4 border-l-2 border-border/50 pl-2 space-y-1">
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

              <div className="border-t p-6 bg-accent/10">
                <Button asChild className="w-full h-12 text-base" variant="default">
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