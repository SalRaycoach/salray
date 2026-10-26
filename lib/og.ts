import { SITE_URL } from './config'

/**
 * Imagem de compartilhamento única do site (og:image e twitter:image), 1200x630.
 * O "?v=2" força redes sociais e navegadores a buscar a versão nova; ao trocar a
 * imagem de novo, suba o número da versão.
 */
export const OG_IMAGE_PATH = '/images/og/og-sal-ray.jpg'
export const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}?v=2`
export const OG_IMAGE_ALT = 'SAL Ray, Emotional & Life Rebuilding Coach at his desk'

const DEFAULT_OG_PATH = '/images/og/og-default.jpg'

export const OG_IMAGES = [
  { url: OG_IMAGE_URL, width: 1200, height: 630, type: 'image/jpeg', alt: OG_IMAGE_ALT },
]

export const TWITTER_CARD = {
  card: 'summary_large_image' as const,
  images: [{ url: OG_IMAGE_URL, alt: OG_IMAGE_ALT }],
}

// Artigos, áudios e reflexões têm um campo `ogImage` por item. Todos usam o
// og-default.jpg (valor padrão) e passam a usar a imagem nova. Se um item um dia
// tiver uma imagem própria diferente, ela é respeitada.
function customOgPath(ogImage?: string): string | undefined {
  return ogImage && ogImage !== DEFAULT_OG_PATH ? ogImage : undefined
}

export function ogImagesFor(ogImage: string | undefined, alt: string) {
  const custom = customOgPath(ogImage)
  if (!custom) return OG_IMAGES
  return [{ url: `${SITE_URL}${custom}`, width: 1200, height: 630, alt }]
}

export function twitterFor(ogImage: string | undefined, alt: string) {
  const custom = customOgPath(ogImage)
  if (!custom) return TWITTER_CARD
  return { card: 'summary_large_image' as const, images: [{ url: `${SITE_URL}${custom}`, alt }] }
}
