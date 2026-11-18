import type { Metadata } from 'next'
import { findEmailByToken, markUnsubscribed, parseLang, type Lang } from '@/lib/first-steps'
import { SITE_URL, contato } from '@/lib/config'

// O descadastro acontece ao abrir a página, então ela nunca pode ser estática
// nem ficar em cache.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Unsubscribe',
  robots: { index: false, follow: false },
}

type Status = 'done' | 'invalid' | 'error'

const COPY: Record<Lang, Record<Status, { title: string; body: string }> & { home: string; htmlLang: string }> = {
  en: {
    htmlLang: 'en',
    home: 'Back to salraycoach.com',
    done: {
      title: 'You are unsubscribed.',
      body: `You will not receive any more emails from this list. If this was a mistake, write to ${contato.email}.`,
    },
    invalid: {
      title: 'This link is not valid.',
      body: `The unsubscribe link is incomplete or has expired. If you keep receiving emails, write to ${contato.email} and we will remove you by hand.`,
    },
    error: {
      title: 'Something went wrong.',
      body: 'We could not process your request right now. Please try the link again in a few minutes.',
    },
  },
  pt: {
    htmlLang: 'pt-BR',
    home: 'Voltar para salraycoach.com',
    done: {
      title: 'Inscrição cancelada.',
      body: `Você não vai receber mais e-mails desta lista. Se foi um engano, escreva para ${contato.email}.`,
    },
    invalid: {
      title: 'Este link não é válido.',
      body: `O link de cancelamento está incompleto ou expirou. Se continuar recebendo e-mails, escreva para ${contato.email} e removemos você manualmente.`,
    },
    error: {
      title: 'Algo deu errado.',
      body: 'Não conseguimos processar o seu pedido agora. Tente o link novamente em alguns minutos.',
    },
  },
}

export default async function UnsubscribePage({ searchParams }: { searchParams: { l?: string; t?: string } }) {
  const lang = parseLang(searchParams.l)
  const token = typeof searchParams.t === 'string' ? searchParams.t : ''
  const c = COPY[lang]

  let status: Status
  try {
    const email = await findEmailByToken(token)
    if (email) {
      await markUnsubscribed(email)
      status = 'done'
    } else {
      status = 'invalid'
    }
  } catch (err) {
    console.error('unsubscribe page failed:', err instanceof Error ? err.message : err)
    status = 'error'
  }

  return (
    <main lang={c.htmlLang} className="min-h-screen bg-offwhite flex items-center justify-center px-6 py-16">
      <div className="max-w-xl text-center">
        <p className="font-display font-semibold text-lg text-charcoal mb-10">SAL Ray</p>
        <h1 className="font-display text-4xl text-charcoal mb-6">{c[status].title}</h1>
        <p className="font-body text-lg text-charcoal/80 leading-relaxed mb-10">{c[status].body}</p>
        <a href={`${SITE_URL}/`} className="font-body text-aqua underline underline-offset-2">
          {c.home}
        </a>
      </div>
    </main>
  )
}
