import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@goldenbear/ui/components/button';
import { cn } from '@goldenbear/ui/lib/utils';
import { ArrowRight } from 'lucide-react';

// Dados de exemplo para os posts do blog
const blogPosts = [
  {
    title: "Planejamento financeiro: 5 dicas essenciais para quem veste farda",
    description: "Organizar as finanças é crucial. Veja passos práticos para garantir um futuro mais seguro para você e sua família...",
    imageUrl: "/imagens/familia-hero.jpg", // Imagem do seu projeto
    linkUrl: "/blog/planejamento-financeiro" // Exemplo de link
  },
  {
    title: "Como funciona a cobertura de seguro em missão no exterior?",
    description: "Entenda os detalhes da sua apólice e o que é preciso saber antes de embarcar para uma missão fora do país...",
    imageUrl: "/imagens/image-proteja.jpg", // Imagem do seu projeto
    linkUrl: "/blog/cobertura-exterior" // Exemplo de link
  },
  {
    title: "A importância da Assistência Funeral para a família militar",
    description: "Em momentos difíceis, o planejamento prévio pode evitar burocracias e garantir uma despedida digna...",
    imageUrl: "/imagens/imagem-familia-call-out.png", // Imagem do seu projeto
    linkUrl: "/blog/assistencia-funeral" // Exemplo de link
  }
];

// Sub-componente para o Card do Blog
const BlogCard = ({ title, description, imageUrl, linkUrl }: typeof blogPosts[0]) => (
  <div className="flex-1 p-6 bg-accent rounded-lg inline-flex flex-col justify-start gap-6">
    <div className="self-stretch h-80 flex flex-col justify-start items-start gap-6">
      <div className="self-stretch flex-1 bg-card rounded-lg flex flex-col justify-center items-center gap-2.5 overflow-hidden">
        <Image 
          className="self-stretch w-full h-80 object-cover" 
          src={imageUrl}
          alt={title}
          width={352}
          height={343}
        />
      </div>
      {/* Título (com text-foreground) */}
      <h3 className="self-stretch text-foreground text-xl font-medium leading-6 tracking-wide h-12 overflow-hidden">
        {title}
      </h3>
    </div>
    {/* Descrição (com text-muted-foreground) */}
    <p className="self-stretch text-muted-foreground text-base font-normal leading-6 tracking-wide h-20 overflow-hidden">
      {description}
    </p>
    {/* Botão "link" do Design System */}
    <Button variant="link" asChild className="p-0 h-auto text-primary font-normal underline">
      <Link href={linkUrl}>
        Leia mais
        <ArrowRight className="w-4 h-4 ml-1" />
      </Link>
    </Button>
  </div>
);

export const BlogSection = () => {
  return (
    // Seção principal com fundo bg-background (branco)
    <section className="self-stretch w-full py-32 bg-background inline-flex flex-col justify-center items-center gap-2.5">
      {/* Container de 1280px */}
      <div className="container w-full flex flex-col justify-center items-center gap-20 px-6">
        
        {/* Cabeçalho */}
        <div className="self-stretch inline-flex flex-col md:flex-row justify-start items-center gap-4">
          {/* Título (com text-primary) */}
          <h2 className="w-full md:w-[474px] justify-start text-primary text-3xl font-bold leading-8 tracking-wide">
            Nosso blog
          </h2>
          {/* Descrição (com text-foreground) */}
          <p className="flex-1 justify-start text-foreground text-base font-medium leading-5 tracking-wide">
            conteúdo relevante para a família militar e de segurança pública
          </p>
        </div>

        {/* Grid de Cards */}
        <div className="self-stretch grid grid-cols-1 md:grid-cols-3 justify-start items-start gap-10">
          {blogPosts.map((post) => (
            <BlogCard key={post.title} {...post} />
          ))}
        </div>

        {/* Botão Final (com text-foreground) */}
        <Button variant="link" asChild className="p-0 h-auto text-foreground font-normal underline">
          <Link href="/blog">
            Veja todo nosso blog
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>
    </section>
  );
};