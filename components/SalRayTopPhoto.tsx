import ReactDOM from 'react-dom'

const BASE = '/images/sal-ray/retrato-topo'
// A foto original tem 1122 px de largura, então o maior arquivo é de 1122 px (sem ampliar).
const SRC_SET = `${BASE}-640.webp 640w, ${BASE}-960.webp 960w, ${BASE}-1122.webp 1122w`
export const SAL_RAY_TOP_PHOTO_ALT = 'Sal Ray, Emotional & Life Rebuilding Coach'

/**
 * Retrato de Sal Ray do topo das páginas (primeira dobra). Um único conjunto de arquivos WebP para
 * o site todo (640, 960 e 1122 px), com srcset, preload, carregamento prioritário (nunca lazy) e
 * enquadramento que mantém o rosto: o rosto fica na parte de cima da foto, então o object-position
 * prioriza o topo caso algum bloco use altura fixa. Cada página passa o próprio `sizes` e `className`
 * para manter o tamanho, os cantos e a posição que já tinha.
 */
export default function SalRayTopPhoto({
  sizes,
  className = 'w-full h-auto object-cover rounded-lg',
  style,
}: {
  sizes: string
  className?: string
  style?: React.CSSProperties
}) {
  ReactDOM.preload(`${BASE}-960.webp`, {
    as: 'image',
    imageSrcSet: SRC_SET,
    imageSizes: sizes,
    fetchPriority: 'high',
  })

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${BASE}-960.webp`}
      srcSet={SRC_SET}
      sizes={sizes}
      alt={SAL_RAY_TOP_PHOTO_ALT}
      width={1122}
      height={1274}
      fetchPriority="high"
      decoding="async"
      className={className}
      style={{ objectPosition: '50% 15%', ...style }}
    />
  )
}
