/**
 * Favicon do site (logo branca sobre #171717). Mesmos arquivos em todas as
 * páginas, em inglês e em português: os três layouts raiz usam esta constante.
 * Arquivos em /public: favicon.ico (16, 32, 48), icon-48/96/192.png e apple-touch-icon.png (180).
 */
export const SITE_ICONS = {
  icon: [
    { url: '/icon-48.png', sizes: '48x48', type: 'image/png' },
    { url: '/icon-96.png', sizes: '96x96', type: 'image/png' },
    { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
  ],
  shortcut: '/favicon.ico',
  apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
}
