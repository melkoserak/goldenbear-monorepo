"use client";

import React from 'react';
import { Button } from '@goldenbear/ui/components/button';
import { Container } from '@goldenbear/ui/components/container';
import { Popover, PopoverContent, PopoverTrigger } from '@goldenbear/ui/components/popover';
import { PersonStanding } from 'lucide-react';
import { AccessibilityController } from './AccessibilityController';
import { Typography } from '@goldenbear/ui/components/typography';

// --- CORREÇÃO 1: Importar o componente Section ---
import { Section } from '@goldenbear/ui/components/section';

export const TopBar = () => {
  return (
    // --- CORREÇÃO 2: Usar o componente <Section> com variantes ---
    <Section 
      variant="accent" 
      padding="none" 
      className="flex md:flex border-b"
    >
      <Container className="flex justify-start items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 pr-4 pl-0 ">
              <PersonStanding className="h-4 w-4" />
              <Typography variant="small" color="muted">
                Acessibilidade
              </Typography>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0">
            <AccessibilityController />
          </PopoverContent>
        </Popover>
      </Container>
    </Section> // --- CORREÇÃO 3: Fechamento correto do componente ---
  );
};