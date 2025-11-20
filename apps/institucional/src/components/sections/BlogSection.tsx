import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@goldenbear/ui/components/button';
import { ArrowRight } from 'lucide-react';
import { Section } from '@goldenbear/ui/components/section';
import { Container } from '@goldenbear/ui/components/container';
import { Typography } from '@goldenbear/ui/components/typography';

const blogPosts = [
  {
    title: "Planejamento financeiro: 5 dicas essenciais para quem veste farda",
    description: "Organizar as finanças é crucial. Veja passos práticos para garantir um futuro mais seguro para você e sua família...",
    imageUrl: "/imagens/familia-hero.jpg",
    linkUrl: "/blog/planejamento-financeiro"
  },
  {
    title: "Como funciona a cobertura de seguro em missão no exterior?",
    description: "Entenda os detalhes da sua apólice e o que é preciso saber antes de embarcar para uma missão fora do país...",
    imageUrl: "/imagens/image-proteja.jpg",
    linkUrl: "/blog/cobertura-exterior"
  },
  {
    title: "A importância da Assistência Funeral para a família militar",
    description: "Em momentos difíceis, o planejamento prévio pode evitar burocracias e garantir uma despedida digna...",
    imageUrl: "/imagens/imagem-familia-call-out.png",
    linkUrl: "/blog/assistencia-funeral"
  }
];

const BlogCard = ({ title, description, imageUrl, linkUrl }: any) => (
  // 1. Adicionado 'relative group' e transição
  <div className="flex-1 p-6 bg-accent rounded-lg inline-flex flex-col justify-start gap-6 relative group transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
    <div className="self-stretch h-80 flex flex-col justify-start items-start gap-6">
      <div className="self-stretch flex-1 bg-card rounded-lg flex flex-col justify-center items-center gap-2.5 overflow-hidden">
        <Image className="self-stretch w-full h-80 object-cover" src={imageUrl} alt={title} width={352} height={343} />
      </div>
      <Typography variant="h4">
        {title}
      </Typography>
    </div>
    <Typography variant="body" color="muted" className="line-clamp-3">
      {description}
    </Typography>
    <Button variant="link" asChild className="p-0 h-auto text-foreground font-medium justify-start">
      <Link href={linkUrl}>
        {/* 2. Span para esticar o link */}
        <span className="absolute inset-0 z-10" aria-hidden="true" />
        Leia mais <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
      </Link>
    </Button>
  </div>
);

export const BlogSection = () => {
  return (
    <Section variant="default">
      <Container className="flex flex-col justify-center items-center gap-10 lg:gap-20">
        <div className="self-stretch inline-flex flex-col md:flex-row justify-start items-center gap-4">
          <Typography variant="h2" color="primary" className="w-full md:w-[474px]">
            Nosso blog
          </Typography>
          <Typography variant="body" className="flex-1 font-medium">
            conteúdo relevante para a família militar e de segurança pública
          </Typography>
        </div>

        <div className="self-stretch grid grid-cols-1 md:grid-cols-3 justify-start items-start gap-10">
          {blogPosts.map((post) => <BlogCard key={post.title} {...post} />)}
        </div>

        <Button variant="link" asChild className="p-0 h-auto text-foreground font-sembibold underline">
          <Link href="/blog">Veja todo nosso blog <ArrowRight className="w-4 h-4 ml-1" /></Link>
        </Button>
      </Container>
    </Section>
  );
};