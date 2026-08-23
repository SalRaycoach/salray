# PROMPT — BIBLIOTECA DE ÁUDIOS "REFLEXÕES SAL RAY" (salraycoach.com/pt/reflexoes/)

⚠️ Mesma regra de sempre: trabalhar em branch separada (`pt-reflexoes-audio`), staging antes de qualquer merge pra `main`.

Este é um projeto novo, separado da página de vendas `/pt/reconstrucao-emocional/` — biblioteca pública e gratuita de áudios curtos em português, aberta pra indexação do Google (diferente da página de vendas, que é noindex).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 1. NOME E ROTAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Nome da série: **"Reflexões SAL Ray"** — centralizar isso numa constante de config (ex.: `lib/config.ts`), não espalhado em texto solto, pra facilitar troca de nome no futuro
- Hub: `app/pt/reflexoes/page.tsx`
- Página individual: `app/pt/reflexoes/[slug]/page.tsx`
- `<html lang="pt-BR">`, layout próprio sem Header/Footer em inglês (mesmo padrão da página de vendas em português)
- **Ao contrário da página de vendas:** `robots: 'index, follow'` — essa seção deve ser indexável, é conteúdo gratuito feito pra ser encontrado
- Incluir no `app/sitemap.ts`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 2. ARMAZENAMENTO DE ÁUDIO — CLOUDFLARE R2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Não hospedar os arquivos MP3 no servidor da Hostinger (risco de estourar banda do plano compartilhado)
- Usar Cloudflare R2 (10GB grátis, sem cobrança por egress/tráfego de saída) como armazenamento
- O player do site referencia a URL pública do arquivo no R2, não faz upload/proxy através do servidor Next.js
- Documentar no README do projeto os passos exatos de como fazer upload de um novo arquivo pro bucket R2, já que é você (não o programador) quem vai fazer isso toda vez que gravar um lote novo

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 3. CADASTRO DE ÁUDIOS — SEM PAINEL VISUAL NA V1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Cada áudio é uma entrada num arquivo de dados simples (ex.: `lib/audios.ts` ou um JSON), não um painel administrativo customizado
- Campos por áudio: `slug`, `titulo`, `descricao` (2-3 linhas), `categoria`, `duracaoSegundos`, `urlAudio` (link do R2), `transcricao` (texto completo ou resumo), `dataPublicacao` (data em que o áudio passa a aparecer no site), `produtoRelacionado` (referência a qual oferta da página de vendas esse áudio deve sugerir — ver seção 6)
- **Publicação programada:** um áudio com `dataPublicacao` no futuro não aparece no hub nem é acessível até essa data chegar — isso é o que permite gravar várias semanas de uma vez e o site "soltar" um por vez sozinho
- Documentar num arquivo simples (ex.: `COMO_PUBLICAR_AUDIO.md`) o passo a passo de como adicionar uma entrada nova, já que você mesma vai fazer isso sem depender do programador toda vez

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 4. ESTRUTURA DA PÁGINA INDIVIDUAL DE ÁUDIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ordem das seções:
1. Título do áudio
2. Player (play, pause, avanço, retrocesso, barra de progresso, controle de velocidade 0.75x-2x)
3. Duração visível
4. Descrição curta (2-3 linhas)
5. Transcrição ou resumo em texto abaixo do player — **obrigatório pra SEO**, já que áudio sozinho não é lido pelo Google
6. Bloco "Quer ir mais fundo?" ligado ao `produtoRelacionado` daquele áudio específico (não um CTA genérico igual em todos)
7. "Continue ouvindo" — 2-3 áudios relacionados da mesma categoria
8. Botão de compartilhar (foco em WhatsApp)

Schema: `AudioObject` (schema.org) com `transcript`, `duration`, `contentUrl` — ajuda tanto SEO quanto potencial citação por IA.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 5. HUB — `/pt/reflexoes/`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Lista dos áudios já publicados (respeitando `dataPublicacao` — nunca mostrar áudio agendado pro futuro), com duração visível em cada card
- Filtro simples por categoria (Patterns, Relationships, Clarity, Emotional Stability, Morning Reflections) — sem busca por palavra-chave na v1
- Sem paginação complexa por enquanto, dado o volume baixo inicial (3 áudios/semana)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 6. LIGAÇÃO COM OS PRODUTOS DA PÁGINA DE VENDAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- O campo `produtoRelacionado` de cada áudio referencia uma das 4 ofertas já existentes em `/pt/reconstrucao-emocional/` (Primeiro Passo $17, Vivências $147, Mentoria, Personalizado)
- O bloco de CTA na página do áudio linka pra âncora correspondente na página de vendas (ex.: `/pt/reconstrucao-emocional/#primeiro-passo`)
- Isso reaproveita a página de vendas já construída — não duplicar copy de produto aqui

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 7. COMPARTILHAMENTO E PREVIEW SOCIAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Open Graph por áudio: imagem (pode ser um template genérico da marca reaproveitado, com o título do áudio sobreposto, ou uma imagem única por áudio se você preferir depois), título, descrição curta
- Botão de compartilhar visível, com destaque pro WhatsApp

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 8. MEASUREMENT — GA4 (JÁ EXISTENTE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reutilizar o GA4 já instalado no site. Eventos a adicionar:
- `audio_play` (dispara ao apertar play, com `audio_slug`)
- `audio_25` / `audio_50` / `audio_75` / `audio_complete` (marcos de progresso)
- `audio_share_click`
- `related_audio_click`
- `product_cta_click` (com `produtoRelacionado` como parâmetro)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 9. FORA DE ESCOPO NA V1 — NÃO CONSTRUIR AGORA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Login / autenticação de usuário
- Produtos privados com controle de acesso
- Busca por palavra-chave
- Painel administrativo visual customizado
- "Continuar de onde parei" entre dispositivos (não existe sem login — não simular algo que pareça mais do que é)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 10. PRIMEIRA SEQUÊNCIA — ESTRUTURA, NÃO CONTEÚDO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A arquitetura de dados (seção 3) já suporta os áudios aparecerem em qualquer ordem/agrupamento — não precisa de campo especial pra marcar "isto é a sequência inicial". Quando eu definir os primeiros 3-5 áudios que espelham o formato do produto de $17, eles simplesmente entram como as primeiras entradas com `dataPublicacao` mais próxima.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 11. ANTES DE ME MANDAR PRA STAGING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- [ ] Hub + página individual funcionando com pelo menos 1-2 áudios de teste (arquivo de áudio placeholder é aceitável pro teste)
- [ ] `dataPublicacao` futura de fato esconde o áudio até a data chegar (testar com uma entrada futura e uma passada)
- [ ] Transcrição renderizando corretamente na página
- [ ] Schema `AudioObject` validado
- [ ] `index, follow` confirmado (diferente da página de vendas)
- [ ] Sitemap incluindo as novas rotas
- [ ] CTA de produto linkando pra âncora certa em `/pt/reconstrucao-emocional/`
- [ ] Eventos GA4 disparando corretamente
- [ ] `COMO_PUBLICAR_AUDIO.md` escrito, claro o suficiente pra eu seguir sozinha
- [ ] Build limpo, typecheck limpo

Link de staging pra revisão antes de qualquer merge.
