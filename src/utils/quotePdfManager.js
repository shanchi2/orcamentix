/**
 * Gerenciador de PDFs de Orçamentos
 * Escolhe automaticamente o modelo correto baseado no plano do usuário
 */

import { makeQuotePdfBasic } from './makeQuotePdfBasic'
import { makeQuotePdfPlus } from './makeQuotePdfPlus'
import { makeQuotePdfPremium } from './makeQuotePdfPremium'

/**
 * Gera PDF do orçamento no modelo apropriado
 * @param {Object} quote - Dados do orçamento
 * @param {Object} user - Dados do usuário (contém plano e dados da empresa)
 */
export function generateQuotePdf(quote, user = {}) {
  const plan = user?.plan || 'free' // 'free', 'plus', 'premium'
  const userCompany = {
    name: user?.company?.name || user?.name || 'Sua Empresa',
    logo: user?.company?.logo || null, // URL ou base64 da logo
    tagline: user?.company?.tagline || null,
    phone: user?.company?.phone || user?.phone || null,
    email: user?.company?.email || user?.email || null,
    brandColor: user?.company?.brandColor || null, // [R, G, B]
  }

  // Escolhe o modelo baseado no plano
  switch (plan.toLowerCase()) {
    case 'premium':
      return makeQuotePdfPremium(quote, userCompany)
    
    case 'plus':
      return makeQuotePdfPlus(quote, userCompany)
    
    case 'free':
    case 'basic':
    default:
      return makeQuotePdfBasic(quote)
  }
}

/**
 * Função legada para compatibilidade
 * Usa o modelo básico por padrão
 */
export function makeQuotePdf(quote) {
  return makeQuotePdfBasic(quote)
}

/**
 * Gera preview do PDF sem fazer download
 * Útil para visualização antes de salvar
 */
export function previewQuotePdf(quote, user = {}) {
  // Implementação futura
  console.log('Preview não implementado ainda')
}
