// packages/ui/src/index.ts

// Componentes de UI (Seguros de exportar)
export * from "./components/button";
export * from "./components/dialog";
export * from "./components/sheet";
export * from "./components/accordion";
export * from "./components/input";
export * from "./components/slider";
export * from "./components/switch";
export * from "./components/popover";
export * from "./components/command";
export * from "./components/autocomplete";
export * from "./components/accessibility-controls";
export * from "./components/tooltip";
export * from "./components/section";
export * from "./components/container";
export * from "./components/typography";
export * from "./components/carousel";
export * from "./components/textarea";
export * from "./components/label";
export * from "./components/feature-card";
export * from "./components/section-header";
export { Skeleton } from "./components/skeleton";
export * from "./components/grid";
export * from "./components/select";

// Utils e Hooks (Seguros)
export * from "./lib/utils";
export * from "./hooks/useDebounce";

// --- REMOVIDO: export * from "./lib/html-utils"; ---
// Esta linha causava o erro. Quem precisar (como o Simulador),
// deve importar direto de "@goldenbear/ui/lib/html-utils"