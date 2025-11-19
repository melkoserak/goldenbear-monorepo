import { describe, it, expect } from 'vitest';
import { prepareSimulationPayload } from './processor';
import { FrontendFormData } from './types';

describe('MAG Data Processor', () => {
  
  // Mock de dados do formulário (validado pelo Zod anteriormente)
  const mockFormData: FrontendFormData = {
    mag_nome_completo: 'João da Silva',
    mag_cpf: '123.456.789-00', // Com pontuação para testar a limpeza
    mag_data_nascimento: '1990-01-01',
    mag_sexo: 'masculino',
    mag_renda: '5000',
    mag_estado: 'SP',
    mag_profissao_cbo: '010105',
    // Campos opcionais
    mag_email: 'joao@email.com',
  };

  it('deve preparar o payload de simulação corretamente', () => {
    const result = prepareSimulationPayload(mockFormData);

    // Verifica a estrutura básica
    expect(result).toHaveProperty('simulacoes');
    expect(result.simulacoes).toHaveLength(1);
    
    const proponente = result.simulacoes[0].proponente;

    // Testes específicos de regras de negócio:
    
    // 1. CPF deve estar limpo (apenas números)
    expect(proponente.cpf).toBe('12345678900');
    
    // 2. Estado deve ser Uppercase
    expect(proponente.uf).toBe('SP');
    
    // 3. Sexo deve ser convertido para ID (1 = Masculino, 2 = Feminino)
    expect(proponente.sexoId).toBe(1);
    
    // 4. Renda deve ser número float
    expect(proponente.renda).toBe(5000);
    
    // 5. Dados diretos devem bater
    expect(proponente.nome).toBe('João da Silva');
    expect(proponente.dataNascimento).toBe('1990-01-01');
  });

  it('deve converter sexo feminino para ID 2', () => {
    const femaleData = { ...mockFormData, mag_sexo: 'feminino' };
    const result = prepareSimulationPayload(femaleData);
    
    expect(result.simulacoes[0].proponente.sexoId).toBe(2);
  });

  it('deve lidar com renda em formato de string numérica', () => {
    const stringRendaData = { ...mockFormData, mag_renda: '10000.50' };
    const result = prepareSimulationPayload(stringRendaData);
    
    expect(result.simulacoes[0].proponente.renda).toBe(10000.5);
  });
});