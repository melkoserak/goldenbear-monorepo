export const banks = [
  // Bancos Tradicionais (Big 5)
  { value: '001', label: '001 - Banco do Brasil' },
  { value: '237', label: '237 - Bradesco' },
  { value: '341', label: '341 - Itaú' },
  { value: '104', label: '104 - Caixa Econômica' },
  { value: '033', label: '033 - Santander' },

  // Bancos Digitais e Fintechs Populares
  { value: '077', label: '077 - Banco Inter' },
  { value: '260', label: '260 - Nubank' },
  { value: '290', label: '290 - PagBank (PagSeguro)' },
  { value: '323', label: '323 - Mercado Pago' },
  { value: '336', label: '336 - C6 Bank' },
  { value: '380', label: '380 - PicPay' },
  { value: '212', label: '212 - Banco Original' },
  { value: '655', label: '655 - Neon (Votorantim)' },
  
  // Bancos de Investimento e Outros
  { value: '208', label: '208 - BTG Pactual' },
  { value: '422', label: '422 - Banco Safra' },
  { value: '041', label: '041 - Banrisul' },
  { value: '070', label: '070 - BRB (Banco de Brasília)' },

  // Cooperativas
  { value: '748', label: '748 - Sicredi' },
  { value: '756', label: '756 - Sicoob' },
  { value: '085', label: '085 - Viacredi' },
].sort((a, b) => a.label.localeCompare(b.label));