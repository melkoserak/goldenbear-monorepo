# Fluxo de Dados - Simulador Golden Bear

Este documento descreve o ciclo de vida dos dados desde a entrada do usuário até a persistência na seguradora.

## Diagrama de Sequência (Cotação)

```mermaid
sequenceDiagram
    participant User as Usuário (Browser)
    participant Step as React Component (StepForm)
    participant Store as Zustand Store (Client)
    participant BFF as Next.js API Route (/api/simulation)
    participant MAG as MAG Seguros API

    Note over User, Step: Input de Dados
    User->>Step: Preenche CPF, Renda, Profissão
    Step->>Step: Validação Zod (Schema Client)
    
    alt Dados Inválidos (ex: CPF Errado)
        Step-->>User: Mostra Erro no Input (React Hook Form)
        Note right of User: O request NUNCA sai do browser
    else Dados Válidos
        Step->>Store: Atualiza Estado Global (setFormData)
        Step->>BFF: POST /api/simulation (JSON)
    end

    Note over BFF, MAG: Camada de Segurança (Server)
    BFF->>BFF: Validação Zod (Schema Server + Sanitização)
    BFF->>BFF: Injeta API Tokens (Server-side env vars)
    BFF->>MAG: POST /apiseguradora/v3/simulacao
    
    alt Erro API MAG
        MAG-->>BFF: 400/500 Error
        BFF->>BFF: Loga erro detalhado (MAG_Logger)
        BFF-->>Step: Retorna JSON de Erro Amigável
    else Sucesso
        MAG-->>BFF: JSON Cotação
        BFF->>BFF: Enriquece dados (Opcional)
        BFF-->>Step: Retorna JSON Cotação
    end

    Step->>Store: Salva Cotação Recebida
    Step->>User: Redireciona para Próximo Passo