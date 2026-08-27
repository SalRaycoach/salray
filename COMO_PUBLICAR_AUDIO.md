# Como publicar um áudio novo em "Reflexões SAL Ray"

Não existe painel visual nesta primeira versão — cada áudio é uma entrada num arquivo de código (`lib/audios.ts`). Este guia assume que você já fez o upload do MP3 pro Cloudflare R2 (ver `README.md`, seção "Upload de áudio").

## Passo a passo

1. Abra o arquivo `lib/audios.ts`.
2. Encontre o array `audios` (começa com `export const audios: Audio[] = [`).
3. Copie o bloco modelo abaixo e cole como um novo item do array — pode ir em qualquer posição, a ordem no arquivo não importa (a ordem de exibição no site segue a data de publicação, mais recente primeiro).
4. Preencha cada campo (explicação de cada um logo abaixo).
5. Salve o arquivo.
6. Peça pro Claude Code (ou pro programador) confirmar que o build passa e fazer o commit + push — isso dispara o deploy automático.

## Bloco modelo (copiar e preencher)

```ts
{
  slug: 'titulo-em-formato-de-url',
  titulo: 'Título do Áudio',
  descricao: 'Descrição curta, 2 a 3 linhas, explicando do que trata a reflexão.',
  categoria: 'Patterns', // ver lista de categorias válidas abaixo
  duracaoSegundos: 300, // duração real do áudio, em segundos
  urlAudio: 'https://pub-xxxxxxxxxxxxxxxx.r2.dev/nome-do-arquivo.mp3', // URL copiada do R2
  transcricao: 'Texto completo (ou um resumo fiel) do que é dito no áudio. Obrigatório — é o que permite o Google indexar o conteúdo, já que áudio sozinho não é lido pelos buscadores.',
  dataPublicacao: '2026-09-01T09:00:00-05:00', // ver explicação abaixo
  produtoRelacionado: 'primeiro-passo', // ver lista de opções válidas abaixo
},
```

## Explicação de cada campo

- **slug** — parte final da URL do áudio (`salraycoach.com/pt/reflexoes/SLUG/`). Use só letras minúsculas, números e hífen, sem espaço nem acento. Precisa ser único — não pode repetir o de outro áudio já cadastrado.
- **titulo** — aparece como título da página e nos cards da lista.
- **descricao** — 2-3 linhas, aparece no card da lista e no topo da página do áudio.
- **categoria** — precisa ser exatamente uma destas quatro (respeitando maiúsculas, sempre em inglês no arquivo — é só o valor interno; no site aparece traduzida automaticamente):
  - `Patterns` → aparece como "Padrões"
  - `Relationships` → aparece como "Relacionamentos"
  - `Clarity` → aparece como "Clareza"
  - `Emotional Stability` → aparece como "Estabilidade Emocional"
- **duracaoSegundos** — duração real do arquivo de áudio, em segundos (ex.: um áudio de 5min30s = `330`).
- **urlAudio** — a URL pública do R2 (ver `README.md`).
- **transcricao** — texto completo ou resumo fiel do áudio. Pode ter quebras de linha (Enter) pra separar parágrafos.
- **dataPublicacao** — data e hora em que o áudio passa a aparecer no site, no formato `AAAA-MM-DDTHH:MM:SS-05:00` (o `-05:00` é o fuso horário — ajuste se precisar). **Enquanto essa data não chegar, o áudio fica completamente invisível e inacessível no site** — nem aparece na lista, nem abre por link direto. Isso é o que permite gravar várias semanas de uma vez e deixar o site "soltar" um por vez sozinho.
  - O site verifica a data a cada acesso — assim que o horário programado chega, o áudio aparece no próximo carregamento da página (sem esperar nenhum ciclo de cache).
- **produtoRelacionado** — qual das 4 ofertas da página de vendas (`/pt/reconstrucao-emocional/`) esse áudio deve sugerir no final. Precisa ser exatamente uma destas:
  - `primeiro-passo` — Primeiro Passo S.T.A.B.L.E.™ (US$ 17)
  - `vivencias` — Vivências de Reconstrução Emocional (US$ 147)
  - `mentoria` — Mentoria S.T.A.B.L.E.™
  - `personalizado` — Acompanhamento Personalizado

## "Próxima reflexão" nas páginas já publicadas

Assim que você cadastra um áudio novo com `dataPublicacao` no futuro, as páginas dos áudios já publicados passam a mostrar automaticamente "Próxima reflexão: [dia da semana], [data]" perto do final — sem título, categoria ou qualquer pista do conteúdo, só a data. Você não precisa editar nada pra isso acontecer nem pra isso parar: quando o áudio da fila publicar de verdade, o teaser desaparece sozinho (e passa a apontar pro próximo, se houver outro agendado).

**Exceção**: se o áudio que você acabou de cadastrar é o último da fila (ex.: o de sexta, e o de segunda seguinte ainda não tem data de gravação confirmada), adicione o campo opcional `proximaReflexaoManual` a ele:

```ts
proximaReflexaoManual: 'segunda-feira', // sem data, já que ainda não foi gravado
```

Isso faz a própria página desse áudio mostrar "Próxima reflexão: segunda-feira" (sem data) em vez de nada. Assim que você cadastrar o áudio de segunda de verdade (com `dataPublicacao` real), pode remover essa linha — o teaser volta a ser calculado automaticamente.

## Erros comuns

- **Esquecer as aspas simples** (`'`) ao redor de textos — o arquivo é código, cada texto precisa estar entre aspas.
- **Repetir um slug já usado** — cada áudio precisa de um slug único.
- **Categoria ou produtoRelacionado escritos diferente da lista** (maiúscula errada, espaço a mais) — precisa ser exatamente igual ao que está nas listas acima.
- **Esquecer a vírgula** no final do bloco, se for adicionar mais de um áudio de uma vez.
