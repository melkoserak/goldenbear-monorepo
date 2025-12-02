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
  id?: string | number;
  descricao?: string;
  descricaoComercial?: string; // <--- ADICIONADO AQUI
  descricaoDigitalCurta?: string;
  descricaoDigitalLonga?: string;
  numeroProcessoSusep?: string;
  obrigatoria?: boolean;
  tipo?: { id: number; descricao: string };
  tipoId?: number;
  valorMinimoCapitalContratacao?: string | number;
  capitalBase?: string | number;
  limite?: string | number;
  premioBase?: string | number;
  custoFixo?: string | number;
  valorFixo?: number;
  capitalFixo?: number;
  questionariosPorFaixa?: {
      questionarios: {
          idQuestionario: string;
      }[];
  }[];
  productId?: number;
}

interface ApiProduct {
  id: number;
  idProduto?: number;
  descricao: string;
  coberturas: ApiCoverage[];
}

type ApiData = {
  Valor?: {
    simulacoes?: { produtos?: ApiProduct[] }[];
    produtos?: ApiProduct[];
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
  let products: ApiProduct[] = [];
  
  if (apiData?.Valor?.produtos) {
      products = apiData.Valor.produtos;
  } else if (apiData?.Valor?.simulacoes?.[0]?.produtos) {
      products = apiData.Valor.simulacoes[0].produtos;
  }

  if (!products || products.length === 0) {
    console.error("Estrutura da API inesperada. 'produtos' não encontrado.");
    return { coverages: [], mainSusep: null };
  }

  const targetProduct = products.find((p) => p.id === 2096 || p.idProduto === 2096) || products[0];
  const productId = targetProduct.id || targetProduct.idProduto || 0;
  
  console.log(`[useCoverageStore] Produto selecionado: ${targetProduct.descricao} (ID ${productId})`);

  const mainSusep = targetProduct.coberturas?.[0]?.numeroProcessoSusep || null;

  const coverages: Coverage[] = targetProduct.coberturas.map((cov: ApiCoverage) => {
      const apiCapitalBase = Number(cov.capitalBase || cov.capitalFixo || 0);
      const apiMinCapital = Number(cov.valorMinimoCapitalContratacao || apiCapitalBase || 0);
      const apiMaxCapital = Number(cov.limite || apiCapitalBase * 10 || 0);
      
      const apiBasePremium = Number(cov.valorFixo || cov.premioBase || 0);

      const coverageId = cov.id || cov.itemProdutoId;
      const tipoId = cov.tipo?.id || cov.tipoId || 0;
      const isAdjustable = tipoId === 3 && !cov.valorFixo;

      return {
        id: `${productId}-${coverageId}`,
        name: cov.descricao || "Cobertura",
        description: cov.descricaoDigitalCurta || cov.descricaoComercial || "Sem descrição.",
        longDescription: cov.descricaoDigitalLonga || "",
        susep: cov.numeroProcessoSusep || 'N/A',
        isMandatory: cov.obrigatoria === true,
        isActive: true,
        isAdjustable: isAdjustable,
        calculationType: tipoId,
        minCapital: Math.max(apiMinCapital, 1000),
        maxCapital: apiMaxCapital,
        baseCapital: apiCapitalBase,
        basePremium: apiBasePremium,
        currentCapital: Math.max(apiCapitalBase, apiMinCapital),
        originalData: { ...cov, productId: productId },
      };
  });
  
  return { coverages, mainSusep };
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
      toggleCoverage: (id) => set((state) => ({
        coverages: state.coverages.map((c) => 
          c.id === id && !c.isMandatory ? { ...c, isActive: !c.isActive } : c
        ) 
      })),
      updateCapital: (id, capital) => set((state) => ({ 
        coverages: state.coverages.map((c) => c.id === id ? { ...c, currentCapital: capital } : c) 
      })),
      getCalculatedPremium: (coverage) => {
        if (!coverage.isActive) return 0;
        if (coverage.basePremium > 0 && !coverage.isAdjustable) {
            return coverage.basePremium;
        }
        if (coverage.isAdjustable && coverage.baseCapital > 0) {
          return (coverage.currentCapital / coverage.baseCapital) * coverage.basePremium;
        }
        return coverage.basePremium;
      },
      getTotalPremium: () => {
        const { coverages, getCalculatedPremium } = get();
        return coverages.reduce((total, cov) => total + getCalculatedPremium(cov), 0);
      },
      getTotalIndemnity: () => {
        const { coverages } = get();
        return coverages.reduce((total, cov) => {
             if (!cov.isActive) return total;
             return cov.currentCapital > 10000 ? total + cov.currentCapital : total;
        }, 0);
      },
    }),
    {
      name: 'goldenbear-coverage-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);