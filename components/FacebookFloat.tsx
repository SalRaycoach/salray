import { contato } from '@/lib/config'

export default function FacebookFloat() {
  return (
    <a
      href={contato.messengerUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message Sal Ray"
      data-event="messenger_cta_click"
      className="fixed bottom-6 right-6 z-50 bg-charcoal text-offwhite w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:bg-aqua transition-colors"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.86c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.48h-1.26c-1.24 0-1.63.78-1.63 1.57v1.86h2.77l-.44 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94z" />
      </svg>
    </a>
  )
}
