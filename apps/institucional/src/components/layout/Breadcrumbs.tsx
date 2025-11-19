// apps/institucional/src/components/layout/Breadcrumbs.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ArrowLeft, Home } from "lucide-react";
import { Container, Typography } from "@goldenbear/ui";

const routeMap: Record<string, string> = {
  "seguro-militar": "Seguro Militar",
  "produtos": "Produtos",
  "blog": "Blog",
  "quem-somos": "Quem Somos",
  "contato": "Contato",
  "duvidas-frequentes": "Dúvidas Frequentes",
  "exercito": "Exército",
  "marinha": "Marinha",
  "aeronautica": "Aeronáutica",
  "policia-militar": "Polícia Militar",
  "bombeiros": "Bombeiros",
  "seguro-vida-morte": "Seguro de Vida (Morte)",
  "doencas-graves": "Doenças Graves",
  "invalidez-acidente": "Invalidez por Acidente",
  "assistencia-funeral": "Assistência Funeral",
};

export const Breadcrumbs = () => {
  const pathname = usePathname();
  
  if (pathname === "/") return null;

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  // Lógica para o Mobile (nível pai)
  const parentPath = pathSegments.length > 1 
    ? `/${pathSegments.slice(0, pathSegments.length - 1).join("/")}`
    : "/";
  
  const parentSegmentRaw = pathSegments.length > 1 
    ? pathSegments[pathSegments.length - 2] 
    : "Início";
    
  const parentLabel = parentSegmentRaw === "Início" 
    ? "Início" 
    : (routeMap[parentSegmentRaw] || parentSegmentRaw.replace(/-/g, " "));

  return (
    <div className="w-full py-2 md:py-3 bg-accent/30 border-b border-border/50">
      <Container>
        
        {/* --- VISÃO MOBILE: Back Link Discreto --- */}
        {/* Alterações: text-xs, opacidade/60, ícone menor (w-3) */}
        <div className="md:hidden flex items-center">
          <Link 
            href={parentPath} 
            className="inline-flex items-center text-xs text-muted-foreground/60 hover:text-primary transition-colors py-2"
          >
            <ArrowLeft className="w-3 h-3 mr-1.5" />
            Voltar para {parentLabel}
          </Link>
        </div>

        {/* --- VISÃO DESKTOP: Breadcrumb Completo (Inalterado) --- */}
        <nav aria-label="Breadcrumb" className="hidden md:block">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                <Home className="w-4 h-4" />
                <span className="sr-only">Início</span>
              </Link>
            </li>

            {pathSegments.map((segment, index) => {
              const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
              const isLast = index === pathSegments.length - 1;
              const label = routeMap[segment] || segment.replace(/-/g, " ");

              return (
                <li key={href} className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground/50" />
                  {isLast ? (
                    <Typography variant="small" color="default" className="font-medium capitalize truncate max-w-[200px] lg:max-w-none">
                      {label}
                    </Typography>
                  ) : (
                    <Link href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors capitalize">
                      {label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

      </Container>
    </div>
  );
};