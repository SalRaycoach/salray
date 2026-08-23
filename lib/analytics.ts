/**
 * Camada de analytics agnóstica de provedor — empurra para window.dataLayer,
 * compatível com Google Tag Manager / GA4 assim que o container for conectado.
 * Nenhuma ferramenta de analytics foi especificada no brief; isto implementa
 * os eventos da seção 8 sem travar em um provedor específico.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

export type AnalyticsEvent =
  | 'consultation_cta_click'
  | 'consultation_booking_started'
  | 'consultation_booking_completed'
  | 'community_cta_click'
  | 'messenger_cta_click'
  | 'resource_article_view'
  | 'resource_category_view'
  | 'contact_form_submit'
  | 'faq_expand'
  | 'scroll_50'
  | 'scroll_90'
  | 'stable_method_scroll_75'
  | 'ApplicationStart' // 4-Week Experience — PascalCase kept to match Meta Events Manager naming (brief section 12)
  // Página PT "Reconstrução Emocional" — ver briefing seção 17. purchase não é
  // disparado por este helper: deve vir da própria Payhip após conclusão real
  // do checkout, nunca no clique nem em uma página de agradecimento própria.
  | 'view_offers_pt'
  | 'select_offer'
  | 'begin_checkout'
  | 'whatsapp_click'
  | 'video_start'
  | 'video_progress'
  | 'video_complete'
  | 'notify_me_submit' // captura "avise-me quando estiver pronto" — ofertas em gravação, ver briefing 23 ago 2026
  // "Reflexões SAL Ray" — biblioteca de áudios, ver PROMPT_REFLEXOES_SAL_RAY.md seção 8.
  | 'audio_play'
  | 'audio_25'
  | 'audio_50'
  | 'audio_75'
  | 'audio_complete'
  | 'audio_share_click'
  | 'related_audio_click'
  | 'product_cta_click'

export function trackEvent(event: AnalyticsEvent, payload: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...payload })
  window.gtag?.('event', event, payload)
  window.fbq?.('trackCustom', event, payload)
}

/**
 * Meta standard events (ViewContent, Lead) must fire via fbq('track', ...),
 * not fbq('trackCustom', ...), so Meta recognizes them for ad optimization
 * and reporting — trackEvent() above always uses trackCustom, which is
 * correct for events that aren't part of Meta's standard event list.
 */
export type MetaStandardEvent = 'ViewContent' | 'Lead'

export function trackMetaEvent(event: MetaStandardEvent, payload: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  window.fbq?.('track', event, payload)
}
