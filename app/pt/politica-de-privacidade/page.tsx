import type { Metadata } from 'next'
import { OG_IMAGES, TWITTER_CARD } from '@/lib/og'
import { contato, SITE_URL } from '@/lib/config'

const title = 'Política de Privacidade'
const description = 'Como SAL Ray coleta, usa e protege as suas informações pessoais.'
const url = `${SITE_URL}/pt/politica-de-privacidade/`

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: url,
    languages: {
      'en-US': `${SITE_URL}/privacy-policy/`,
      'pt-BR': url,
    },
  },
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

// Tradução fiel de /privacy-policy/ (versão em inglês), incluindo as seções sobre os emails do treinamento.
// Se o texto em inglês mudar, atualize este também.
export default function PoliticaPrivacidadePage() {
  return (
    <main className="max-w-content mx-auto px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl text-charcoal mb-2">Política de Privacidade</h1>
      <p className="font-body text-sm text-charcoal/50 mb-8">Última atualização: 18 de novembro de 2026</p>

      <section className="max-w-2xl space-y-6 font-body text-charcoal/85 leading-relaxed">
        <p>
          A SAL Ray Coaching LLC (&quot;SAL Ray&quot;, &quot;nós&quot; ou &quot;nosso&quot;) opera o site
          salraycoach.com (o &quot;Site&quot;) e presta serviços não clínicos de coaching e desenvolvimento pessoal.
          Esta Política de Privacidade descreve as nossas práticas sobre as informações que coletamos e como as
          usamos. <strong>Ao usar este Site, você reconhece as práticas descritas nesta Política de Privacidade.</strong>{' '}
          Esta Política de Privacidade é uma descrição das nossas práticas, não um contrato de consentimento; quando o
          seu consentimento for exigido por lei para um uso específico das suas informações, vamos solicitá-lo
          separadamente.
        </p>

        <h2 className="font-display text-2xl text-charcoal">1. Informações que coletamos</h2>

        <h3 className="font-display text-xl text-charcoal">1.1 Informações coletadas de candidatas e candidatos</h3>
        <p>
          Quando você envia uma candidatura (como o formulário de candidatura da 4-Week Experience), podemos coletar:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Primeiro nome</li>
          <li>Endereço de email</li>
          <li>Número de celular</li>
          <li>Estado de residência</li>
          <li>Sua resposta a uma pergunta de múltipla escolha sobre a área em que você gostaria de trabalhar</li>
          <li>
            Sua resposta sobre se você consegue se comprometer com quatro sessões online privadas e começar em até 14
            dias
          </li>
        </ul>
        <p>
          Coletamos o seu número de celular apenas para entrar em contato com você como alternativa, caso o nosso email
          não chegue à sua caixa de entrada (por exemplo, se for filtrado como spam). Não usamos o seu número de
          celular para marketing contínuo por SMS.
        </p>

        <h3 className="font-display text-xl text-charcoal">1.2 Informações coletadas de clientes pagantes</h3>
        <p>Se você se tornar cliente pagante, também podemos coletar e guardar:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Contratos de programa ou de sessão que você assinou ou aceitou</li>
          <li>Informações de agenda e de compromissos</li>
          <li>Emails e outras comunicações relacionadas à sua relação de coaching</li>
          <li>
            Registros de sessões realizadas, remarcadas ou perdidas, para fins de cobrança e de administração do
            programa
          </li>
        </ul>
        <p>
          Guardamos essas informações pelo tempo necessário para prestar os serviços, administrar o seu programa e
          cumprir as nossas obrigações legais, fiscais e contábeis.
        </p>

        <h3 className="font-display text-xl text-charcoal">1.3 Informações coletadas automaticamente</h3>
        <p>
          Como a maioria dos sites, usamos tecnologias de análise e de publicidade que podem coletar automaticamente
          informações sobre a sua visita, incluindo:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Google Analytics 4 (GA4):</strong> usado nas páginas de cadastro do treinamento e nos artigos de
            recursos para entender como os visitantes os utilizam. O GA4 não é usado na página inicial nem em páginas
            ligadas à nossa publicidade, como a página da 4-Week Experience.
          </li>
          <li>
            <strong>Meta Pixel e API de Conversões da Meta:</strong> usados para medir a eficácia da nossa publicidade
            e entender quais páginas levam a uma candidatura.
          </li>
        </ul>
        <p>
          Quando você envia uma candidatura, informações como o seu email e o seu número de celular podem ser
          compartilhadas com a Meta por meio da API de Conversões da Meta, configurada pelas próprias ferramentas do
          Gerenciador de Eventos da Meta. As ferramentas padrão da Meta aplicam hash de mão única (uma forma de
          criptografia) a essas informações antes de usá-las para medição e correspondência de publicidade, de modo que
          a Meta não recebe o seu email nem o seu número de celular em forma legível.
        </p>
        <p>
          Essas ferramentas podem usar cookies ou tecnologias semelhantes. Você pode controlar os cookies nas
          configurações do seu navegador, embora desativá-los possa afetar o funcionamento do Site.
        </p>
        <p>
          <strong>Análise de uso.</strong> Usamos o Google Analytics 4 em partes deste site para entender quais páginas
          ajudam as pessoas. Não enviamos seu email para ferramentas de análise.
        </p>

        <h3 className="font-display text-xl text-charcoal">1.4 Ferramenta de autoavaliação</h3>
        <p>
          Se você usar a ferramenta de autoavaliação associada ao programa Vivências de Reconstrução Emocional, as
          suas respostas ficam armazenadas apenas no armazenamento local do seu próprio navegador (localStorage).
          Essas informações nunca são transmitidas nem armazenadas nos nossos servidores, e não temos acesso a elas.
        </p>

        <h3 className="font-display text-xl text-charcoal">1.5 Emails do treinamento</h3>
        <p>
          <strong>Emails do treinamento.</strong> Quando você pede o treinamento interativo, coletamos seu email, seu
          idioma, a página em que você se cadastrou e a data. Usamos esses dados para enviar o treinamento e, nos 30
          dias seguintes, alguns emails curtos de apoio à sua prática. Não vendemos seu email e não o compartilhamos
          para publicidade.
        </p>

        <h2 className="font-display text-2xl text-charcoal">2. Como usamos as suas informações</h2>
        <p>Usamos as informações que coletamos para:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Analisar e responder a candidaturas a programas e experiências de coaching</li>
          <li>
            Entrar em contato com você sobre a sua candidatura por email ou, como alternativa, por mensagem de texto
            se o email não puder ser entregue
          </li>
          <li>Prestar, agendar e administrar serviços de coaching pagos</li>
          <li>Entender como os visitantes usam o Site e melhorar o seu conteúdo e o seu desempenho</li>
          <li>Medir a eficácia da nossa publicidade</li>
          <li>Cumprir obrigações legais</li>
        </ul>
        <p>Não vendemos as suas informações pessoais a terceiros.</p>

        <h2 className="font-display text-2xl text-charcoal">3. Como compartilhamos informações</h2>
        <p>Podemos compartilhar informações com:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Prestadores de serviço</strong> que nos ajudam a operar o Site e a entregar os nossos serviços (como
            o nosso provedor de email, o provedor de hospedagem e o processador de pagamentos dos programas pagos)
          </li>
          <li>
            <strong>Google e Meta</strong>, por meio das ferramentas de análise e de publicidade descritas acima, sujeitas
            às suas próprias políticas de privacidade
          </li>
          <li>
            <strong>Autoridades legais</strong>, se exigido por lei ou para proteger os nossos direitos, a nossa
            segurança ou a segurança de outras pessoas
          </li>
        </ul>
        <p>
          <strong>Prestadores de serviço.</strong> Enviamos emails pelo Google (Gmail) e hospedamos este site na
          Hostinger. Eles tratam dados em nosso nome para prestar esses serviços.
        </p>

        <h2 className="font-display text-2xl text-charcoal">4. Informações de pagamento</h2>
        <p>
          Os programas e experiências pagos são processados por provedores de pagamento terceirizados (como Payhip e
          Stripe). Nós não coletamos nem armazenamos diretamente os dados completos do seu cartão de pagamento.
          Consulte as políticas de privacidade desses provedores para saber como eles tratam os seus dados de
          pagamento.
        </p>

        <h2 className="font-display text-2xl text-charcoal">5. Segurança dos dados</h2>
        <p>
          Usamos medidas administrativas e técnicas razoáveis, pensadas para proteger as informações pessoais que
          guardamos, incluindo restringir o acesso às informações pessoais a quem precisa delas para exercer a sua
          função e usar provedores terceirizados confiáveis para hospedagem, email e processamento de pagamentos.
          Nenhum método de transmissão ou de armazenamento é totalmente seguro, e não podemos garantir segurança
          absoluta.
        </p>

        <h2 className="font-display text-2xl text-charcoal">6. Retenção de dados</h2>
        <p>
          Guardamos as informações de candidatura e de contato pelo tempo razoavelmente necessário para responder à
          sua candidatura, prestar serviços e cumprir obrigações legais, contábeis ou de prestação de contas.
        </p>

        <h2 className="font-display text-2xl text-charcoal">7. Suas escolhas e direitos</h2>
        <p>Você pode:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Pedir que corrijamos ou apaguemos as informações pessoais que guardamos sobre você</li>
          <li>Deixar de receber emails no futuro entrando em contato conosco</li>
          <li>Entrar em contato conosco com qualquer dúvida sobre esta política ou sobre as suas informações</li>
        </ul>
        <p>
          <strong>Cancelar inscrição.</strong> Todo email tem um link para cancelar. Quando você usa o link, paramos de
          enviar e guardamos apenas o que for necessário para lembrar que você cancelou. Você também pode escrever
          para{' '}
          <a href={`mailto:${contato.email}`} className="text-aqua underline underline-offset-2">
            {contato.email}
          </a>{' '}
          e pedir que apaguemos seus dados.
        </p>
        <p>
          Dependendo do estado em que você reside, você pode ter direitos adicionais de acordo com as leis estaduais
          de privacidade aplicáveis. Para exercer qualquer direito, entre em contato usando os dados abaixo.
        </p>

        <h2 className="font-display text-2xl text-charcoal">8. Privacidade de crianças</h2>
        <p>
          Os nossos serviços são destinados a adultos com 18 anos ou mais. Não coletamos intencionalmente informações
          pessoais de menores de 18 anos.
        </p>

        <h2 className="font-display text-2xl text-charcoal">9. Alterações nesta política</h2>
        <p>
          Podemos atualizar esta Política de Privacidade de tempos em tempos. A data de &quot;Última atualização&quot;
          no topo desta página indica a revisão mais recente.
        </p>

        <h2 className="font-display text-2xl text-charcoal">10. Fale conosco</h2>
        <p>Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato:</p>
        <p>
          <strong>Email:</strong>{' '}
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
