// apps/simulador/src/lib/mag-api/questionnaireUtils.ts

// 1. Definição dos Tipos Locais (para uso interno da função)
export interface MagNode {
  Id: number;
  TipoItem: { Sigla: string }; // 'Pergunta', 'Agrupador'
  Opcoes?: MagOption[];
  Perguntas?: MagNode[]; // Agrupadores podem ter perguntas filhas
  Resposta?: string; // O campo que vamos injetar
  [key: string]: any; // Permite outras props originais
}

export interface MagOption {
  Id: number;
  Descricao: string;
  SubItens?: MagNode[];
  [key: string]: any;
}

/**
 * Percorre recursivamente a árvore do questionário e injeta as respostas.
 */
export function fillQuestionnaireTree(
  originalStructure: any,
  userAnswers: Record<string, { value: string; optionId?: number }>
): string {
  
  // Deep clone para não mutar o original
  const structureClone = JSON.parse(JSON.stringify(originalStructure));

  const processNode = (node: MagNode) => {
    // Se existe resposta do usuário para este ID de pergunta
    if (userAnswers[node.Id]) {
      const answer = userAnswers[node.Id];
      
      // REGRA 3: A resposta deve ser sempre String
      node.Resposta = String(answer.value);
    }

    // Recursão: Processar Filhos (Agrupadores)
    if (node.Perguntas && Array.isArray(node.Perguntas)) {
      node.Perguntas.forEach(processNode);
    }

    // Recursão: Processar Opções e seus SubItens
    if (node.Opcoes && Array.isArray(node.Opcoes)) {
      node.Opcoes.forEach((option) => {
        if (option.SubItens && Array.isArray(option.SubItens)) {
          option.SubItens.forEach(processNode);
        }
      });
    }
  };

  // Identifica o ponto de entrada da árvore (pode variar dependendo da API)
  if (Array.isArray(structureClone)) {
    structureClone.forEach(processNode);
  } else if (structureClone.Perguntas && Array.isArray(structureClone.Perguntas)) {
    structureClone.Perguntas.forEach(processNode);
  } else if (structureClone.VersaoQuestionario?.[0]?.Perguntas) {
    structureClone.VersaoQuestionario[0].Perguntas.forEach(processNode);
  } else if (structureClone.Valor?.VersaoQuestionario?.[0]?.Perguntas) {
    structureClone.Valor.VersaoQuestionario[0].Perguntas.forEach(processNode);
  }

  return JSON.stringify(structureClone);
}