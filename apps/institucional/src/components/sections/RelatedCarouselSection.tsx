// apps/institucional/src/components/sections/RelatedCarouselSection.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Section, Container, Typography, SectionHeader } from '@goldenbear/ui';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    Button
} from '@goldenbear/ui';
import { ArrowRight, Shield, HeartPulse, ShieldAlert, ShieldCheck, Anchor, Plane, Flame } from 'lucide-react';

// --- Dados Centralizados (Mantidos) ---
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

const ItemCard = ({ item }: { item: RelatedItem }) => {
    const Icon = item.icon;
    return (
        <div className="flex-1 self-stretch p-6 bg-card border border-border rounded-lg shadow-sm flex flex-col justify-start h-full hover:shadow-md transition-shadow">
            <div className="p-2 bg-muted rounded-lg inline-flex justify-start items-center gap-2.5 mb-4">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            <Typography variant="h4" color="primary" className="mb-2">
                {item.title}
            </Typography>
            <Typography variant="body" color="muted" className="flex-1 text-sm line-clamp-3">
                {item.description}
            </Typography>
            <Button 
                variant="link" 
                asChild 
                className="p-0 h-auto text-foreground font-medium mt-4"
            >
                <Link href={item.href}>
                    Ver detalhes <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
            </Button>
        </div>
    );
}

// Sub-componente para renderizar o carrossel (usado em Mobile e Desktop > 5)
const RelatedCarouselView = ({ filteredItems }: { filteredItems: RelatedItem[] }) => (
    <Carousel opts={{ align: "start", loop: false }} className="w-full">
        {/* Botões de navegação atualizados para variant="default" */}
        <div className="flex justify-end gap-4 mb-4">
            <CarouselPrevious variant="default" size="icon" /> 
            <CarouselNext variant="default" size="icon" />
        </div>
        <CarouselContent className="-ml-6">
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
    const subtitle = isProducts ? 'Adicione um ou mais produtos ao seu carrinho de proteção.' : 'Nossa proteção se estende a todas as Forças, incluindo a sua.';

    const filteredItems = allItems.filter(item => item.href !== pathname);
    const numItems = filteredItems.length;
    
    if (numItems === 0) return null;
    
    // Regra Desktop: Mostrar Grid se <= 5 itens.
    const showStaticGridOnDesktop = numItems <= 5;

    return (
        // 1. Alterado para variant="default" (fundo branco) para maior contraste.
        <Section variant="default" padding="default"> 
            <Container>
                {/* 2. Ênfase no Título com Borda Primary */}
                <SectionHeader
                    title={title}
                    subtitle={subtitle}
                    // Adiciona uma borda à esquerda em primary para destaque visual
                    className="mb-8 border-l-4 border-primary pl-4" 
                />
                
                {/* 3. VISÃO DESKTOP (Condicional: Grid ou Carousel) */}
                <div className="hidden md:block">
                    {showStaticGridOnDesktop ? (
                        /* Static Grid (≤ 5 items): Desktop View */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {filteredItems.map((item) => ( 
                                <ItemCard key={item.id} item={item} /> 
                            ))}
                        </div>
                    ) : (
                        /* Carousel (> 5 items): Desktop View */
                        <RelatedCarouselView filteredItems={filteredItems} /> 
                    )}
                </div>

                {/* 4. VISÃO MOBILE (Sempre Carousel) */}
                <div className="block md:hidden">
                    <RelatedCarouselView filteredItems={filteredItems} /> 
                </div>

            </Container>
        </Section>
    );
};