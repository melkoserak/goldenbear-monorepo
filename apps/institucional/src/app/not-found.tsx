import Link from 'next/link';
import { Button } from '@goldenbear/ui/components/button';
import { Section } from '@goldenbear/ui/components/section';
import { Container } from '@goldenbear/ui/components/container';
import { Typography } from '@goldenbear/ui/components/typography';
import { Home, FileSearch } from 'lucide-react';

export default function NotFound() {
  return (
    <Section variant="default" padding="lg" className="min-h-[60vh]">
      <Container className="flex flex-col items-center text-center gap-8">
        <div className="p-6 bg-accent rounded-full">
          <FileSearch className="w-16 h-16 text-primary" />
        </div>
        
        <div className="space-y-4 max-w-md">
          <Typography variant="display" color="primary">
            404
          </Typography>
          <Typography variant="h2">
            Página não encontrada
          </Typography>
          <Typography variant="body" color="muted">
            Parece que a página que você está procurando mudou de endereço ou não existe mais.
          </Typography>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild variant="default" size="lg">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Voltar para o Início
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/simulador">
              Fazer uma Simulação
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}