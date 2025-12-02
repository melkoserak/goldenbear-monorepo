// apps/simulador/src/lib/mag-api/questionnaireUtils.ts

export interface MagNode {
  Id: number;
  TipoItem: { Sigla: string }; 
  Opcoes?: MagOption[];
  Perguntas?: MagNode[]; 
  Resposta?: string; 
  [key: string]: any; 
}

export interface MagOption {
  Id: number;
  Descricao: string;
  SubItens?: MagNode[];
  [key: string]: any;
}

/**
 * Percorre recursivamente a árvore do questionário e injeta as respostas.
 * Retorna o OBJETO (não string) para evitar dupla serialização.
 */
export function fillQuestionnaireTree(
  originalStructure: any,
  userAnswers: Record<string, { value: string; optionId?: number }>
): any {
  
  // 1. Unwrap 'Valor' se existir (Remove o envelope da API)
  let rootData = originalStructure;
  if (originalStructure && originalStructure.Valor) {
    rootData = originalStructure.Valor;
  }

  // 2. Deep clone do dado limpo
  const structureClone = JSON.parse(JSON.stringify(rootData));

  const processNode = (node: MagNode) => {
    // Se existe resposta do usuário para este ID de pergunta
    if (userAnswers[node.Id]) {
      const answer = userAnswers[node.Id];
      
      // A resposta deve ser sempre String na estrutura da MAG
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

  // Identifica o ponto de entrada e processa
  if (Array.isArray(structureClone)) {
    structureClone.forEach(processNode);
  } else if (structureClone.VersaoQuestionario?.[0]?.Perguntas) {
    structureClone.VersaoQuestionario[0].Perguntas.forEach(processNode);
  } else if (structureClone.Perguntas && Array.isArray(structureClone.Perguntas)) {
    structureClone.Perguntas.forEach(processNode);
  }

  // Retorna o OBJETO modificado
  return structureClone;
}