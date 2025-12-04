# UI Component Index (@goldenbear/ui)

**ATENÇÃO IA:** Antes de criar qualquer HTML/CSS, verifique se o componente já existe nesta lista. Use os componentes importando de `@goldenbear/ui/components/<nome>`.

## Primitivos (Baseados em Radix UI + Shadcn)
- **Accordion:** `accordion.tsx` - Listas colapsáveis (usado em FAQ).
- **Button:** `button.tsx` - Variantes: `default` (Amarelo), `secondary` (Preto), `outline`, `ghost`, `link`.
- **Dialog:** `dialog.tsx` - Modais de confirmação e alertas.
- **Input:** `input.tsx` - Campos de texto base.
- **Label:** `label.tsx` - Rótulos de formulário acessíveis.
- **Select:** `select.tsx` - Dropdowns nativos/customizados.
- **Sheet:** `sheet.tsx` - Painéis laterais (usado no Menu Mobile e Detalhes de Cobertura).
- **Skeleton:** `skeleton.tsx` - Loading states (placeholders).
- **Slider:** `slider.tsx` - Seleção de valores (Renda/Capital).
- **Switch:** `switch.tsx` - Toggles (Sim/Não).
- **Textarea:** `textarea.tsx` - Campos de texto longos.
- **Tooltip:** `tooltip.tsx` - Dicas flutuantes.

## Layout & Estrutura
- **Container:** `container.tsx` - Wrapper centralizado com padding responsivo.
- **Grid:** `grid.tsx` - Sistema de grid simplificado.
- **Section:** `section.tsx` - Wrapper de seção com variantes de background (ex: `primary-gradient`).
- **SectionHeader:** `section-header.tsx` - Título e subtítulo padronizados para seções.

## Componentes Ricos
- **Autocomplete:** `autocomplete.tsx` - Combobox com busca (usado para Estados/Profissões).
- **Calendar:** `calendar.tsx` - Seleção de data.
- **Carousel:** `carousel.tsx` - Sliders de conteúdo.
- **FeatureCard:** `feature-card.tsx` - Cards de destaque com ícone.
- **Typography:** `typography.tsx` - Componente único para textos. Variantes: `display`, `h1`-`h6`, `body`, `small`, `muted`.

## Utilitários
- **FontSizeManager:** `font-size-manager.tsx` - Controle de acessibilidade (A+ A-).
- **ThemeProvider:** `theme-provider.tsx` - Contexto de Dark/Light mode.