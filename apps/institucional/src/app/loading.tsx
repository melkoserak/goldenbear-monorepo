import { Section, Container, Skeleton } from "@goldenbear/ui";

/**
 * Este é um React Server Component especial do Next.js.
 * Ele será mostrado automaticamente como um fallback de UI
 * enquanto o conteúdo da rota (page.tsx) está a carregar.
 *
 * Isto cobre as "transições de página" lentas.
 */
export default function Loading() {
  return (
    <>
      {/* Skeleton para o PageHero */}
      <Section variant="accent" padding="default">
        <Container className="text-left max-w-3xl">
          
          <Skeleton className="h-6 w-40 rounded-full" />
          
          <Skeleton className="h-12 w-3/4 mt-6 mb-4" />
          
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6 mt-2" />
          
          <Skeleton className="h-16 w-60 mt-8" />
          
        </Container>
      </Section>

      {/* Skeleton para uma seção de cards */}
      <Section variant="default" padding="lg">
        <Container>
          <Skeleton className="h-10 w-1/2 max-w-sm mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
          </div>
        </Container>
      </Section>
    </>
  );
}