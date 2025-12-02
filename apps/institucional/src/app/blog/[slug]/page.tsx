import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@goldenbear/ui/components/section";
import { Container } from "@goldenbear/ui/components/container";
import { Typography } from "@goldenbear/ui/components/typography";
import { Button } from "@goldenbear/ui/components/button";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { ReadingProgress } from "@/components/layout/ReadingProgress";
import { ShareButton } from "@/components/blog/ShareButton";
// 1. Adicione o import
import { sanitizeHtml } from "@goldenbear/ui/lib/html-utils";

// Dados Mockados
const getPost = (slug: string) => {
  const posts = {
    "planejamento-financeiro-militar": {
      title: "Planejamento financeiro: 5 dicas essenciais para quem veste farda",
      date: "2023-10-15",
      updatedAt: "2023-10-16",
      author: "Especialista Golden Bear",
      readTime: "5 min de leitura",
      image: "/imagens/familia-hero.jpg",
      category: "Educação Financeira",
      content: `
        <p class="lead">A vida militar exige disciplina em todas as áreas, e isso deve se aplicar também às finanças pessoais. Transferências, missões e a estabilidade da carreira oferecem oportunidades únicas, mas também desafios.</p>
        
        <h2>1. Crie um fundo de emergência robusto</h2>
        <p>Diferente de civis, militares podem ser transferidos com frequência. Ter uma reserva que cubra de 3 a 6 meses de despesas é essencial para lidar com custos de mudança não cobertos ou imprevistos familiares durante missões.</p>
        
        <h2>2. Entenda seus benefícios (FAM, Fusex, etc.)</h2>
        <p>Muitos militares gastam com serviços privados que já possuem cobertura similar pela força. Analise o que o sistema de proteção social oferece antes de contratar serviços duplicados.</p>
        
        <h2>3. Cuidado com o crédito consignado</h2>
        <p>A facilidade de crédito para servidores públicos e militares é uma faca de dois gumes. Use com extrema cautela e apenas para investimentos ou dívidas de juros maiores, nunca para consumo.</p>
        
        <h2>4. Proteja sua família com um Seguro de Vida adequado</h2>
        <p>O seguro de vida padrão nem sempre cobre riscos específicos da profissão ou oferece o capital necessário para manter o padrão de vida da sua família. Um seguro privado complementar é vital.</p>
      `
    },
    "cobertura-exterior": {
       title: "Como funciona a cobertura de seguro em missão no exterior?",
       date: "2023-11-02",
       updatedAt: "2023-11-02",
       author: "Especialista Golden Bear",
       readTime: "4 min de leitura",
       image: "/imagens/image-proteja.jpg",
       category: "Dúvidas Frequentes",
       content: "<p>Conteúdo sobre cobertura no exterior...</p>"
    },
    "assistencia-funeral": {
       title: "A importância da Assistência Funeral para a família militar",
       date: "2023-12-10",
       updatedAt: "2023-12-10",
       author: "Especialista Golden Bear",
       readTime: "3 min de leitura",
       image: "/imagens/imagem-familia-call-out.png",
       category: "Benefícios",
       content: "<p>Conteúdo sobre assistência funeral...</p>"
    }
  };
  // @ts-ignore 
  return posts[slug] || null;
};

// CORREÇÃO 1: Atualizar o tipo para Promise
type Props = {
  params: Promise<{ slug: string }>;
};

// CORREÇÃO 2: Aguardar params antes de usar
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; // <--- AWAIT AQUI
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: `Artigo sobre ${post.category}: ${post.title}. Leia mais no blog da Golden Bear Seguros.`,
    openGraph: {
      title: post.title,
      description: "Conteúdo exclusivo para militares.",
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
    },
  };
}

// CORREÇÃO 3: Transformar o componente em async e aguardar params
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params; // <--- AWAIT AQUI
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": `https://www.goldenbearseguros.com.br${post.image}`,
    "datePublished": post.date,
    "dateModified": post.updatedAt,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Golden Bear Seguros",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.goldenbearseguros.com.br/imagens/logo-golden-bear.svg"
      }
    },
    "description": `Artigo sobre ${post.category} focado no público militar.`
  };

  return (
    <>
      <ReadingProgress />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section variant="default" padding="none" className="pt-32 pb-20">
        <Container className="max-w-3xl">
          <Button variant="ghost" asChild className="mb-8 -ml-4 text-muted-foreground hover:text-primary group">
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" /> 
              Voltar para o blog
            </Link>
          </Button>

          <header className="mb-10 border-b border-border pb-10">
            <div className="flex gap-2 mb-6">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                {post.category}
              </span>
            </div>
            
            <Typography variant="h1" className="mb-6 text-4xl md:text-5xl leading-tight">
              {post.title}
            </Typography>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary">
                  <User className="w-4 h-4" />
                </div>
                <span className="font-medium text-foreground">{post.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString('pt-BR')}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </div>
            </div>
          </header>

          <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-lg mb-12">
            {/* OTIMIZAÇÃO LCP: Adicionado 'sizes' */}
            <Image 
              src={post.image} 
              alt={post.title} 
              fill 
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>

          <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-headings:font-bold prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary-hover">
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} />
        </div>

          <div className="mt-12 pt-8 border-t border-border flex justify-between items-center">
            <Typography variant="small" color="muted">
              Compartilhe este artigo:
            </Typography>
            <ShareButton title={post.title} description={`Confira este artigo: ${post.title}`} />
          </div>

          <div className="mt-16 p-10 bg-primary/5 border border-primary/10 rounded-2xl text-center">
            <Typography variant="h3" color="primary" className="mb-4">
              Proteção ideal para sua carreira
            </Typography>
            <Typography variant="body" className="mb-8 max-w-lg mx-auto">
              Aproveite que está pensando no seu futuro e faça uma simulação sem compromisso. Temos condições exclusivas para militares.
            </Typography>
            <Button asChild variant="default" size="hero" className="shadow-xl shadow-primary/20">
              <Link href="/simulador">
                Simular Seguro Agora
              </Link>
            </Button>
          </div>

        </Container>
      </Section>
    </>
  );
}