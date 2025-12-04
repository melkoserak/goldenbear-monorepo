// apps/institucional/src/components/sections/RelatedCarouselSection.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Section, 
  Container, 
  Typography, 
  SectionHeader,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@goldenbear/ui';
import { ArrowRight, Shield, HeartPulse, ShieldAlert, ShieldCheck, Anchor, Plane, Flame } from 'lucide-react';

// --- Dados Centralizados ---
interface RelatedItem {
    id: string;
    icon: React.ElementType;
    title: string;
    href: string;
    description: string;
}

const PRODUCTS: RelatedItem[] = [
    { id: 'seguro-vida-morte', icon: Shield, title: "Seguro de Vida (Morte)", href: "/produtos/seguro-vida-morte", description: "Proteção fundamental contra imprevistos mais graves." },
    { id: 'doencas-graves', icon: HeartPulse, title: "Doenças Graves", href: "/produtos/doencas-graves", description: "Capital em vida para focar na sua recuperação." },
    { id: 'invalidez-acidente', icon: ShieldAlert, title: "Invalidez por Acidente", href: "/produtos/invalidez-acidente", description: "Recurso para recomeçar após um acidente." },
    { id: 'assistencia-funeral', icon: ShieldCheck, title: "Assistência Funeral", href: "/produtos/assistencia-funeral", description: "Amparo familiar e cobertura de despesas." }
];

const FORCES: RelatedItem[] = [
    { id: 'exercito', icon: Shield, title: "Exército Brasileiro", href: "/seguro-militar/exercito", description: "Proteção completa para quem serve em solo." },
    { id: 'marinha', icon: Anchor, title: "Marinha do Brasil", href: "/seguro-militar/marinha", description: "Segurança para quem serve nos mares, rios e em terra." },
    { id: 'aeronautica', icon: Plane, title: "Força Aérea Brasileira", href: "/seguro-militar/aeronautica", description: "Cobertura à altura dos seus voos, em solo e no ar." },
    { id: 'policia-militar', icon: Shield, title: "Polícia Militar", href: "/seguro-militar/policia-militar", description: "Amparo para quem está na linha de frente." },
    { id: 'bombeiros', icon: Flame, title: "Corpo de Bombeiros Militar", href: "/seguro-militar/bombeiros", description: "Proteção robusta para heróis que arriscam a vida." }
];

interface RelatedCarouselSectionProps {
    type: 'products' | 'forces';
}

// --- Componente de Card Otimizado (Agora é um Link direto) ---
const ItemCard = ({ item }: { item: RelatedItem }) => {
    const Icon = item.icon;
    
    // A solução técnica: O card inteiro É o Link. Sem botões aninhados.
    return (
       <Link 
            href={item.href}
            // --- CORREÇÃO APLICADA: ARIA-LABEL ---
            aria-label={`Ver detalhes sobre a cobertura ${item.title}`}
            className="group flex flex-col justify-start h-full p-6 bg-card border border-border rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary select-none"
        >
            {/* Ícone com feedback visual no hover do grupo */}
            <div className="p-2 bg-primary/10 rounded-lg inline-flex justify-start items-center gap-2.5 mb-4 w-fit group-hover:bg-primary/20 transition-colors">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            
            {/* CORREÇÃO DE SEO: as="h3" */}
            <Typography variant="h4" as="h3" color="primary" className="mb-2 group-hover:text-primary/80 transition-colors">
                {item.title}
            </Typography>
            
            <Typography variant="body" color="muted" className="flex-1 text-sm line-clamp-3">
                {item.description}
            </Typography>
            
            {/* Simulação visual de botão (sem ser um <button> real para evitar erro de HTML aninhado) */}
            <div className="mt-4 flex items-center text-sm text-foreground group-hover:text-foreground transition-colors">
                <span className="underline underline-offset-4 decoration-transparent group-hover:decoration-foreground transition-all">
                    Ver detalhes
                </span>
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
        </Link>
    );
}

// --- Sub-componente de Carrossel ---
const RelatedCarouselView = ({ filteredItems }: { filteredItems: RelatedItem[] }) => (
    <Carousel opts={{ align: "start", loop: false }} className="w-full">
        <div className="flex justify-end gap-4 mb-4 px-1">
            <CarouselPrevious variant="secondary" size="icon" /> 
            <CarouselNext variant="secondary" size="icon" />
        </div>
        <CarouselContent className="-ml-6 pb-4">
            {filteredItems.map((item) => (
                <CarouselItem key={item.id} className="pl-6 basis-4/5 sm:basis-1/2 lg:basis-1/3">
                    <div className="h-full">
                        <ItemCard item={item} />
                    </div>
                </CarouselItem>
            ))}
        </CarouselContent>
    </Carousel>
);

export const RelatedCarouselSection = ({ type }: RelatedCarouselSectionProps) => {
    const pathname = usePathname();
    
    const isProducts = type === 'products';
    const allItems = isProducts ? PRODUCTS : FORCES;
    
    const title = isProducts ? 'Combine sua proteção com estas Coberturas' : 'Conheça Outras Forças Atendidas';
    const subtitle = isProducts 
        ? 'Adicione um ou mais produtos ao seu carrinho de proteção.' 
        : 'Nossa proteção se estende a todas as Forças, incluindo a sua.';

    const filteredItems = allItems.filter(item => item.href !== pathname);
    const numItems = filteredItems.length;
    
    if (numItems === 0) return null;
    
    const showStaticGridOnDesktop = numItems <= 4;

    return (
        <Section variant="default" padding="default" className="overflow-hidden"> 
            <Container>
                <SectionHeader
                    title={title}
                    subtitle={subtitle}
                    className="mb-10 border-l-4 border-primary pl-6" 
                />
                
                {/* --- VISÃO DESKTOP --- */}
                <div className="hidden md:block">
                    {showStaticGridOnDesktop ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {filteredItems.map((item) => ( 
                                <ItemCard key={item.id} item={item} /> 
                            ))}
                        </div>
                    ) : (
                        <RelatedCarouselView filteredItems={filteredItems} /> 
                    )}
                </div>

                {/* --- VISÃO MOBILE --- */}
                <div className="block md:hidden">
                    <RelatedCarouselView filteredItems={filteredItems} /> 
                </div>

            </Container>
        </Section>
    );
};