import type { Metadata } from 'next'
import { OG_IMAGES, TWITTER_CARD } from '@/lib/og'
import Link from 'next/link'
import { SITE_URL } from '@/lib/config'

const title = 'Política de cancelamento e reembolso da Mentoria em Grupo'
const description =
  'Regras de inscrição, turma mínima, desistência, reembolso e remarcação da Mentoria de Reconstrução Emocional, o programa em grupo de SAL Ray.'
const url = `${SITE_URL}/pt/politica-de-cancelamento-mentoria/`

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  twitter: TWITTER_CARD,
  openGraph: {
    title: `${title} | SAL Ray`,
    description,
    url,
    locale: 'pt_BR',
    images: OG_IMAGES,
  },
  robots: 'index, follow',
}

export default function PoliticaCancelamentoMentoriaPage() {
  return (
    <main className="max-w-content mx-auto px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl text-charcoal mb-2">Política de cancelamento e reembolso da Mentoria em Grupo</h1>
      <p className="font-body text-sm text-charcoal/50 mb-8">Última atualização: 13 de outubro de 2026</p>

      <section className="max-w-2xl space-y-6 font-body text-charcoal/85 leading-relaxed">
        <h2 className="font-display text-2xl text-charcoal">Inscrições</h2>
        <p>
          As inscrições vão até 28 de novembro de 2026, ou até as vagas acabarem. Depois que o primeiro encontro
          começar (domingo, 29 de novembro de 2026), não é possível entrar na turma.
        </p>

        <h2 className="font-display text-2xl text-charcoal">Turma mínima</h2>
        <p>
          A turma acontece com 5 inscrições confirmadas. Se esse número não for atingido até 28 de novembro de 2026,
          você recebe 100% do valor pago de volta, inclusive as taxas de processamento.
        </p>

        <h2 className="font-display text-2xl text-charcoal">Desistência</h2>
        <p>
          Você pode pedir reembolso em até 7 dias após a compra, desde que antes do primeiro encontro. O valor
          devolvido é o valor pago menos as taxas de processamento do pagamento, que o Stripe não devolve. Depois que o
          primeiro encontro começar, não há reembolso. Para pedir o reembolso, use os{' '}
          <Link href="/contact/" className="text-aqua underline underline-offset-2">
            canais de contato
          </Link>{' '}
          que já constam no site.
        </p>

        <h2 className="font-display text-2xl text-charcoal">Pagamento parcelado</h2>
        <p>
          Quando o pagamento é feito pelo Affirm ou Klarna, a devolução segue as regras de cada serviço. Os juros
          pagos, se houver, podem não ser devolvidos.
        </p>

        <h2 className="font-display text-2xl text-charcoal">Como o reembolso é feito</h2>
        <p>
          Depois de aprovado, o reembolso é feito na mesma forma de pagamento usada na compra. O prazo para aparecer na
          sua conta depende do banco ou do serviço de pagamento.
        </p>

        <h2 className="font-display text-2xl text-charcoal">Remarcação e feriados</h2>
        <p>
          Se SAL Ray precisar remarcar um encontro, ele será reposto em nova data. Em semanas de feriado, as datas
          podem ser ajustadas com a turma.
        </p>

        <h2 className="font-display text-2xl text-charcoal">Natureza do serviço</h2>
        <p>
          A mentoria é um programa de coaching e desenvolvimento pessoal, não substituindo psicoterapia ou atendimento
          médico.
        </p>
      </section>
    </main>
  )
}
