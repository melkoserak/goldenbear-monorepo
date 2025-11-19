import { useQuery, useMutation } from '@tanstack/react-query';
import { getProfessions, getAddressByZipCode, getSimulation } from '@/services/apiService';
import { useSimulatorStore } from '@/stores/useSimulatorStore';

// Hook para Profissões (Cache de 24h)
export function useProfessions() {
  return useQuery({
    queryKey: ['professions'],
    queryFn: getProfessions,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
  });
}

// Hook para Endereço (Disparado apenas quando CEP é válido)
export function useAddress(zipCode: string) {
  const cleanZip = zipCode?.replace(/\D/g, '') || '';
  const isValidZip = cleanZip.length === 8;

  return useQuery({
    queryKey: ['address', cleanZip],
    queryFn: () => getAddressByZipCode(cleanZip),
    enabled: isValidZip, // Só roda se o CEP for válido
    staleTime: 1000 * 60 * 60, // 1 hora
    retry: false,
  });
}

// Hook para Simulação
// Aqui usamos useMutation ou useQuery? 
// Como depende de vários campos e é uma ação "pesada", useQuery com enable condicional é ótimo.
export function useSimulation() {
  const formData = useSimulatorStore((state) => state.formData);
  
  const payload = {
    mag_nome_completo: formData.fullName,
    mag_cpf: formData.cpf,
    mag_data_nascimento: formData.birthDate,
    mag_sexo: formData.gender,
    mag_renda: formData.income,
    mag_estado: formData.state,
    mag_profissao_cbo: formData.profession,
  };

  // Verifica se tem os dados mínimos
  const isReady = !!(formData.birthDate && formData.income && formData.profession);

  return useQuery({
    queryKey: ['simulation', payload], // Recalcula se o payload mudar
    queryFn: () => getSimulation(payload),
    enabled: isReady,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: false,
  });
}