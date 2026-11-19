/**
 * Template dos e-mails de apoio dos treinamentos PDF 1, 2, 3, 4 e 5 (dia 3, 7 e 15), EN e PT.
 * JavaScript puro (CommonJS) porque scripts/cron.js roda direto no Node do
 * Cron Jobs da Hostinger, sem passar pelo build do Next.
 *
 * Mesmo design do e-mail de entrega (lib/first-steps-email.ts): tabelas, CSS
 * inline, 560 px, preheader, tema escuro, logo e capa por URL absoluta. Os
 * textos são os aprovados, sem alteração. Se mudar o visual de um, mude o outro.
 */

const SITE_URL = 'https://salraycoach.com'
const CONTACT_EMAIL = 'hello@salrayofficial.com'

const SHARED = {
  en: {
    htmlLang: 'en',
    eyebrow: 'The Same Problem Keeps Finding You',
    coverAlt: 'Cover of the training: The Same Problem Keeps Finding You',
    button: 'Open your training',
    reply: 'If you want to tell me how it is going, just reply to this email. I read what you send.',
    role: 'Emotional & Life Rebuilding Coach',
    receivingBecause: 'You are receiving this because you asked for the training at salraycoach.com.',
    unsubscribe: 'Unsubscribe',
    privacy: 'Privacy',
  },
  pt: {
    htmlLang: 'pt-BR',
    eyebrow: 'O Mesmo Problema Continua Te Encontrando',
    coverAlt: 'Capa do treinamento: O Mesmo Problema Continua Te Encontrando',
    button: 'Abrir o treinamento',
    reply: 'Se quiser me contar como está sendo, é só responder este email. Eu leio o que você enviar.',
    role: 'Coach de Reconstrução Emocional e de Vida',
    receivingBecause: 'Você está recebendo este e-mail porque pediu o treinamento em salraycoach.com.',
    unsubscribe: 'Cancelar inscrição',
    privacy: 'Privacidade',
  },
}

const EMAILS = {
  en: {
    day3: {
      subject: 'How is day 3 going?',
      preheader: 'By now you may be on day 3 of your training.',
      paragraphs: [
        'Hi,',
        'By now you may be on day 3 of your training. Or you may not have started yet. Both are fine.',
        'A pattern does not change in three days. What changes is how early you notice it. That is all this week asks of you.',
        'If you missed a day, do not go back and do not make it up. Open the next page and keep going. The training waits for you.',
        'One small thing for today: write one sentence about the last time the same reaction showed up. Just one.',
      ],
    },
    day7: {
      subject: 'Today is a reflection day',
      preheader: 'Week one ends today. There is no new step.',
      paragraphs: [
        'Hi,',
        'Week one ends today. There is no new step. Read your six pages first. Then write what you noticed.',
        'Be generous when you tick the boxes. A tick means you did it even once.',
        'If you are behind, that is fine. Reflect on what you did so far. This page is yours, not a test.',
      ],
    },
    day15: {
      subject: 'Halfway, and a new week',
      preheader: 'You are halfway through. Week three starts today.',
      paragraphs: [
        'Hi,',
        'You are halfway through. Week three starts today: hear your inner voice.',
        'Under every pattern there is a voice. It sounds like you, so you rarely question it. This week you listen to what it says, where it comes from, and what happens when you answer it.',
        'Before you start, read your week two reflection once. It takes two minutes.',
      ],
    },

    'pdf2-day3': {
      subject: 'The first rescue you noticed',
      preheader: 'By now you may be on day 3 of your training.',
      paragraphs: [
        'Hi,',
        'By now you may be on day 3 of your training. Or you may not have started yet. Both are fine.',
        'The first days ask for something small: notice. Notice a rescue from this week, that moment when someone needed something and you were already on your feet before anyone called.',
        'You do not have to change anything yet. Only see that it happened, and how you felt right after.',
        'One small thing for today: write one sentence about the first rescue you noticed. Who needed what, what you did, and how you felt afterwards. Just one.',
      ],
    },
    'pdf2-day7': {
      subject: 'What would you do if you did not rescue?',
      preheader: 'Week one ends today. There is no new step.',
      paragraphs: [
        'Hi,',
        'Week one ends today. There is no new step. Read your six pages first and count how many rescues you wrote down.',
        'Then answer one question: what would you do if you did not rescue?',
        'It might be rest. It might be fear. It might be guilt. Any answer is fine, and it does not have to become a decision today.',
        'If you are behind, that is fine. Reflect on what you did so far. This page is yours, not a test.',
      ],
    },
    'pdf2-day15': {
      subject: 'Halfway, and your inner voice',
      preheader: 'You are halfway through. Week three starts today.',
      paragraphs: [
        'Hi,',
        'You are halfway through. Week three starts today: hear your inner voice.',
        'Under every rescue there is a voice. It often sounds like this: if I do not fix it, who will? This week you listen to what it says, where it comes from, and what happens when you answer it calmly.',
        'Before you start, read your week two reflection once. It takes two minutes.',
      ],
    },

    'pdf3-day3': {
      subject: 'The first time you noticed the dip',
      preheader: 'By now you may be on day 3 of your training.',
      paragraphs: [
        'Hi,',
        'By now you may be on day 3 of your training. Or you may not have started yet. Both are fine.',
        'The first days ask for something small: notice. Notice a moment this week when your energy dropped and you wanted to leave something, even a small thing.',
        'You do not have to change anything yet. Only see that it happened, and what you did next.',
        'One small thing for today: write one sentence about the last time you wanted to stop something. What it was, when the feeling came, and what you did. Just one.',
      ],
    },
    'pdf3-day7': {
      subject: 'What if you stayed one more minute?',
      preheader: 'Week one ends today. There is no new step.',
      paragraphs: [
        'Hi,',
        'Week one ends today. There is no new step. Read your six pages first and count how many times you caught the wobble.',
        'Then answer one question: what would happen if you stayed one more minute?',
        'It might be boredom. It might be fear. Any answer is fine, and it does not have to become a decision today.',
        'If you are behind, that is fine. Reflect on what you did so far. This page is yours, not a test.',
      ],
    },
    'pdf3-day15': {
      subject: 'Halfway, and the dull middle',
      preheader: 'You are halfway through. Week three starts today.',
      paragraphs: [
        'Hi,',
        'You are halfway through. Week three starts today: stay in the middle.',
        'Every plan has a dull middle, the stretch where the spark is gone and the result is still far away. This week you practice staying there, in small and kind ways.',
        'Before you start, read your week two reflection once. It takes two minutes.',
      ],
    },

    'pdf4-day3': {
      subject: 'The first yes you noticed',
      preheader: 'By now you may be on day 3 of your training.',
      paragraphs: [
        'Hi,',
        'By now you may be on day 3 of your training. Or you may not have started yet. Both are fine.',
        'The first days ask for something small: notice. Notice a yes from this week, that moment when someone asked and the word was out before you had decided.',
        'You do not have to change anything yet. Only see that it happened, and how your body felt right before you answered.',
        'One small thing for today: write one sentence about the first yes you noticed. Who asked, what you said, and how you felt afterwards. Just one.',
      ],
    },
    'pdf4-day7': {
      subject: 'What would you say if nobody were upset?',
      preheader: 'Week one ends today. There is no new step.',
      paragraphs: [
        'Hi,',
        'Week one ends today. There is no new step. Read your six pages first and count how many yeses you wrote down.',
        'Then answer one question: what would you have said if nobody were going to be upset?',
        'It might be no. It might be yes, with a condition. Any answer is fine, and it does not have to become a decision today.',
        'If you are behind, that is fine. Reflect on what you did so far. This page is yours, not a test.',
      ],
    },
    'pdf4-day15': {
      subject: 'Halfway, and your first kind no',
      preheader: 'You are halfway through. Week three starts today.',
      paragraphs: [
        'Hi,',
        'You are halfway through. Week three starts today: say no, kindly.',
        'Behind every fast yes there is a rule, often an old one, like good people always help. This week you practice a no that is short, warm and clear.',
        'Before you start, read your week two reflection once. It takes two minutes.',
      ],
    },

    'pdf5-day3': {
      subject: 'The first time you caught yourself saying “I’m fine”',
      preheader: 'By now you have probably heard yourself say it.',
      paragraphs: [
        'Hi,',
        'By now you have probably heard yourself say it. At the store. On the phone. To someone who asked how you were and did not wait for the answer.',
        'That is all the first days ask of you. Just notice it. You do not have to change anything yet. Notice who you say it to, and who you never say it to.',
        'If you missed a day, open today’s page and start there. Nothing is lost.',
      ],
    },
    'pdf5-day7': {
      subject: 'A week of noticing',
      preheader: 'You have been listening to your “I’m fine” for a week.',
      paragraphs: [
        'Hi,',
        'You have been listening to your “I’m fine” for a week. Maybe it comes out faster than you thought. Maybe you found one place where it was not true.',
        'This week we look back, gently. Nobody wakes up one day and decides to hide what they feel. You learned it somewhere, from someone, for a reason.',
        'Understanding that is not blaming anyone, and it is not blaming you. Go slowly.',
      ],
    },
    'pdf5-day15': {
      subject: 'Halfway, and saying it out loud',
      preheader: 'Halfway. Two weeks of looking at something you have avoided for years.',
      paragraphs: [
        'Hi,',
        'Halfway. Two weeks of looking at something you have avoided for years.',
        'The next stretch asks for one small thing: say one true sentence out loud, to one safe person or to yourself. “Today was hard” counts.',
        'If it feels too big, make it smaller. There is no rush.',
      ],
    },
  },
  pt: {
    day3: {
      subject: 'Como está o dia 3?',
      preheader: 'A esta altura você pode estar no dia 3 do treinamento.',
      paragraphs: [
        'Olá,',
        'A esta altura você pode estar no dia 3 do treinamento. Ou pode ainda não ter começado. As duas coisas estão certas.',
        'Um padrão não muda em três dias. O que muda é o quanto antes você o percebe. É só isso que esta semana pede de você.',
        'Se perdeu um dia, não volte e não compense. Abra a próxima página e siga em frente. O treinamento espera por você.',
        'Uma coisa pequena para hoje: escreva uma frase sobre a última vez em que a mesma reação apareceu. Só uma.',
      ],
    },
    day7: {
      subject: 'Hoje é dia de reflexão',
      preheader: 'A semana um termina hoje. Não há passo novo.',
      paragraphs: [
        'Olá,',
        'A semana um termina hoje. Não há passo novo. Leia primeiro as suas seis páginas. Depois escreva o que você percebeu.',
        'Seja generosa ao marcar as caixas. Um check significa que você fez, mesmo que uma vez.',
        'Se estiver atrasada, tudo bem. Reflita sobre o que fez até agora. Esta página é sua, não é uma prova.',
      ],
    },
    day15: {
      subject: 'Metade do caminho, e uma semana nova',
      preheader: 'Você está na metade. A semana três começa hoje.',
      paragraphs: [
        'Olá,',
        'Você está na metade. A semana três começa hoje: ouvir a sua voz interior.',
        'Por baixo de cada padrão existe uma voz. Ela soa como você, por isso você raramente a questiona. Nesta semana você escuta o que ela diz, de onde ela vem e o que acontece quando você responde a ela.',
        'Antes de começar, leia uma vez a sua reflexão da semana dois. Leva dois minutos.',
      ],
    },

    'pdf2-day3': {
      subject: 'O primeiro resgate que você notou',
      preheader: 'A esta altura você pode estar no dia 3 do treinamento.',
      paragraphs: [
        'Olá,',
        'A esta altura você pode estar no dia 3 do treinamento. Ou pode ainda não ter começado. As duas coisas estão certas.',
        'Os primeiros dias pedem algo pequeno: notar. Notar um resgate desta semana, aquele momento em que alguém precisou de algo e você já estava de pé antes de ser chamada.',
        'Você não precisa mudar nada ainda. Só perceber que aconteceu e como você se sentiu logo depois.',
        'Uma coisa pequena para hoje: escreva uma frase sobre o primeiro resgate que você notou. Quem precisou de quê, o que você fez e como se sentiu depois. Só uma.',
      ],
    },
    'pdf2-day7': {
      subject: 'O que você faria se não resgatasse?',
      preheader: 'A semana um termina hoje. Não há passo novo.',
      paragraphs: [
        'Olá,',
        'A semana um termina hoje. Não há passo novo. Leia primeiro as suas seis páginas e conte quantos resgates você anotou.',
        'Depois responda a uma pergunta só: o que você faria se não resgatasse?',
        'Pode ser descanso. Pode ser medo. Pode ser culpa. Qualquer resposta serve, e ela não precisa virar decisão hoje.',
        'Se estiver atrasada, tudo bem. Reflita sobre o que fez até agora. Esta página é sua, não é uma prova.',
      ],
    },
    'pdf2-day15': {
      subject: 'Metade do caminho, e a sua voz interior',
      preheader: 'Você está na metade. A semana três começa hoje.',
      paragraphs: [
        'Olá,',
        'Você está na metade. A semana três começa hoje: ouvir a sua voz interior.',
        'Por baixo de cada resgate existe uma voz. Ela costuma dizer algo assim: se eu não resolver, quem vai resolver? Nesta semana você escuta o que ela diz, de onde ela vem e o que acontece quando você responde a ela com calma.',
        'Antes de começar, leia uma vez a sua reflexão da semana dois. Leva dois minutos.',
      ],
    },

    'pdf3-day3': {
      subject: 'A primeira vez que você notou a queda',
      preheader: 'A esta altura você pode estar no dia 3 do treinamento.',
      paragraphs: [
        'Olá,',
        'A esta altura você pode estar no dia 3 do treinamento. Ou pode ainda não ter começado. As duas coisas estão certas.',
        'Os primeiros dias pedem algo pequeno: notar. Notar um momento desta semana em que a sua energia caiu e você quis largar alguma coisa, mesmo que pequena.',
        'Você não precisa mudar nada ainda. Só perceber que aconteceu e o que você fez em seguida.',
        'Uma coisa pequena para hoje: escreva uma frase sobre a última vez em que você quis parar algo. O que era, quando a sensação veio e o que você fez. Só uma.',
      ],
    },
    'pdf3-day7': {
      subject: 'E se você ficasse mais um minuto?',
      preheader: 'A semana um termina hoje. Não há passo novo.',
      paragraphs: [
        'Olá,',
        'A semana um termina hoje. Não há passo novo. Leia primeiro as suas seis páginas e conte quantas vezes você pegou a oscilação.',
        'Depois responda a uma pergunta só: o que aconteceria se você ficasse mais um minuto?',
        'Pode ser tédio. Pode ser medo. Qualquer resposta serve, e ela não precisa virar decisão hoje.',
        'Se estiver atrasada, tudo bem. Reflita sobre o que fez até agora. Esta página é sua, não é uma prova.',
      ],
    },
    'pdf3-day15': {
      subject: 'Metade do caminho, e o meio chato',
      preheader: 'Você está na metade. A semana três começa hoje.',
      paragraphs: [
        'Olá,',
        'Você está na metade. A semana três começa hoje: ficar no meio.',
        'Todo plano tem um meio chato, o trecho em que a faísca acabou e o resultado ainda está longe. Nesta semana você pratica ficar ali, de jeitos pequenos e gentis.',
        'Antes de começar, leia uma vez a sua reflexão da semana dois. Leva dois minutos.',
      ],
    },

    'pdf4-day3': {
      subject: 'O primeiro sim que você notou',
      preheader: 'A esta altura você pode estar no dia 3 do treinamento.',
      paragraphs: [
        'Olá,',
        'A esta altura você pode estar no dia 3 do treinamento. Ou pode ainda não ter começado. As duas coisas estão certas.',
        'Os primeiros dias pedem algo pequeno: notar. Notar um sim desta semana, aquele momento em que alguém pediu e a palavra saiu antes de você decidir.',
        'Você não precisa mudar nada ainda. Só perceber que aconteceu e como o seu corpo se sentiu logo antes de responder.',
        'Uma coisa pequena para hoje: escreva uma frase sobre o primeiro sim que você notou. Quem pediu, o que você disse e como se sentiu depois. Só uma.',
      ],
    },
    'pdf4-day7': {
      subject: 'O que você diria se ninguém ficasse chateado?',
      preheader: 'A semana um termina hoje. Não há passo novo.',
      paragraphs: [
        'Olá,',
        'A semana um termina hoje. Não há passo novo. Leia primeiro as suas seis páginas e conte quantos sins você anotou.',
        'Depois responda a uma pergunta só: o que você teria dito se ninguém fosse ficar chateado?',
        'Pode ser não. Pode ser sim, com uma condição. Qualquer resposta serve, e ela não precisa virar decisão hoje.',
        'Se estiver atrasada, tudo bem. Reflita sobre o que fez até agora. Esta página é sua, não é uma prova.',
      ],
    },
    'pdf4-day15': {
      subject: 'Metade do caminho, e o seu primeiro não gentil',
      preheader: 'Você está na metade. A semana três começa hoje.',
      paragraphs: [
        'Olá,',
        'Você está na metade. A semana três começa hoje: dizer não, com gentileza.',
        'Por trás de todo sim rápido existe uma regra, muitas vezes antiga, como gente boa sempre ajuda. Nesta semana você pratica um não que é curto, caloroso e claro.',
        'Antes de começar, leia uma vez a sua reflexão da semana dois. Leva dois minutos.',
      ],
    },

    'pdf5-day3': {
      subject: 'A primeira vez que você percebeu o “estou bem”',
      preheader: 'A esta altura você provavelmente já se ouviu dizendo.',
      paragraphs: [
        'Olá,',
        'A esta altura você provavelmente já se ouviu dizendo. No mercado. No telefone. Para alguém que perguntou como você estava e nem esperou a resposta.',
        'É só isso que os primeiros dias pedem. Apenas perceber. Você não precisa mudar nada ainda. Repare para quem você diz, e para quem nunca diz.',
        'Se perdeu um dia, abra a página de hoje e comece por ela. Nada se perde.',
      ],
    },
    'pdf5-day7': {
      subject: 'Uma semana de percepção',
      preheader: 'Faz uma semana que você escuta o seu “estou bem”.',
      paragraphs: [
        'Olá,',
        'Faz uma semana que você escuta o seu “estou bem”. Talvez ele saia mais rápido do que você imaginava. Talvez você tenha achado um lugar onde ele não era verdade.',
        'Nesta semana olhamos para trás, com suavidade. Ninguém acorda um dia e decide esconder o que sente. Você aprendeu isso em algum lugar, com alguém, por algum motivo.',
        'Entender não é culpar ninguém, e não é culpar você. Vá devagar.',
      ],
    },
    'pdf5-day15': {
      subject: 'Na metade, e dizer em voz alta',
      preheader: 'Na metade. Duas semanas olhando para algo que você evitou por anos.',
      paragraphs: [
        'Olá,',
        'Na metade. Duas semanas olhando para algo que você evitou por anos.',
        'A próxima parte pede uma coisa pequena: dizer uma frase verdadeira em voz alta, para uma pessoa segura ou para você mesma. “Hoje foi difícil” já conta.',
        'Se parecer grande demais, faça menor. Não existe pressa.',
      ],
    },
  },
}

const KINDS = ['day3', 'day7', 'day15']

// Dados do PDF 2 (título e capa). Os e-mails 'pdf2-*' usam estes no lugar dos do PDF 1.
const PDF2 = {
  en: {
    eyebrow: 'You Fix Everything for Everyone. Who Fixes You?',
    coverAlt: 'Cover of the training: You Fix Everything for Everyone. Who Fixes You?',
    cover: '/email/training-2-cover.jpg',
  },
  pt: {
    eyebrow: 'Você Resolve Tudo para Todo Mundo. Quem Conserta Você?',
    coverAlt: 'Capa do treinamento: Você Resolve Tudo para Todo Mundo. Quem Conserta Você?',
    cover: '/email/training-2-cover-pt.jpg',
  },
}

// Dados do PDF 3. Os e-mails 'pdf3-*' usam estes no lugar dos do PDF 1.
const PDF3 = {
  en: {
    eyebrow: 'You Start Strong. Then You Disappear.',
    coverAlt: 'Cover of the training: You Start Strong. Then You Disappear.',
    cover: '/email/training-3-cover.jpg',
  },
  pt: {
    eyebrow: 'Você Começa Forte. Depois Você Some.',
    coverAlt: 'Capa do treinamento: Você Começa Forte. Depois Você Some.',
    cover: '/email/training-3-cover-pt.jpg',
  },
}

// Dados do PDF 4. Os e-mails 'pdf4-*' usam estes no lugar dos do PDF 1.
const PDF4 = {
  en: {
    eyebrow: 'You Say Yes to Everyone. Then Wonder Where Your Life Went.',
    coverAlt: 'Cover of the training: You Say Yes to Everyone. Then Wonder Where Your Life Went.',
    cover: '/email/training-4-cover.jpg',
  },
  pt: {
    eyebrow: 'Você Diz Sim a Todo Mundo. Depois Se Pergunta para Onde Foi a Sua Vida.',
    coverAlt: 'Capa do treinamento: Você Diz Sim a Todo Mundo. Depois Se Pergunta para Onde Foi a Sua Vida.',
    cover: '/email/training-4-cover-pt.jpg',
  },
}

// Dados do PDF 5. Os e-mails 'pdf5-*' usam estes no lugar dos do PDF 1.
const PDF5 = {
  en: {
    eyebrow: 'You Say You’re Fine. You Know You Haven’t Been in Years.',
    coverAlt: 'Cover of the training: You Say You’re Fine. You Know You Haven’t Been in Years.',
    cover: '/email/training-5-cover.jpg',
  },
  pt: {
    eyebrow: 'Você Diz Que Está Bem. Faz Anos Que Você Sabe Que Não Está.',
    coverAlt: 'Capa do treinamento: Você Diz Que Está Bem. Faz Anos Que Você Sabe Que Não Está.',
    cover: '/email/training-5-cover-pt.jpg',
  },
}

// Treinamentos com e-mails próprios: o prefixo do tipo ('pdf2-day3' → 'pdf2') dá o número do
// treinamento, que vira o parâmetro &p= do link de download. O PDF 1 (day3...) não leva parâmetro.
// Para acrescentar um treinamento: um objeto de dados como o PDF4 e uma linha aqui.
const TRAINING_DATA = { pdf2: PDF2, pdf3: PDF3, pdf4: PDF4, pdf5: PDF5 }

function trainingOfKind(kind) {
  const m = /^(pdf\d+)-/.exec(String(kind))
  return m && TRAINING_DATA[m[1]] ? m[1] : null
}

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

/**
 * @param {{lang: 'en'|'pt', kind: 'day3'|'day7'|'day15', token: string, baseUrl?: string,
 *          subjectPrefix?: string, imageSrc?: {logo: string, cover: string}}} opts
 * @returns {{subject: string, html: string, text: string, headers: Record<string,string>}}
 */
function buildFollowup({ lang, kind, token, baseUrl = SITE_URL, subjectPrefix = '', imageSrc }) {
  const s = SHARED[lang]
  const c = EMAILS[lang][kind]
  if (!s || !c) throw new Error(`Unknown follow-up: ${lang}/${kind}`)

  const trainingKey = trainingOfKind(kind) // 'pdf2' a 'pdf5' ou null (PDF 1)
  const td = trainingKey ? TRAINING_DATA[trainingKey][lang] : null
  // O link do PDF 1 não leva o parâmetro p (como sempre); os demais levam p=<número do treinamento>.
  const downloadUrl = `${baseUrl}/api/first-steps/download/?l=${lang}&t=${token}${trainingKey ? `&p=${trainingKey.slice(3)}` : ''}`
  const unsubscribeUrl = `${baseUrl}/unsubscribe/?l=${lang}&t=${token}`
  const oneClickUrl = `${baseUrl}/api/first-steps/unsubscribe/?t=${token}`
  const privacyUrl = `${baseUrl}${lang === 'pt' ? '/pt/politica-de-privacidade/' : '/privacy-policy/'}`
  const logoSrc = (imageSrc && imageSrc.logo) || `${baseUrl}/email/logo.png`
  const coverSrc = (imageSrc && imageSrc.cover) || `${baseUrl}${td ? td.cover : '/email/training-cover.jpg'}`
  const eyebrow = td ? td.eyebrow : s.eyebrow
  const coverAlt = td ? td.coverAlt : s.coverAlt
  const subject = `${subjectPrefix}${c.subject}`

  const paragraphRows = c.paragraphs
    .map(
      (p, i) =>
        `<tr><td align="left" style="padding:${i === 0 ? 22 : 14}px 36px 0;font:16px/26px Arial,Helvetica,sans-serif;color:#D9D4CC">${escapeHtml(p)}</td></tr>`
    )
    .join('\n')

  const html = `<!doctype html><html lang="${s.htmlLang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;background:#0F0F0F;">
<div style="display:none;max-height:0;overflow:hidden;color:#0F0F0F">${escapeHtml(c.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0F0F0F"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#171717;border:1px solid #2E2E2E">
<tr><td align="center" style="padding:36px 24px 8px"><img src="${escapeHtml(logoSrc)}" width="110" alt="SAL Ray" style="display:block"></td></tr>
<tr><td align="center" style="padding:20px 32px 0;font:600 11px Arial,Helvetica,sans-serif;letter-spacing:2px;text-transform:uppercase;color:#F7941D">${escapeHtml(eyebrow)}</td></tr>
<tr><td align="center" style="padding:14px 32px 0;font:400 36px/42px Georgia,'Times New Roman',serif;color:#F2EEE8">${escapeHtml(c.subject)}</td></tr>
<tr><td align="center" style="padding:8px 0 0"><table role="presentation" width="46" cellpadding="0" cellspacing="0"><tr><td height="2" style="background:#F7941D;font-size:0;line-height:0">&nbsp;</td></tr></table></td></tr>
${paragraphRows}
<tr><td align="center" style="padding:28px 36px 0"><img src="${escapeHtml(coverSrc)}" width="200" alt="${escapeHtml(coverAlt)}" style="display:block;border:1px solid #2E2E2E"></td></tr>
<tr><td align="center" style="padding:28px 36px 0"><a href="${escapeHtml(downloadUrl)}" style="display:block;background:#F7941D;color:#171717;font:600 16px Arial,Helvetica,sans-serif;text-decoration:none;padding:17px 24px;border-radius:4px">${escapeHtml(s.button)}</a></td></tr>
<tr><td style="padding:34px 36px 0;font:italic 18px/28px Georgia,'Times New Roman',serif;color:#F2EEE8">${escapeHtml(s.reply)}</td></tr>
<tr><td style="padding:26px 36px 0;font:400 22px Georgia,serif;color:#F2EEE8">SAL Ray<br><span style="font:12px Arial,sans-serif;letter-spacing:1px;color:#A8A39B">${escapeHtml(s.role)}</span></td></tr>
<tr><td style="padding:36px 36px 30px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #2E2E2E"><tr><td style="padding-top:18px;font:12px/19px Arial,sans-serif;color:#8A857D">${escapeHtml(s.receivingBecause)}<br><a href="${escapeHtml(unsubscribeUrl)}" style="color:#A8A39B">${escapeHtml(s.unsubscribe)}</a> &nbsp;&middot;&nbsp; <a href="${escapeHtml(privacyUrl)}" style="color:#A8A39B">${escapeHtml(s.privacy)}</a></td></tr></table></td></tr>
</table></td></tr></table></body></html>`

  const text = [
    eyebrow.toUpperCase(),
    '',
    c.subject,
    '',
    ...c.paragraphs.flatMap((p) => [p, '']),
    `${s.button}: ${downloadUrl}`,
    '',
    s.reply,
    '',
    'SAL Ray',
    s.role,
    '',
    '--',
    s.receivingBecause,
    `${s.unsubscribe}: ${unsubscribeUrl}`,
    `${s.privacy}: ${privacyUrl}`,
    '',
  ].join('\n')

  return {
    subject,
    html,
    text,
    headers: {
      'List-Unsubscribe': `<${oneClickUrl}>, <mailto:${CONTACT_EMAIL}?subject=unsubscribe>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  }
}

module.exports = { buildFollowup, KINDS, EMAILS, SITE_URL, CONTACT_EMAIL }
