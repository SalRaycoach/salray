/**
 * Camada de analytics agnóstica de provedor — empurra para window.dataLayer,
 * compatível com Google Tag Manager / GA4 assim que o container for conectado.
 * Nenhuma ferramenta de analytics foi especificada no brief; isto implementa
 * os eventos da seção 8 sem travar em um provedor específico.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

export type AnalyticsEvent =
  | 'consultation_cta_click'
  | 'consultation_booking_started'
  | 'consultation_booking_completed'
  | 'community_cta_click'
  | 'whatsapp_cta_click'
  | 'resource_article_view'
  | 'resource_category_view'
  | 'contact_form_submit'
  | 'faq_expand'
  | 'scroll_50'
  | 'scroll_90'

export function trackEvent(event: AnalyticsEvent, payload: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...payload })
}
