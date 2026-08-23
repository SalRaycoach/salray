# SAL Ray — salraycoach.com

Site em Next.js 14 (App Router) + TypeScript + Tailwind, hospedado na Hostinger com deploy automático a cada push na branch `main`.

## Como rodar localmente

```bash
npm install
npm run dev
```

## Estrutura em português (`/pt/`)

Tudo sob `/pt/` tem seu próprio layout raiz, com `<html lang="pt-BR">`, sem o menu/rodapé em inglês. Hoje inclui:

- `/pt/reflexoes/` — biblioteca gratuita de áudios "Reflexões SAL Ray" (indexável). Ver `COMO_PUBLICAR_AUDIO.md` pra adicionar um áudio novo.

---

## Upload de áudio pro Cloudflare R2

Os arquivos MP3 da biblioteca "Reflexões SAL Ray" **não** ficam hospedados no servidor da Hostinger — isso estouraria a banda do plano compartilhado rápido. Eles ficam no Cloudflare R2 (armazenamento gratuito até 10GB, sem cobrança por tráfego de saída), e o site só referencia o link público do arquivo.

Este é o passo a passo completo. Você faz isso sozinha, sem precisar de um programador, toda vez que gravar um lote novo de áudios.

### Configuração inicial (só precisa fazer uma vez)

1. Acesse **dash.cloudflare.com** e crie uma conta gratuita, se ainda não tiver uma.
2. No menu lateral, clique em **R2 Object Storage**.
3. Clique em **Create bucket**.
   - Nome do bucket: `salray-reflexoes-audio` (ou o nome que preferir — só precisa anotar, porque vai usar de novo).
   - Location: pode deixar automático.
4. Depois de criado, abra o bucket e vá em **Settings**.
5. Em **Public Access**, ative **Allow Access** na opção **R2.dev subdomain** (é a forma mais simples de ter uma URL pública sem precisar configurar domínio próprio).
6. O Cloudflare vai mostrar uma URL pública parecida com:
   `https://pub-xxxxxxxxxxxxxxxx.r2.dev`
   **Anote essa URL** — é a base de todos os links de áudio que você vai usar no site.

### Toda vez que gravar um lote novo de áudios

1. Prepare os arquivos MP3 finalizados no computador, com nomes simples e sem espaço (ex.: `quando-a-mente-nao-desacelera.mp3`) — o nome do arquivo não precisa ser igual ao `slug` do áudio no site, mas ajuda a não se confundir se for.
2. Acesse **dash.cloudflare.com → R2 Object Storage → salray-reflexoes-audio** (o bucket que você criou).
3. Clique em **Upload**.
4. Arraste os arquivos MP3 pra área de upload, ou clique pra selecionar do computador.
5. Espere o upload terminar (aparece uma barra de progresso por arquivo).
6. Clique em cada arquivo enviado pra ver os detalhes — lá aparece a **URL pública completa** dele, algo como:
   `https://pub-xxxxxxxxxxxxxxxx.r2.dev/quando-a-mente-nao-desacelera.mp3`
7. Copie essa URL — é exatamente o que vai no campo `urlAudio` da nova entrada do áudio (ver `COMO_PUBLICAR_AUDIO.md`).

**Importante:** depois de enviado, não renomeie nem mova o arquivo no R2 — isso muda a URL e quebraria o link já cadastrado no site.
