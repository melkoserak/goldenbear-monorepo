// src/stores/useCoverageStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Coverage {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  susep: string;
  isMandatory: boolean;
  isAdjustable: boolean;
  minCapital: number;
  maxCapital: number;
  baseCapital: number;
  basePremium: number;
  calculationType: number;
  originalData: ApiCoverage; 
  isActive: boolean;
  currentCapital: number;
}

export interface ApiCoverage {
  itemProdutoId?: string;
  id?: string;
  descricao?: string;
  descricaoDigitalCurta?: string;
  descricaoDigitalLonga?: string;
  numeroProcessoSusep?: string;
  obrigatoria?: boolean;
  tipoId?: number;
  valorMinimoCapitalContratacao?: string;
  capitalBase?: string;
  limite?: string;
  premioBase?: string;
  custoFixo?: string;
  questionariosPorFaixa?: {
      questionarios: {
          idQuestionario: string;
      }[];
  }[];
  productId?: number;
}

interface ApiProduct {
  idProduto: number;
  coberturas: ApiCoverage[];
}

type ApiData = {
  Valor?: {
    simulacoes?: {
      produtos?: ApiProduct[];
    }[];
  };
};

type CoverageState = {
  coverages: Coverage[];
  mainSusep: string | null;
  setInitialCoverages: (apiData: ApiData) => void;
  toggleCoverage: (id: string) => void;
  updateCapital: (id: string, capital: number) => void;
  getCalculatedPremium: (coverage: Coverage) => number;
  getTotalPremium: () => number;
  getTotalIndemnity: () => number;
};

const normalizeApiData = (apiData: ApiData): { coverages: Coverage[], mainSusep: string | null } => {
  const products = apiData?.Valor?.simulacoes?.[0]?.produtos;
  if (!products || products.length === 0) {
    console.error("Estrutura da API inesperada. 'produtos' não encontrado ou vazio.");
    return { coverages: [], mainSusep: null };
  }

  // 1. Tenta encontrar o produto preferencial (ID 2096)
  const preferredProduct = products.find((p) => p.idProduto === 2096);
  
  // 2. CORREÇÃO: Se não achar o preferido, pega APENAS O PRIMEIRO da lista.
  // Antes estava pegando 'products' inteiro (todos), o que duplicava as coberturas.
  const targetProduct = preferredProduct || products[0];
  
  // Garantimos que é um array para o flatMap funcionar, mas agora sempre terá apenas 1 item.
  const productsToProcess = [targetProduct];
  
  console.log(`[useCoverageStore] Produto selecionado: ID ${targetProduct.idProduto} ${preferredProduct ? '(Preferencial)' : '(Fallback)'}`);

  const mainSusep = productsToProcess[0]?.coberturas?.[0]?.numeroProcessoSusep || null;

  const allCoverages: Coverage[] = productsToProcess.flatMap(
    (product: ApiProduct) =>
      product.coberturas.map((cov: ApiCoverage) => {
        const baseCapital = parseFloat(cov.capitalBase || '0');
        const apiMinCapital = parseFloat(cov.valorMinimoCapitalContratacao || '0') || baseCapital || 0;
        const minCapital = Math.max(apiMinCapital, 20000);

        return {
          id: `${product.idProduto}-${cov.itemProdutoId || cov.id || cov.descricao}`,
          name: cov.descricao || "Cobertura sem nome",
          description: cov.descricaoDigitalCurta || "Descrição não fornecida.", 
          longDescription: cov.descricaoDigitalLonga || "Detalhes não fornecidos.",
          susep: cov.numeroProcessoSusep || 'N/A',
          isAdjustable: cov.tipoId === 3, 
          calculationType: cov.tipoId || 0,
          isMandatory: cov.obrigatoria === true,
          minCapital: minCapital,
          maxCapital: parseFloat(cov.limite || '0'),
          baseCapital: baseCapital,
          basePremium: parseFloat(cov.premioBase || '0'),
          isActive: cov.obrigatoria === true || true,
          currentCapital: Math.max(baseCapital, minCapital),
          originalData: { ...cov, productId: product.idProduto },
        };
      })
  );
  
  // Remove duplicatas por nome, apenas por segurança extra
  const uniqueCoverages = Array.from(new Map(allCoverages.map((c: Coverage) => [c.name, c])).values());
  
  return { coverages: uniqueCoverages, mainSusep };
};

export const useCoverageStore = create<CoverageState>()(
  persist(
    (set, get) => ({
      coverages: [],
      mainSusep: null,
      setInitialCoverages: (apiData) => {
        const { coverages, mainSusep } = normalizeApiData(apiData);
        set({ coverages, mainSusep });
      },
      toggleCoverage: (id) => set((state) => ({ coverages: state.coverages.map((c) => c.id === id && !c.isMandatory ? { ...c, isActive: !c.isActive } : c) })),
      updateCapital: (id, capital) => set((state) => ({ coverages: state.coverages.map((c) => c.id === id ? { ...c, currentCapital: capital } : c) })),
      getCalculatedPremium: (coverage) => {
        if (!coverage.isActive) return 0;
        const custoFixo = parseFloat(coverage.originalData?.custoFixo || '0');
        if (coverage.calculationType === 3 && coverage.baseCapital > 0) {
          return custoFixo + (coverage.currentCapital / coverage.baseCapital) * coverage.basePremium;
        }
        return custoFixo + coverage.basePremium;
      },
      getTotalPremium: () => {
        const { coverages, getCalculatedPremium } = get();
        return coverages.reduce((total, cov) => total + getCalculatedPremium(cov), 0);
      },
      getTotalIndemnity: () => {
        const { coverages } = get();
        return coverages.reduce((total, cov) => (cov.isActive ? total + cov.currentCapital : total), 0);
      },
    }),
    {
      name: 'goldenbear-coverage-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);