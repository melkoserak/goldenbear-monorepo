import { test, expect } from '@playwright/test';

test.describe('Simulador - Happy Path (Fluxo Completo)', () => {
  
  test.beforeEach(async ({ page }) => {
    // --- MOCKS (Mantidos) ---
    await page.route('**/api/professions', async route => {
      await route.fulfill({ json: [{ value: '010105', label: 'Oficial General' }] });
    });

    await page.route('**/api/simulation', async route => {
      await route.fulfill({ 
        json: {
          Valor: {
            simulacoes: [{
              produtos: [{
                id: 2096,
                descricao: "Vida Militar Premium",
                coberturas: [
                  { id: 1, descricao: "Morte", capitalBase: 100000, premioBase: 50.00, obrigatoria: true, tipo: { id: 1 } },
                  { id: 2, descricao: "Invalidez", capitalBase: 100000, premioBase: 20.00, obrigatoria: false, tipo: { id: 1 } }
                ]
              }]
            }]
          }
        }
      });
    });

    await page.route('**/api/questionnaire/**', async route => {
      await route.fulfill({
        json: {
          Valor: {
            VersaoQuestionario: [{
              Perguntas: [
                { 
                  Id: 101, 
                  Descricao: "Você é fumante?", 
                  Obrigatorio: true,
                  TipoItem: { Id: 1 }, 
                  TipoResposta: { Id: 1 },
                  Opcoes: [{ Id: 1, Descricao: "Sim" }, { Id: 2, Descricao: "Não" }]
                }
              ]
            }]
          }
        }
      });
    });

    await page.route('**/api/proposal', async route => {
      await route.fulfill({ json: { proposal_number: "PROP-123456-TEST" } });
    });
    
    await page.route('**/api/**/token', async route => route.fulfill({ json: { token: 'mock-token' } }));
    await page.route('**/api/signature/request', async route => route.fulfill({ json: { success: true } }));
    await page.route('**/api/signature/verify', async route => route.fulfill({ json: { success: true } }));
  });

  test('Deve completar o fluxo de ponta a ponta com sucesso', async ({ page }) => {
    test.setTimeout(120000); 

    console.log('Acessando página inicial...');
    
    // CORREÇÃO CRÍTICA AQUI: Aponta para o basePath correto
    await page.goto('/simulador', { waitUntil: 'domcontentloaded' });

    // Validação inicial
    await expect(page).toHaveTitle(/Golden Bear/i);
    await expect(page.getByText('Descubra o plano ideal')).toBeVisible({ timeout: 30000 });

    console.log('Página carregada. Iniciando preenchimento...');

    // --- STEP 1: Nome ---
    const nameInput = page.getByPlaceholder('Seu nome completo');
    await expect(nameInput).toBeVisible();
    await nameInput.fill('João Teste Automatizado');
    
    // Clica fora para garantir que o evento de validação dispare (onBlur/onChange)
    await page.getByText('Dados iniciais').click();

    const nextButton = page.getByRole('button', { name: 'Próximo' });
    
    // Espera explicita pelo botão ficar habilitado
    await expect(nextButton).toBeEnabled({ timeout: 10000 });
    
    await nextButton.click();

    // --- STEP 2: Contato ---
    await page.getByLabel(/CPF/i).fill('38906891830');
    await page.getByLabel(/E-mail/i).fill('teste@playwright.com');
    await page.getByLabel(/Celular/i).fill('11999999999');
    
    await page.getByPlaceholder('Selecione...').click();
    await page.getByRole('option', { name: 'São Paulo' }).click();
    
    await page.getByLabel(/Concordo com a Política/i).check();
    await page.getByRole('button', { name: 'Continuar' }).click();

    // --- STEP 3: Detalhes ---
    await page.getByLabel(/Data de Nascimento/i).fill('1990-01-01');
    await page.getByText('Masculino').click();
    
    await page.getByPlaceholder('Selecione...').first().click();
    await page.getByRole('option').first().click();
    
    await page.getByPlaceholder('Digite para buscar...').click();
    await page.getByRole('option').first().click();
    
    await page.getByRole('button', { name: 'Ver Opções de Seguro' }).click();

    // --- STEP 4: Coberturas ---
    await expect(page.getByText('Vida Militar Premium')).toBeVisible();
    await page.getByRole('button', { name: 'Continuar' }).click();

    // --- STEP 5: Resumo ---
    await page.getByRole('button', { name: 'Iniciar contratação' }).click();

    // --- STEP 6: Endereço ---
    await page.getByLabel(/CEP/i).fill('01001000');
    await page.getByLabel(/Logradouro/i).fill('Praça da Sé'); 
    await page.getByLabel(/Número/i).fill('100');
    await page.getByLabel(/Bairro/i).fill('Sé');
    await page.getByLabel(/Cidade/i).fill('São Paulo');
    await page.getByRole('button', { name: 'Próximo' }).click();

    // --- STEP 7: Perfil Detalhado ---
    await page.getByPlaceholder('Selecione...').click();
    await page.getByRole('option', { name: 'Casado' }).click();
    
    await page.getByLabel(/Instituição/i).fill('Exército');
    await page.getByLabel(/Filhos/i).fill('0');
    
    await page.getByLabel(/Número do RG/i).fill('123456789');
    await page.getByLabel(/Órgão Emissor/i).fill('SSP');
    await page.getByLabel(/Data de Expedição/i).fill('2010-01-01');
    
    await page.getByText('Não', { exact: true }).click();
    
    await page.getByRole('button', { name: 'Próximo' }).click();

    // --- STEP 8: Beneficiários ---
    await page.getByLabel(/Nome Completo/i).fill('Maria Teste');
    await page.getByLabel(/Data de Nascimento/i).fill('1990-05-05');
    
    await page.getByPlaceholder('Selecione...').click();
    await page.getByRole('option', { name: 'Cônjuge' }).click();
    
    await page.getByLabel(/Porcentagem/i).fill('100');
    
    await page.getByRole('button', { name: 'Próximo' }).click();

    // --- STEP 9: DPS ---
    await expect(page.getByText('Você é fumante?')).toBeVisible();
    await page.locator('label').filter({ hasText: 'Não' }).click();
    
    await page.getByRole('button', { name: 'Confirmar Respostas' }).click();

    // --- STEP 10: Pagamento ---
    await page.locator('.cursor-pointer').first().click(); 
    
    await page.getByLabel(/Número do Cartão/i).fill('4111111111111111');
    await page.getByLabel(/Nome Impresso/i).fill('JOAO TESTE');
    await page.getByLabel(/Validade/i).fill('12/30');
    await page.getByLabel(/CVV/i).fill('123');
    
    await page.getByRole('button', { name: 'Revisar e Finalizar' }).click();

    // --- STEP 11: Assinatura ---
    await page.getByRole('button', { name: /Enviar Código/i }).click();
    
    const tokenInput = page.locator('input[placeholder="0 0 0 0 0 0"]');
    await expect(tokenInput).toBeVisible();
    await tokenInput.fill('123456');
    
    await page.getByRole('button', { name: 'Validar e Finalizar' }).click();

    // --- STEP 12: Sucesso ---
    await expect(page.getByText('Parabéns!')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('PROP-123456-TEST')).toBeVisible();
  });
});