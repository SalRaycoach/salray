/**
 * FONTE DE DADOS — "Reflexões SAL Ray" (biblioteca de áudios em português)
 * ---------------------------------------------------------------------------
 * Ver PROMPT_REFLEXOES_SAL_RAY.md, seção 3. Cada áudio é uma entrada neste
 * array — sem painel administrativo na v1. Passo a passo de como adicionar
 * uma entrada nova: ver COMO_PUBLICAR_AUDIO.md na raiz do projeto.
 *
 * Publicação programada: um áudio com `dataPublicacao` no futuro não aparece
 * no hub nem é acessível diretamente até essa data chegar (ver
 * isPublished() / getPublishedAudios() abaixo) — isso é o que permite gravar
 * várias semanas de uma vez e o site "soltar" um por vez sozinho.
 * ---------------------------------------------------------------------------
 */

// Valor interno em inglês (mais simples de manter no código) — o texto
// mostrado pro usuário vem sempre de CATEGORIA_LABEL, nunca deste valor cru.
// "Morning Reflections" foi removida da lista de filtros a pedido do
// usuário (22 ago 2026) — não é mais uma categoria válida.
export type AudioCategoria = 'Patterns' | 'Relationships' | 'Clarity' | 'Emotional Stability'

export const AUDIO_CATEGORIAS: AudioCategoria[] = ['Patterns', 'Relationships', 'Clarity', 'Emotional Stability']

export const CATEGORIA_LABEL: Record<AudioCategoria, string> = {
  Patterns: 'Padrões',
  Relationships: 'Relacionamentos',
  Clarity: 'Clareza',
  'Emotional Stability': 'Estabilidade Emocional',
}

/**
 * Referencia uma das 4 ofertas já existentes em /pt/reconstrucao-emocional/
 * (ver PROMPT_PT_RECONSTRUCAO_EMOCIONAL, seção 3 "Âncoras e IDs"). Esse
 * mapeamento só existe aqui como texto de exibição + âncora de link — a
 * copy completa da oferta mora exclusivamente na página de vendas, não é
 * duplicada nesta branch.
 */
export type ProdutoRelacionado = 'primeiro-passo' | 'vivencias' | 'mentoria' | 'personalizado'

// `artigo` existe porque "Conhecer {nome}" precisa de concordância de
// gênero/número em português ("o Primeiro Passo", "as Vivências", "a
// Mentoria", "o Acompanhamento") — um artigo fixo quebraria 2 dos 4 nomes.
export const PRODUTO_INFO: Record<ProdutoRelacionado, { nome: string; artigo: string; anchor: string }> = {
  'primeiro-passo': { nome: 'Primeiro Passo S.T.A.B.L.E.™', artigo: 'o', anchor: 'primeiro-passo' },
  vivencias: { nome: 'Vivências de Reconstrução Emocional', artigo: 'as', anchor: 'vivencias' },
  mentoria: { nome: 'Mentoria S.T.A.B.L.E.™', artigo: 'a', anchor: 'mentoria' },
  personalizado: { nome: 'Acompanhamento Personalizado com Sal Ray', artigo: 'o', anchor: 'personalizado' },
}

export type Audio = {
  slug: string
  titulo: string
  descricao: string // 2-3 linhas
  categoria: AudioCategoria
  duracaoSegundos: number
  urlAudio: string // link público do arquivo no Cloudflare R2
  transcricao: string // texto completo ou resumo — obrigatório pra SEO
  dataPublicacao: string // ISO 8601 — data em que o áudio passa a aparecer no site
  produtoRelacionado: ProdutoRelacionado
  ogImage?: string // opcional — se ausente, usa o template genérico da marca
  // Override manual do teaser "Próxima reflexão" nesta página específica —
  // usar só quando o próximo da cadência (ex.: a segunda-feira seguinte)
  // ainda não tem data de gravação confirmada, então não existe como entrada
  // em `audios` pra getNextScheduledAudio() encontrar. Texto livre (ex.:
  // "segunda-feira", sem data) — quando ausente, o teaser volta a ser
  // calculado automaticamente a partir do próximo áudio agendado.
  proximaReflexaoManual?: string
}

export const audios: Audio[] = [
  {
    slug: 'adaptando-escolhas-para-nao-decepcionar-os-outros',
    titulo: 'Você Está Adaptando Suas Escolhas Para Não Decepcionar os Outros?',
    descricao:
      'A pessoa acredita que está sendo cuidadosa, mas pode estar alterando decisões, limites e até a própria fala para evitar o desconforto de desagradar. Durante a semana, ela observará onde a necessidade de aprovação está dirigindo suas respostas.',
    categoria: 'Clarity',
    duracaoSegundos: 245,
    urlAudio:
      'https://pub-e0ca58c6090c4c5997d38f0e2e4165f8.r2.dev/01_Voc%C3%AA%20est%C3%A1%20adaptando%20suas%20escolhas%20para%20n%C3%A3o%20decepcionar%20os%20outros.mp3',
    transcricao:
      'Eu quero que você observe uma coisa essa semana.\nTalvez você não esteja apenas pensando no que quer fazer.\nTalvez você esteja pensando no que pode fazer sem decepcionar alguém.\nE existe uma diferença muito grande entre essas duas coisas.\nPensa na última decisão que você precisou tomar.\nPode ter sido uma decisão importante.\nMas também pode ter sido uma coisa simples.\nUm convite que você queria recusar.\nUma conversa que precisava ter.\nUm limite que queria colocar.\nUma escolha que fazia sentido pra você… mas que poderia desagradar alguém.\nO que aconteceu dentro de você naquele momento?\nPorque talvez, antes mesmo de decidir, você já tenha começado a imaginar a reação da outra pessoa.\nA cara que ela faria.\nO silêncio.\nA cobrança.\nA pergunta.\nA possibilidade de ela entender tudo errado.\nE, sem perceber, você começou a adaptar sua escolha.\nVocê não disse exatamente o que queria dizer.\nVocê deixou pra depois.\nVocê tentou encontrar um jeito de fazer aquilo sem causar nenhum desconforto.\nOu talvez tenha desistido completamente.\nE é aqui que eu quero chamar sua atenção.\nTalvez você esteja chamando isso de consideração.\nE pode ser que uma parte seja mesmo.\nConsiderar quem está ao seu lado é importante.\nMas existe um momento em que considerar o outro começa a significar abandonar o que você precisa.\nVocê começa a ajustar demais.\nExplicar demais.\nPedir permissão sem perceber.\nE, pouco a pouco, suas escolhas deixam de mostrar o que você realmente quer.\nElas começam a mostrar apenas o que você acredita que os outros conseguem aceitar.\nEu não estou dizendo que você precisa ignorar todo mundo.\nNem que precisa começar a dizer não pra tudo.\nNão é isso.\nEu só quero que você perceba quem está participando das suas decisões.\nPorque pode existir alguém dentro da sua cabeça mesmo quando essa pessoa não está presente.\nVocê imagina o que ela vai pensar.\nO que vai falar.\nComo vai reagir.\nE muda sua resposta antes mesmo de dar a essa pessoa a oportunidade de responder.\nEntão, durante essa semana, antes de dizer sim… antes de mudar seus planos… antes de desistir de alguma coisa… para por alguns segundos.\nE se pergunta:\n"Essa é realmente a minha escolha?"\n"Ou é a versão da minha escolha que causa menos desconforto em alguém?"\nNão precisa mudar tudo imediatamente.\nPrimeiro, percebe.\nPercebe onde você suaviza o que pensa.\nOnde aceita o que não queria aceitar.\nOnde continua disponível mesmo estando cansado.\nOnde evita uma conversa porque tem medo de parecer uma pessoa ruim.\nTalvez você descubra que o problema não é não saber o que quer.\nTalvez você saiba.\nO que pesa é imaginar quem pode ficar decepcionado quando você se posicionar.\nE se isso aparecer durante a semana, não tenta fugir dessa percepção.\nSó observa.\nPorque você pode respeitar alguém sem entregar a essa pessoa o controle das suas escolhas.\nE talvez essa seja a pergunta que precisa acompanhar você durante os próximos dias:\n"Se eu não estivesse tentando evitar a decepção de alguém… o que eu escolheria?"',
    dataPublicacao: '2026-08-24T00:00:00-05:00', // meia-noite — mudança de prazo pedida em 23 ago 2026
    produtoRelacionado: 'vivencias',
  },
  {
    slug: 'limite-que-voce-estabeleceu-mas-continua-renegociando',
    titulo: 'O Limite Que Você Estabeleceu, Mas Continua Renegociando Quando Sente Desconforto',
    descricao:
      'O problema pode não ser colocar o limite. Pode ser sustentar a própria decisão depois que surgem culpa, pressão, silêncio ou medo de conflito.',
    categoria: 'Patterns',
    duracaoSegundos: 296,
    urlAudio:
      'https://pub-e0ca58c6090c4c5997d38f0e2e4165f8.r2.dev/02_%20O%20limite%20que%20voc%C3%AA%20estabeleceu%2C%20mas%20continua%20renegociando%20quando%20sente%20desconforto..mp3',
    transcricao:
      'Eu quero te interromper por um instante no meio dessa semana.\nTem algum limite que você já colocou… mas agora está começando a negociar de novo?\nTalvez você tenha decidido que não aceitaria mais uma determinada forma de ser tratado.\nTalvez tenha decidido que não assumiria novamente uma responsabilidade que não é sua.\nOu talvez tenha dito que não continuaria disponível sempre que alguém quisesse, mesmo quando isso estivesse te fazendo mal.\nNo momento em que você tomou essa decisão, parecia claro.\nVocê sabia por que precisava daquele limite.\nMas aí veio a reação.\nA outra pessoa ficou chateada.\nMudou a forma de falar com você.\nFicou em silêncio.\nComeçou a fazer você se sentir culpado.\nOu simplesmente demonstrou que não gostou da sua decisão.\nE agora você começou a questionar o limite que colocou.\nTalvez esteja pensando:\n"Será que eu exagerei?"\n"Será que estou sendo injusto?"\n"Talvez eu possa abrir uma exceção."\n"Só dessa vez não vai fazer diferença."\nMas eu quero que você perceba uma coisa.\nPode ser que nada tenha mudado na situação.\nA única coisa que mudou é que agora você está sentindo o desconforto de sustentar aquilo que decidiu.\nE isso é importante.\nPorque colocar um limite quando tudo está calmo é uma coisa.\nManter esse limite quando alguém demonstra insatisfação é outra completamente diferente.\nÉ nesse momento que o padrão costuma aparecer.\nVocê coloca o limite.\nA outra pessoa reage.\nVocê sente culpa, medo ou ansiedade.\nE, para acabar com esse desconforto, começa a negociar novamente.\nVocê explica mais uma vez.\nTenta suavizar o que disse.\nVolta atrás em uma parte.\nAbre uma exceção.\nE quando percebe, está novamente no mesmo lugar que fez você precisar daquele limite.\nÉ claro que você pode reconsiderar uma decisão.\nMudar de posição diante de uma informação nova também é maturidade.\nMas eu quero que você se pergunte:\nAlguma coisa realmente mudou?\nOu você só está tentando fazer esse desconforto passar?\nPorque existe uma diferença entre mudar uma decisão porque você entendeu algo novo… e mudar apenas porque não conseguiu suportar a reação de alguém.\nEu não estou dizendo que você precisa se tornar uma pessoa fria.\nLimite não é punição.\nNão é uma forma de controlar o outro.\nÉ uma forma de deixar claro o que você aceita, o que não aceita e como vai responder quando alguma coisa ultrapassar isso.\nEntão observa o que está acontecendo hoje.\nQual limite você está prestes a abandonar?\nE antes de voltar atrás, para um pouco.\nNão responda no auge da culpa.\nNão tente resolver tudo só porque o silêncio está te incomodando.\nNão explique pela quinta vez aquilo que você já explicou com clareza.\nDá um tempo para essa reação diminuir.\nDepois, pergunta pra você:\n"O que mudou desde que eu tomei essa decisão?"\nSe surgiu uma informação nova, você pode avaliar.\nMas se nada mudou além do desconforto que você está sentindo, talvez você não precise tomar outra decisão.\nTalvez precise apenas sustentar a que já tomou.\nPorque dizer o limite é só o começo.\nO que faz esse limite existir de verdade é o que você faz depois que alguém não gosta dele.\nEntão, antes de continuar o seu dia, pensa nisso:\nQual limite você está quase abandonando apenas para o desconforto acabar?',
    dataPublicacao: '2026-08-26T00:00:00-05:00', // quarta-feira, meia-noite — mesmo padrão de publicação exata do primeiro áudio
    produtoRelacionado: 'primeiro-passo',
  },
  {
    slug: 'esta-semana-mostrou-uma-mudanca-real-ou-apenas-mais-uma-promessa',
    titulo: 'Esta Semana Mostrou Uma Mudança Real Ou Apenas Mais Uma Promessa?',
    descricao:
      'A pessoa encerra a semana observando comportamentos concretos, em vez de sustentar expectativas apenas com palavras, intenções ou promessas.',
    categoria: 'Patterns',
    duracaoSegundos: 273,
    urlAudio:
      'https://pub-e0ca58c6090c4c5997d38f0e2e4165f8.r2.dev/03_%20%20Esta%20semana%20mostrou%20uma%20mudan%C3%A7a%20real%20ou%20apenas%20mais%20uma%20promessa.mp3',
    transcricao:
      'Antes de você entrar no fim de semana, eu quero que você olhe para uma situação específica dessa semana.\nNão precisa olhar para tudo.\nPensa apenas naquela situação, em que você acreditou que, dessa vez, seria diferente.\nTalvez alguém tenha prometido que mudaria.\nTalvez tenha dito que faria um esforço.\nQue não repetiria aquilo novamente.\nQue começaria a agir de outra maneira.\nOu talvez essa promessa tenha vindo de você mesmo.\nVocê prometeu que se posicionaria.\nQue teria aquela conversa.\nQue não voltaria para o mesmo comportamento.\nQue, quando aquela situação acontecesse novamente, sua resposta seria diferente.\nAgora que a semana está terminando, eu não quero que você pense apenas no que foi dito.\nEu quero que você observe o que realmente aconteceu.\nPorque uma promessa pode trazer esperança.\nUma intenção, pode ser sincera.\nAlguém, pode realmente querer mudar.\nVocê também pode desejar profundamente fazer diferente.\nMas querer mudar, e começar a mudança não são a mesma coisa.\nMudança real deixa algum sinal.\nNão precisa ser uma transformação enorme.\nNão precisa, acontecer tudo de uma vez.\nMas alguma coisa começa a aparecer no comportamento.\nUma resposta diferente.\nUma conversa que antes era evitada.\nUm limite que foi mantido.\nUma atitude que aconteceu mesmo com desconforto.\nUma escolha, que não ficou apenas no pensamento.\nEntão olha para essa semana e se pergunta:\n"O que eu fiz na prática?"\nNão o que você esperava ver.\nNão o que gostaria que tivesse acontecido.\nO que realmente aconteceu?\nPorque às vezes você quer tanto acreditar que algo mudou, que começa a transformar qualquer pequeno gesto, em uma prova.\nUma mensagem diferente parece mudança.\nUm pedido de desculpas, parece mudança.\nUm dia de esforço, parece mudança.\nMas pouco tempo depois, o mesmo comportamento aparece novamente.\nE você percebe que aquilo talvez não fosse uma mudança.\nEra apenas um momento diferente, dentro do mesmo padrão.\nIsso também pode acontecer com você.\nVocê toma uma decisão no domingo.\nComeça a semana com clareza.\nMas quando chega o desconforto, volta para a mesma resposta.\nEvita novamente.\nAdia novamente.\nAceita novamente aquilo que tinha decidido não aceitar.\nE no final da semana, em vez de olhar para o que aconteceu, faz uma nova promessa para começar na segunda-feira.\nEu não quero que você use essa reflexão para se atacar.\nNão é sobre culpa.\nÉ sobre clareza.\nSe você conseguiu responder diferente em algum momento, reconhece isso.\nMesmo que tenha sido uma mudança pequena.\nPorque é assim que uma nova resposta começa a ser construída.\nMas se o padrão se repetiu, também reconhece.\nNão cubra essa repetição com mais uma promessa.\nNão diga que foi diferente, só porque você queria muito que fosse.\nOlhar com clareza não significa desistir.\nSignifica parar de construir esperança, em cima de algo que ainda não apareceu na prática.\nEntão escolhe uma situação dessa semana e faz duas perguntas:\n"O que foi prometido?"\nE:\n"O que foi realmente sustentado?"\nTalvez as respostas sejam parecidas.\nTalvez você perceba que existe uma mudança começando.\nMas talvez, exista uma distância entre aquilo que foi dito e aquilo que aconteceu.\nE se existir essa distância, não precisa decidir tudo agora.\nSó não ignore.\nPorque enquanto você chama promessa de mudança, você continua esperando.\nQuando olha para o comportamento, você começa a enxergar o padrão.\nEntão, antes de entrar no fim de semana, fica com essa pergunta:\nEsta semana te mostrou uma mudança real… ou apenas mais uma promessa?',
    dataPublicacao: '2026-08-28T00:00:00-05:00', // sexta-feira, meia-noite
    produtoRelacionado: 'vivencias',
    // proximaReflexaoManual removido em 30 ago 2026 — a segunda-feira
    // seguinte (31/08) já tem data confirmada, então o teaser volta a ser
    // calculado automaticamente por getNextScheduledAudio().
  },
  {
    slug: 'voce-esta-assumindo-as-responsabilidades-emocionais-de-todos',
    titulo: 'Você Está Assumindo as Responsabilidades Emocionais de Todos, Por Quê?',
    descricao:
      'Existe uma diferença entre se importar com alguém e sentir que você precisa resolver tudo para conseguir ficar bem.',
    categoria: 'Relationships',
    duracaoSegundos: 248,
    urlAudio:
      'https://pub-e0ca58c6090c4c5997d38f0e2e4165f8.r2.dev/04_%20Segunda%20Feira%20-%20Voc%C3%AA%20est%C3%A1%20assumindo%20as%20responsabilidades%20emocionais%20de%20todos%20Por%20qu%C3%AA.mp3',
    transcricao:
      'Eu quero que você observe uma coisa durante esta semana.\nQuando alguém perto de você fica preocupado, frustrado, chateado ou em silêncio… o que acontece dentro de você?\nVocê consegue continuar o que estava fazendo?\nOu sente que precisa parar tudo, entender o que aconteceu e encontrar uma forma de fazer essa pessoa ficar bem?\nÀs vezes, ninguém pediu nada.\nMesmo assim, você percebe a mudança no tom de voz. Percebe a resposta mais curta. Percebe que alguma coisa não está bem.\nE, naquele momento, você já começa a pensar:\n"O que eu fiz?"\n"O que eu preciso fazer agora?"\n"Como eu resolvo isso?"\nSem perceber, você assume uma responsabilidade que talvez nem seja sua.\nE eu não estou falando sobre deixar de se importar.\nVocê pode amar alguém, oferecer apoio e estar presente.\nO problema começa quando você sente que não pode ficar em paz enquanto a outra pessoa não estiver em paz também.\nPorque, a partir daí, o estado emocional dela começa a controlar o seu.\nSe ela está bem, você relaxa.\nSe ela está mal, você entra em alerta.\nSe ela fica em silêncio, você tenta interpretar.\nSe ela se irrita, você começa a rever tudo o que falou ou fez.\nE é assim que você pode acabar passando o dia tentando administrar emoções que não pertencem a você.\nTalvez você chame isso de cuidado.\nMas presta atenção: cuidado é estar disponível.\nResponsabilidade emocional é quando você acredita que precisa mudar o estado da outra pessoa para conseguir recuperar o seu.\nSão coisas diferentes.\nEm algum momento, você pode ter aprendido que precisava manter todo mundo bem para evitar problemas.\nManter a paz.\nEvitar uma discussão.\nImpedir que alguém se afastasse.\nE esse comportamento pode ter se tornado tão automático que hoje você nem percebe quando começa a fazer isso.\nPor isso, durante esta semana, antes de correr para resolver o que alguém está sentindo, eu quero que você pare por alguns segundos.\nE pergunte:\n"Essa pessoa realmente precisa da minha ajuda ou eu estou tentando controlar o meu desconforto diante da emoção dela?"\nNão precisa se afastar.\nNão precisa agir com frieza.\nSó não assuma imediatamente que tudo precisa passar por você.\nA outra pessoa pode estar frustrada sem que você precise eliminar a frustração.\nEla pode estar chateada sem que isso signifique que você fez alguma coisa errada.\nEla pode precisar de espaço sem que isso represente rejeição.\nE ela também pode precisar aprender a administrar o que sente.\nVocê pode estar presente sem assumir o controle.\nPode ouvir sem resolver.\nPode se importar sem carregar.\nEntão observa isso durante esta semana:\nQuantas vezes você tenta recuperar a paz de todo mundo porque ainda não aprendeu a permanecer em paz quando alguém ao seu redor não está bem?\nCuidar de alguém não exige assumir aquilo que essa pessoa precisa aprender a administrar.',
    dataPublicacao: '2026-08-31T00:00:00-05:00', // segunda-feira, meia-noite
    produtoRelacionado: 'vivencias',
  },
  {
    slug: 'ainda-esperando-que-essa-pessoa-volte-a-ser-como-era-no-comeco',
    titulo: 'Você Ainda Está Esperando Que Essa Pessoa Volte a Ser Como Era no Começo?',
    descricao:
      'Clareza exige avaliar a relação pelo comportamento que existe hoje, não apenas pela pessoa que ela já demonstrou ser.',
    categoria: 'Clarity',
    duracaoSegundos: 236,
    urlAudio:
      'https://pub-e0ca58c6090c4c5997d38f0e2e4165f8.r2.dev/05_%20Quarta%20Feira%20-%20Voc%C3%AA%20ainda%20est%C3%A1%20esperando%20que%20essa%20pessoa%20volte%20a%20ser%20como%20era%20no%20come%C3%A7o.mp3',
    transcricao:
      'Eu quero que você pense em uma pessoa específica.\nPode ser alguém com quem você se relaciona hoje.\nOu alguém de quem você ainda não conseguiu se afastar emocionalmente.\nQuando você pensa nessa pessoa, qual versão dela aparece primeiro na sua cabeça?\nA pessoa que ela é hoje?\nOu a pessoa que ela foi no começo?\nPorque no começo pode ter existido atenção.\nInteresse.\nPresença.\nConversas que pareciam diferentes.\nVocê sentia que finalmente alguém estava enxergando você.\nE, quando a relação mudou, você começou a esperar que aquela versão voltasse.\nCada momento bom passou a funcionar como uma confirmação:\n"Está vendo? Essa pessoa ainda está aqui."\n"Ela só está passando por uma fase."\n"Talvez as coisas voltem a ser como antes."\nSó que o tempo foi passando.\nE você começou a conviver cada vez mais com o que a relação se tornou, enquanto continuava emocionalmente ligada ao que ela foi.\nEssa é uma parte difícil de perceber.\nPorque você não está inventando o começo.\nAquela experiência realmente aconteceu.\nA pessoa realmente foi atenciosa.\nRealmente fez promessas.\nRealmente demonstrou alguma coisa diferente.\nMas o fato de ter sido real naquele momento não significa que ainda seja a realidade de hoje.\nE aqui está a pergunta que você talvez esteja evitando:\nQuanto tempo você está esperando essa pessoa voltar?\nVocê não precisa tomar uma decisão agora.\nMas precisa começar a olhar para a relação sem usar o começo para justificar tudo o que acontece no presente.\nObserve o comportamento atual.\nQuando você precisa conversar, essa pessoa está disponível?\nQuando você coloca um limite, esse limite é respeitado?\nQuando algo machuca você, existe mudança ou somente uma nova promessa?\nVocê sente tranquilidade nessa relação ou vive tentando recuperar a tranquilidade que sentia no começo?\nPorque uma relação não pode ser avaliada apenas pelos melhores momentos que já existiram.\nEla precisa ser avaliada pela forma como funciona hoje.\nE isso não significa ignorar tudo o que foi bom.\nSignifica parar de usar o que foi bom para não enxergar o que está acontecendo agora.\nNo meio desta semana, eu quero que você faça uma coisa simples.\nQuando essa pessoa fizer algo que deixe você confuso, não compare esse comportamento com o começo.\nOlhe para a repetição.\nOlhe para o que acontece com frequência.\nOlhe para a maneira como você se sente antes, durante e depois de estar com ela.\nE perceba se você está se relacionando com a pessoa que existe hoje ou tentando manter viva uma versão que já não aparece há muito tempo.\nEsperar que alguém volte a ser como era também pode ser uma forma de adiar aquilo que você já está começando a entender.\nAntes de decidir o que fazer, olhe para o que existe hoje.',
    dataPublicacao: '2026-09-02T00:00:00-05:00', // quarta-feira, meia-noite
    produtoRelacionado: 'primeiro-passo',
  },
  {
    slug: 'quantas-vezes-disse-esta-tudo-bem-para-nao-explicar-o-que-sentia',
    titulo: 'Quantas Vezes Esta Semana Você Disse "Está Tudo Bem" Só Para Não Precisar Explicar o Que Estava Sentindo?',
    descricao:
      'Estabilidade não é fingir que nada incomodou. É conseguir reconhecer o que aconteceu e escolher uma resposta sem explodir nem se anular.',
    categoria: 'Patterns',
    duracaoSegundos: 249,
    urlAudio:
      'https://pub-e0ca58c6090c4c5997d38f0e2e4165f8.r2.dev/06_%20Sexta%20Feira%20-%20Quantas%20vezes%20esta%20semana%20voc%C3%AA%20disse%20%E2%80%9Cest%C3%A1%20tudo%20bem%E2%80%9D.mp3',
    transcricao:
      'Antes de entrar no fim de semana, eu quero que você volte mentalmente a uma situação que aconteceu nos últimos dias.\nAlguém perguntou se estava tudo bem.\nE você respondeu:\n"Está tudo bem."\nMas não estava.\nTalvez você estivesse chateado.\nCansado.\nIncomodado com alguma coisa que aconteceu.\nTalvez quisesse conversar, mas pensou que seria difícil explicar.\nEntão você decidiu deixar para lá.\nOu, pelo menos, tentou deixar.\nSó que aquilo não desapareceu porque você disse que estava tudo bem.\nVocê continuou pensando.\nMudou o jeito de falar.\nFicou mais distante.\nComeçou a responder diferente.\nE talvez a outra pessoa nem tenha entendido o motivo.\nPresta atenção nisso:\nÀs vezes você não diz "está tudo bem" porque realmente está bem.\nVocê diz para evitar uma conversa.\nPara não parecer difícil.\nPara não transformar aquilo em uma discussão.\nPara não precisar justificar por que alguma coisa incomodou você.\nE, naquele momento, o silêncio parece mais fácil.\nMas depois ele cobra um preço.\nPorque aquilo que você não conseguiu dizer começa a aparecer de outras formas.\nNa impaciência.\nNo afastamento.\nEm uma resposta mais dura.\nOu naquela explosão que parece ter acontecido por uma coisa pequena, mas que, na verdade, já estava acumulando muitas outras.\nEstabilidade emocional não é suportar tudo em silêncio.\nTambém não é falar qualquer coisa no auge da irritação.\nÉ conseguir reconhecer:\n"Isso me incomodou."\n"Eu ainda não sei como quero conversar sobre isso."\n"Eu preciso de um tempo, mas não quero fingir que está tudo bem."\nExiste uma diferença entre evitar uma reação impulsiva e apagar o que você sentiu.\nVocê pode não estar pronto para conversar naquele momento.\nTudo bem.\nMas não precisa mentir para si para preservar o conforto de outra pessoa.\nPor isso, olha para esta semana.\nQuantas vezes você disse que estava tudo bem quando queria ter dito alguma coisa diferente?\nE o que você estava tentando evitar?\nUma discussão?\nA desaprovação de alguém?\nA possibilidade de não ser compreendido?\nOu o medo de que, ao falar com sinceridade, alguma coisa na relação mudasse?\nNão precisa voltar e transformar cada situação em uma conversa difícil.\nApenas reconheça onde isso aconteceu.\nPorque, se você não percebe o momento em que se cala, só vai perceber quando já estiver cansado, distante ou prestes a reagir.\nNa próxima vez, você não precisa explicar tudo imediatamente.\nPode simplesmente dizer:\n"Não está tudo bem para mim ainda. Eu preciso pensar e depois quero conversar."\nÉ uma frase simples.\nMas ela impede que você escolha entre duas únicas opções: fingir que está tudo bem ou explodir.\nAntes de encerrar esta semana, não pergunte apenas o que aconteceu com você.\nPergunte também quantas vezes você escondeu o que estava acontecendo para manter tudo aparentemente tranquilo.',
    dataPublicacao: '2026-09-04T00:00:00-05:00', // sexta-feira, meia-noite
    produtoRelacionado: 'vivencias',
    // proximaReflexaoManual removido em 06 set 2026 — a segunda-feira
    // seguinte (07/09) já tem data confirmada, então o teaser volta a ser
    // calculado automaticamente a partir de getNextScheduledAudio().
  },
  {
    slug: 'por-que-voce-se-sente-em-divida-quando-alguem-faz-algo-por-voce',
    titulo: 'Por Que Você Se Sente em Dívida Toda Vez Que Alguém Faz Alguma Coisa Por Você?',
    descricao:
      'A dificuldade pode não estar em agradecer. A pessoa pode ter aprendido que receber ajuda, cuidado ou gentileza cria uma obrigação. Por isso, tenta compensar rapidamente para não se sentir vulnerável ou emocionalmente em dívida.',
    categoria: 'Relationships',
    duracaoSegundos: 168,
    urlAudio:
      'https://pub-e0ca58c6090c4c5997d38f0e2e4165f8.r2.dev/Seguencia%20Correta/01_%20Segunda_%20Por%20que%20voc%C3%AA%20se%20sente%20em%20d%C3%ADvida%20toda%20vez%20que%20algu%C3%A9m%20faz%20alguma%20coisa%20por%20voc%C3%AA.mp3',
    transcricao:
      'Eu quero que você observe uma coisa durante esta semana.\nQuando alguém faz alguma coisa por você, qual é a sua primeira reação?\nVocê consegue simplesmente receber?\nOu imediatamente começa a pensar:\n"Agora eu preciso retribuir."\n"Não quero ficar devendo."\n"Preciso fazer alguma coisa por essa pessoa também."\nTalvez alguém ofereça ajuda e você recuse, mesmo precisando.\nAlguém faz uma gentileza e você já procura uma forma de compensar.\nOu alguém cuida de você por um momento, mas, em vez de aproveitar, você fica desconfortável.\nPorque receber parece criar uma dívida.\nE eu não estou falando sobre gratidão.\nReconhecer o que alguém fez é importante.\nO problema começa quando você sente que não pode receber nada sem precisar pagar emocionalmente por aquilo.\nTalvez, em algum momento, você tenha aprendido que ajuda sempre vinha acompanhada de uma cobrança.\nAlguém fazia alguma coisa por você, e depois usava isso para pedir algo, controlar uma decisão, ou fazer você se sentir culpado.\nEntão você aprendeu que depender menos, era mais seguro.\nMas isso também pode ter criado uma dificuldade:\nVocê sabe oferecer.\nSabe ajudar.\nSabe cuidar.\nSó não sabe receber sem ficar em alerta.\nNesta semana, quando alguém fizer alguma coisa por você, pare antes de tentar compensar.\nE pergunta:\n"Essa pessoa realmente está me cobrando alguma coisa?"\n"Ou sou eu que estou transformando cuidado em obrigação?"\nTalvez você só precise dizer:\n"Obrigado. Isso foi importante para mim."\nE deixar o momento terminar ali.\nReceber não tira sua independência.\nNão deixa você fraco.\nE nem toda gentileza esconde uma cobrança.\nEntão observe:\nVocê está agradecendo pelo que recebeu…\nOu tentando pagar rapidamente para não correr o risco de ficar emocionalmente em dívida?',
    dataPublicacao: '2026-09-07T00:00:00-05:00', // segunda-feira, meia-noite
    produtoRelacionado: 'vivencias',
  },
  {
    slug: 'voce-errou-uma-coisa-e-ja-esta-tratando-a-semana-como-perdida',
    titulo: 'Você Errou Uma Coisa e Já Está Tratando a Semana Inteira Como Perdida?',
    descricao:
      'O erro isolado pode não ser o verdadeiro problema. O padrão aparece quando a pessoa usa uma falha como justificativa para abandonar tudo o que ainda poderia continuar construindo.',
    categoria: 'Patterns',
    duracaoSegundos: 152,
    urlAudio:
      'https://pub-e0ca58c6090c4c5997d38f0e2e4165f8.r2.dev/Seguencia%20Correta/02_Quarta%20-%20Voc%C3%AA%20errou%20uma%20coisa%20e%20j%C3%A1%20est%C3%A1%20tratando%20a%20semana%20inteira%20como%20perdida.mp3',
    transcricao:
      'Vamos dar uma pausa nesta quarta-feira e refletir.\nAlguma coisa não saiu como você planejou?\nVocê perdeu um horário.\nNão cumpriu uma parte da rotina.\nAdiou aquilo que tinha decidido fazer.\nOu reagiu de uma forma que queria evitar.\nE, logo depois, pensou:\n"Já estraguei tudo."\n"Agora não adianta mais."\n"Na próxima semana eu começo novamente."\nPresta atenção nisso.\nTalvez o problema não tenha sido apenas o que deu errado.\nTalvez tenha sido o que você decidiu fazer depois.\nUm erro aconteceu.\nMas, a partir dele, você abandonou todo o restante.\nÉ como se só existissem duas possibilidades:\nFazer tudo perfeitamente…\nOu não fazer mais nada.\nSó que um erro não transforma a semana inteira em um fracasso.\nPerder um dia não obriga você a perder os próximos.\nSair do plano em uma escolha não significa que precisa continuar fora dele.\nO padrão não está apenas no erro.\nEstá na forma como você responde quando o erro acontece.\nVocê se pune?\nDesiste?\nEspera outra segunda-feira para começar?\nOu consegue ajustar e continuar?\nEntão, em vez de tentar recuperar tudo de uma vez, faz uma pergunta simples:\n"Qual é a próxima escolha possível?"\nNão a escolha perfeita.\nNão uma compensação exagerada.\nApenas o próximo passo... aquele que coloca você novamente na direção que você tinha escolhido.\nVocê não precisa recomeçar a semana.\nPrecisa apenas retomar de onde está.\nEntão observa o que aconteceu:\nVocê realmente perdeu a semana inteira?\nOu está usando um erro como motivo para abandonar aquilo que ainda pode continuar construindo?\nO que define o seu padrão não é apenas o momento em que você sai do caminho.\nÉ o que você escolhe fazer logo depois.',
    dataPublicacao: '2026-09-09T00:00:00-05:00', // quarta-feira, meia-noite
    produtoRelacionado: 'primeiro-passo',
  },
  {
    slug: 'passou-a-semana-resolvendo-urgencias-e-sente-que-nao-saiu-do-lugar',
    titulo: 'Você Passou a Semana Resolvendo Urgências e, Mesmo Assim, Sente Que Não Saiu do Lugar?',
    descricao:
      'A sensação de não avançar pode não vir da falta de esforço. Pode vir de passar a semana reagindo ao que aparece e deixando aquilo que realmente importa depender do tempo que sobrar.',
    categoria: 'Emotional Stability',
    duracaoSegundos: 171,
    urlAudio:
      'https://pub-e0ca58c6090c4c5997d38f0e2e4165f8.r2.dev/Seguencia%20Correta/03_Sexta%20-%20Voc%C3%AA%20passou%20a%20semana%20resolvendo%20urg%C3%AAncias%20e%2C%20mesmo%20assim%2C%20sente%20que%20n%C3%A3o%20saiu%20do%20lugar-.mp3',
    transcricao:
      'Antes de entrar no fim de semana, olha para os seus últimos dias.\nVocê resolveu problemas.\nRespondeu mensagens.\nAtendeu pessoas.\nCuidou do que apareceu.\nPassou a semana inteira ocupado.\nMesmo assim, existe aquela sensação:\n"Eu fiz tanta coisa… mas parece que não avancei."\nTalvez isso aconteça porque estar ocupada e seguir uma direção não são a mesma coisa.\nO urgente sempre chega fazendo barulho.\nAlguém precisa de uma resposta.\nUm problema precisa ser resolvido.\nUma tarefa aparece.\nE você deixa de lado o que era importante, para cuidar do que parece não poder esperar.\nO problema é que aquilo que realmente importa, muitas vezes, não exige sua atenção imediatamente.\nAquela decisão pode esperar.\nA conversa pode ficar para depois.\nSeu corpo aguenta mais alguns dias.\nSeu projeto pessoal continua parado sem reclamar.\nE assim, semana após semana, você resolve o urgente, enquanto a sua própria vida permanece esperando.\nIsso não é uma avaliação de produtividade.\nVocê não precisa fazer mais coisas.\nPrecisa perceber se aquilo que ocupou seu tempo também levou você para onde queria ir.\nEntão pensa:\nO que consumiu sua energia esta semana?\nE o que era importante para você, mas foi deixado para depois novamente?\nTalvez você não consiga eliminar todas as urgências.\nMas pode parar de entregar a elas todo o seu espaço.\nAntes da próxima semana começar, escolha uma coisa importante que precisa deixar de depender do seu tempo livre.\nPode ser uma conversa.\nUma decisão.\nSeu cuidado pessoal.\nOu algo que você vem dizendo que fará quando tudo estiver mais calmo.\nPorque talvez esse momento calmo nunca apareça sozinho.\nEntão fica com essa pergunta:\nVocê passou esta semana avançando na direção que escolheu…\nOu apenas respondendo a tudo o que apareceu na sua frente?',
    dataPublicacao: '2026-09-11T00:00:00-05:00', // sexta-feira, meia-noite
    produtoRelacionado: 'vivencias',
    // proximaReflexaoManual removido em 17 set 2026 — a sexta-feira seguinte
    // (18/09) já tem data confirmada, então o teaser volta a ser calculado
    // automaticamente a partir de getNextScheduledAudio().
  },
  {
    slug: 'por-que-aquilo-que-voce-conquista-perde-o-valor-tao-rapido',
    titulo: 'Por Que Aquilo Que Você Conquista Perde o Valor Tão Rápido?',
    descricao:
      'Isso pode não ser apenas ambição. A pessoa pode estar mudando constantemente o ponto em que finalmente reconhecerá o próprio progresso.',
    categoria: 'Clarity',
    duracaoSegundos: 215, // 3:35 — duração real medida no arquivo (informado como 02:44, mas o arquivo do link toca 3:35)
    urlAudio:
      'https://pub-e0ca58c6090c4c5997d38f0e2e4165f8.r2.dev/Seguencia%20Correta/04_Sexta%20-%20Por%20que%20aquilo%20que%20voc%C3%AA%20conquista%20perde%20o%20valor%20t%C3%A3o%20r%C3%A1pido.mp3',
    transcricao:
      'Antes de entrar no fim de semana, pensa em alguma coisa que você conquistou recentemente.\nPode ser uma mudança no seu comportamento.\nUma decisão que conseguiu tomar.\nUm projeto que terminou.\nUma fase difícil que atravessou.\nOu algo que, algum tempo atrás, parecia muito distante.\nQuando isso aconteceu, você reconheceu a importância?\nOu, pouco tempo depois, começou a pensar: "Também não foi nada demais." "Qualquer pessoa conseguiria."\nE aquilo, que antes era importante, perdeu o valor rapidamente.\nUma nova meta apareceu.\nE agora você acredita que só poderá sentir orgulho quando alcançar essa próxima fase.\nPreste atenção neste padrão.\nTalvez isso não seja apenas ambição.\nAmbição faz você continuar avançando.\nMas ela não precisa apagar tudo o que já foi construído.\nO problema começa quando o ponto de chegada muda todas as vezes que você se aproxima dele.\nVocê alcança uma coisa.\nEla deixa de ser suficiente.\nAlcança outra.\nE ela também perde o valor.\nE assim, você passa anos avançando sem nunca experimentar a sensação de progresso.\nEntão olha para esta semana e pergunte: "O que eu consigo fazer atualmente, que já foi difícil para mim?" "Qual escolha atual mostra que alguma coisa realmente mudou?"\nNão é sobre fingir que tudo está perfeito.\nVocê pode reconhecer o que construiu, e ainda enxergar o que precisa melhorar.\nAs duas coisas podem existir juntas.\nMas, se você nunca registra o próprio avanço, sua vida começa a parecer uma sequência de coisas que ainda faltam fazer.\nAntes de criar outra exigência, reconheça onde você chegou.\nPorque aquilo que hoje parece pequeno pode ser exatamente o que uma versão anterior de você mesmo não conseguia construir.\nE talvez o próximo nível da sua mudança não seja conquistar mais alguma coisa.\nSeja parar de diminuir tudo aquilo que você já conquistou.',
    dataPublicacao: '2026-09-18T00:00:00-05:00', // sexta-feira, meia-noite
    produtoRelacionado: 'vivencias',
    // proximaReflexaoManual removido em 20 set 2026 — a segunda-feira
    // seguinte (21/09) já tem data confirmada, então o teaser volta a ser
    // calculado automaticamente a partir de getNextScheduledAudio().
  },
  {
    slug: 'por-que-voce-comeca-a-desconfiar-quando-as-coisas-comecam-a-dar-certo',
    titulo: 'Por Que Você Começa a Desconfiar Justamente Quando as Coisas Começam a Dar Certo?',
    descricao:
      'A pessoa pode desejar estabilidade, mas começar a procurar problemas quando finalmente a encontra. Não porque queira perder o que conquistou, mas porque a instabilidade ainda parece mais familiar.',
    categoria: 'Emotional Stability',
    duracaoSegundos: 164,
    urlAudio:
      'https://pub-e0ca58c6090c4c5997d38f0e2e4165f8.r2.dev/05_Segunda%20-%20Por%20que%20voc%C3%AA%20come%C3%A7a%20a%20desconfiar%20justamente%20quando%20as%20coisas%20come%C3%A7am%20a%20dar%20certo.mp3',
    transcricao:
      'Eu quero que você observe uma coisa durante esta semana.\nO que acontece dentro de você quando as coisas começam a dar certo?\nTalvez um relacionamento esteja mais tranquilo.\nUm projeto esteja avançando.\nSua rotina esteja começando a funcionar.\nOu um problema que ocupava sua mente finalmente tenha sido resolvido.\nVocê consegue aproveitar essa fase?\nOu começa a pensar:\n"Está tudo calmo demais."\n"Alguma coisa vai acontecer."\n"Isso não vai durar."\nEntão você começa a procurar sinais.\nAnalisa uma mensagem diferente.\nQuestiona uma oportunidade que antes queria.\nDiminui o próprio esforço.\nTesta o comportamento de alguém.\nOu cria uma dificuldade justamente onde as coisas estavam funcionando.\nPresta atenção nisso.\nTalvez você não esteja vendo um problema real.\nTalvez esteja sentindo o desconforto de viver uma realidade que ainda não se tornou familiar para você.\nQuando alguém passa muito tempo resolvendo conflitos, antecipando dificuldades ou tentando impedir que tudo saia do controle, a tranquilidade pode parecer estranha.\nVocê queria que o problema terminasse.\nMas agora que terminou, não sabe exatamente como agir sem ele.\nPor isso, nesta semana, quando surgir aquela sensação de que alguma coisa ruim vai acontecer, para antes de reagir.\nE pergunta:\n"Existe alguma evidência concreta de que algo está errado?"\n"Ou eu estou desconfiando apenas porque ainda não me acostumei com o que está funcionando?"\nVocê não precisa ignorar sinais reais.\nMas também não precisa criar um problema para justificar uma sensação.\nTalvez o próximo passo da sua mudança não seja resolver mais uma crise.\nSeja aprender a permanecer onde existe tranquilidade sem procurar imediatamente uma razão para sair dela.\nPorque, às vezes, o desafio não é apenas conquistar uma fase melhor.\nÉ conseguir viver nela sem destruir aquilo que você levou tanto tempo para construir.',
    dataPublicacao: '2026-09-21T00:00:00-05:00', // segunda-feira, meia-noite
    produtoRelacionado: 'vivencias',
  },
  {
    slug: 'essa-relacao-e-realmente-profunda-ou-so-e-intensa',
    titulo: 'Essa Relação É Realmente Profunda... Ou Só É Intensa?',
    descricao:
      'A intensidade pode produzir emoções fortes e ocupar completamente a mente da pessoa. Mas profundidade aparece na consistência, na confiança e na forma como a relação funciona quando não existe uma crise.',
    categoria: 'Relationships',
    duracaoSegundos: 182,
    urlAudio:
      'https://pub-e0ca58c6090c4c5997d38f0e2e4165f8.r2.dev/Seguencia%20Correta/06_Quarta%20-%20Essa%20rela%C3%A7%C3%A3o%20%C3%A9%20realmente%20profunda%E2%80%A6%20ou%20s%C3%B3%20%C3%A9%20intensa.mp3',
    transcricao:
      'Eu quero te interromper por um instante no meio desta semana.\nPensa em uma relação que provoca emoções muito fortes em você.\nQuando vocês estão bem, parece extraordinário.\nAs conversas são intensas.\nA proximidade é intensa.\nVocê sente que poucas pessoas conseguiriam compreender essa conexão.\nMas quando alguma coisa muda, tudo também muda rapidamente.\nVem o afastamento.\nO silêncio.\nA discussão.\nA dúvida.\nE, de repente, você não consegue pensar em outra coisa.\nDepois, quando vocês se aproximam novamente, o alívio é tão grande que parece confirmar:\n"Isso só acontece porque existe algo muito profundo entre nós."\nMas eu quero que você considere uma diferença.\nIntensidade e profundidade não são a mesma coisa.\nA intensidade aparece na força da emoção.\nA profundidade aparece na consistência da relação.\nUma relação profunda não existe apenas nos momentos extraordinários.\nEla também precisa existir nos dias comuns.\nNa forma como vocês conversam quando discordam.\nNa maneira como um limite é recebido.\nNa presença quando não existe uma crise.\nE na tranquilidade de não precisar questionar constantemente o lugar que você ocupa.\nÀs vezes, o afastamento provoca ansiedade.\nA reconciliação traz alívio.\nE esse alívio é interpretado como uma prova de amor.\nSó que talvez você não esteja sentindo a força da conexão.\nTalvez esteja sentindo apenas o fim momentâneo da tensão.\nPor isso, antes de avaliar essa relação pelos momentos mais intensos, observa o que acontece com frequência.\nExiste consistência?\nExiste confiança?\nVocê consegue ser você mesmo sem medo de que tudo mude de repente?\nNão precisa tomar nenhuma decisão agora.\nApenas não confunda o quanto essa relação ocupa sua mente com o quanto ela realmente sustenta você.\nPorque uma relação pode provocar sentimentos muito fortes... e ainda assim não oferecer a profundidade que você acreditava existir.',
    dataPublicacao: '2026-09-23T00:00:00-05:00', // quarta-feira, meia-noite
    produtoRelacionado: 'vivencias',
    proximaReflexaoManual: 'segunda-feira', // próxima segunda ainda não tem data de gravação confirmada
  },
]

export function isPublished(audio: Audio, now: Date = new Date()): boolean {
  return new Date(audio.dataPublicacao).getTime() <= now.getTime()
}

/** Já publicados, mais recentes primeiro. Nunca inclui um `dataPublicacao` no futuro. */
export function getPublishedAudios(now: Date = new Date()): Audio[] {
  return audios
    .filter((a) => isPublished(a, now))
    .sort((a, b) => new Date(b.dataPublicacao).getTime() - new Date(a.dataPublicacao).getTime())
}

/** Retorna undefined se o slug não existir OU se ainda não tiver sido publicado — nunca vaza um áudio agendado. */
export function getPublishedAudioBySlug(slug: string, now: Date = new Date()): Audio | undefined {
  return getPublishedAudios(now).find((a) => a.slug === slug)
}

export function getRelatedAudios(audio: Audio, limit = 3, now: Date = new Date()): Audio[] {
  return getPublishedAudios(now)
    .filter((a) => a.slug !== audio.slug && a.categoria === audio.categoria)
    .slice(0, limit)
}

/**
 * Teaser "Próxima reflexão" nas páginas já publicadas — pedido em 24 ago
 * 2026, junto com o segundo áudio real. Computado a partir dos dados (não é
 * um texto fixo numa página específica), então funciona sozinho pra
 * qualquer áudio futuro sem precisar editar nada manualmente: assim que o
 * próximo da fila publicar, o teaser desaparece de quem já mostrava ele e
 * passa a apontar pro seguinte, se houver.
 */
export function getNextScheduledAudio(now: Date = new Date()): Audio | undefined {
  return audios
    .filter((a) => !isPublished(a, now))
    .sort((a, b) => new Date(a.dataPublicacao).getTime() - new Date(b.dataPublicacao).getTime())[0]
}

/**
 * "quarta-feira, 26 de agosto" — só dia da semana e data, nunca título ou
 * categoria (pedido explícito: teaser não pode revelar do que se trata).
 * timeZone fixo em -05:00 pra combinar com o fuso já usado em
 * dataPublicacao — sem isso, o servidor rodando num fuso diferente poderia
 * arredondar pro dia errado perto da virada da meia-noite.
 */
export function formatProximaData(dataPublicacao: string): string {
  const date = new Date(dataPublicacao)
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'America/Bogota',
  }).format(date)
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remaining = seconds % 60
  return `${minutes}:${String(remaining).padStart(2, '0')}`
}
