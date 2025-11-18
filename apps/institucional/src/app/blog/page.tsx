import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Section } from "@goldenbear/ui/components/section";
import { Container } from "@goldenbear/ui/components/container";
import { Typography } from "@goldenbear/ui/components/typography";
import { Button } from "@goldenbear/ui/components/button";
import { ArrowRight, Calendar, Tag } from "lucide-react";

// Dados simulados (idealmente viriam de um CMS como Sanity/Contentful)
const posts = [
  {
    slug: "planejamento-financeiro-militar",
    title: "Planejamento financeiro: 5 dicas essenciais para quem veste farda",
    excerpt: "A vida militar tem particularidades financeiras únicas. Aprenda a organizar suas finanças e garantir um futuro seguro para sua família com estratégias pensadas para sua carreira.",
    date: "2023-10-15",
    image: "/imagens/familia-hero.jpg",
    category: "Educação Financeira"
  },
  {
    slug: "cobertura-exterior",
    title: "Como funciona a cobertura de seguro em missão no exterior?",
    excerpt: "Vai para uma missão de paz ou curso fora do país? Entenda os detalhes cruciais da sua apólice e o que é preciso saber antes de embarcar.",
    date: "2023-11-02",
    image: "/imagens/image-proteja.jpg",
    category: "Dúvidas Frequentes"
  },
  {
    slug: "assistencia-funeral",
    title: "A importância da Assistência Funeral para a família militar",
    excerpt: "Em momentos difíceis, o planejamento prévio é um ato de amor. Saiba como evitar burocracias e garantir uma despedida digna sem custos extras.",
    date: "2023-12-10",
    image: "/imagens/imagem-familia-call-out.png",
    category: "Benefícios"
  }
];

export const metadata: Metadata = {
  title: "Blog | Golden Bear Seguros",
  description: "Conteúdo especializado para militares: educação financeira, seguros, benefícios e carreira. Mantenha-se informado com a Golden Bear.",
};

export default function BlogListingPage() {
  return (
    <>
      {/* Header Hero do Blog */}
      <Section variant="primary-gradient" padding="default">
        <Container className="text-left">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white text-sm font-medium mb-4 backdrop-blur-sm">
            Conteúdo Exclusivo
          </span>
          <Typography variant="display" color="white" className="mb-6 max-w-3xl">
            Blog da Família Militar
          </Typography>
          <Typography variant="large" color="white" className="max-w-2xl">
            Informação, dicas e novidades para ajudar na proteção, no planejamento financeiro e no bem-estar da sua família.
          </Typography>
        </Container>
      </Section>

      {/* Grid de Posts */}
      <Section variant="default" padding="lg">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.slug} className="flex flex-col bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 group">
                {/* Imagem com Link */}
                <Link href={`/blog/${post.slug}`} className="relative h-52 w-full overflow-hidden">
                  <Image 
                    src={post.image} 
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 left-4 bg-background backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary flex items-center gap-1 shadow-sm">
                    <Tag className="w-3 h-3" /> {post.category}
                  </div>
                </Link>

                {/* Conteúdo */}
                <div className="p-6 flex-1 flex flex-col items-start">
                  <div className="flex items-center text-xs text-muted-foreground mb-3">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(post.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  
                  <Link href={`/blog/${post.slug}`}>
                    <Typography variant="h4" className="mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </Typography>
                  </Link>
                  
                  <Typography variant="body" color="muted" className="mb-6 line-clamp-3 text-sm">
                    {post.excerpt}
                  </Typography>
                  
                  <div className="mt-auto w-full pt-4 border-t border-border">
                    <Button variant="link" asChild className="p-0 h-auto text-primary font-semibold group/btn">
                      <Link href={`/blog/${post.slug}`} className="flex items-center">
                        Ler artigo completo 
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}