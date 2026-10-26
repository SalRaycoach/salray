import type { Metadata } from 'next'
import { OG_IMAGES, TWITTER_CARD } from '@/lib/og'
import Link from 'next/link'
import { contato, SITE_URL } from '@/lib/config'

const title = 'Política de Cancelamento e Remarcação'
const description = 'Política de cancelamento e remarcação das consultas e sessões de coaching com SAL Ray.'
const url = `${SITE_URL}/pt/politica-de-cancelamento/`

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

// Tradução fiel de /cancellation-policy/ (versão em inglês): mesmas regras, valores e prazos.
export default function PoliticaCancelamentoPage() {
  return (
    <main className="max-w-content mx-auto px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl text-charcoal mb-2">Política de Cancelamento e Remarcação</h1>
      <p className="font-body text-sm text-charcoal/50 mb-8">Última atualização: 13 de outubro de 2026</p>

      <section className="max-w-2xl space-y-6 font-body text-charcoal/85 leading-relaxed">
        <p>
          Esta política se aplica a todas as sessões de coaching privadas e ao vivo com SAL Ray, incluindo a consulta
          inicial, as sessões individuais, os pacotes de sessões e a 4-Week Experience.
        </p>
        <p>
          Ela não se aplica a produtos digitais em áudio (como o Primeiro Passo S.T.A.B.L.E.™ e as Vivências de
          Reconstrução Emocional, quando entregues como conteúdo digital pré-gravado e não como sessões ao vivo). Os
          produtos digitais são cobertos por uma{' '}
          <Link href="/digital-product-terms/" className="text-aqua underline underline-offset-2">
            Política de Produtos Digitais
          </Link>{' '}
          separada.
        </p>

        <h2 className="font-display text-2xl text-charcoal">1. Agendamento</h2>
        <p>
          Todas as sessões são realizadas de forma privada, online. Os clientes são responsáveis por entrar em cada
          sessão no horário, de um local tranquilo e privado, com acesso confiável à internet.
        </p>

        <h2 className="font-display text-2xl text-charcoal">2. Remarcação: aviso de 24 horas obrigatório</h2>
        <p>
          Remarcar uma sessão exige aviso com pelo menos <strong>24 horas de antecedência</strong>. Não é uma cortesia:
          é uma exigência para remarcar sem perder a sessão.
        </p>

        <h2 className="font-display text-2xl text-charcoal">3. Cancelamentos tardios e faltas contam como sessão utilizada</h2>
        <p>
          Nos serviços pagos, o cancelamento com menos de 24 horas de antecedência, ou a falta, conta como sessão
          utilizada. Nenhum reembolso ou sessão de reposição será oferecido, exceto a critério exclusivo e por escrito
          de SAL Ray.
        </p>

        <h2 className="font-display text-2xl text-charcoal">4. Atraso</h2>
        <p>
          Chegar com mais de <strong>15 minutos de atraso</strong> a uma sessão agendada também conta como sessão
          utilizada.
        </p>

        <h2 className="font-display text-2xl text-charcoal">5. Cancelamento por SAL Ray</h2>
        <p>
          Se SAL Ray precisar cancelar ou não puder comparecer a uma sessão agendada, essa sessão não será contada como
          utilizada e será remarcada sem custo adicional.
        </p>

        <h2 className="font-display text-2xl text-charcoal">6. Reembolsos de sessões ao vivo pagas</h2>
        <p>
          O coaching ao vivo pago (sessões individuais, pacotes de sessões e a parte ao vivo de qualquer programa) não é
          reembolsável, exceto quando exigido pela lei aplicável.
        </p>

        <h2 className="font-display text-2xl text-charcoal">7. 4-Week Experience e programas de várias sessões</h2>
        <p>
          Como cada sessão de um programa estruturado (como a 4-Week Experience) se apoia na anterior, a presença
          constante é importante. Espera-se que os participantes:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Agendem todas as sessões com antecedência, quando aplicável</li>
          <li>Compareçam a cada sessão conforme agendado, no horário</li>
          <li>Avisem com pelo menos 24 horas de antecedência se uma mudança de horário for inevitável</li>
        </ul>
        <p>
          Cancelamentos tardios e faltas são regidos pelas Seções 2 a 4 acima e podem afetar a continuidade da
          participação no programa.
        </p>

        <h2 className="font-display text-2xl text-charcoal">8. Programas gratuitos (4-Week Experience)</h2>
        <p>
          A 4-Week Experience é oferecida sem custo a participantes selecionados. Como as vagas são limitadas,
          participantes que não comparecerem às sessões agendadas ou que cancelarem repetidamente com pouco aviso podem
          ter sua vaga no programa encerrada para dar lugar a outra pessoa candidata.
        </p>

        <h2 className="font-display text-2xl text-charcoal">9. Mentoria em grupo</h2>
        <p>
          A Mentoria de Reconstrução Emocional, um programa online em grupo, tem regras próprias, que valem para ela
          no lugar das seções acima. Veja a{' '}
          <Link href="/pt/politica-de-cancelamento-mentoria/" className="text-aqua underline underline-offset-2">
            Política de cancelamento e reembolso da Mentoria em Grupo
          </Link>
          .
        </p>

        <h2 className="font-display text-2xl text-charcoal">10. Fale conosco</h2>
        <p>Para remarcar uma sessão ou tirar dúvidas sobre esta política, entre em contato:</p>
        <p>
          <strong>E-mail:</strong>{' '}
          <a href={`mailto:${contato.email}`} className="text-aqua underline underline-offset-2">
            {contato.email}
          </a>
          <br />
          <strong>Empresa:</strong> SAL Ray Coaching LLC
        </p>
      </section>
    </main>
  )
}
