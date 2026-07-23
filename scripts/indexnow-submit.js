/**
 * Submete todas as URLs do sitemap.xml ao IndexNow (Bing, Perplexity e outros).
 * Uso: npm run indexnow
 *
 * DOMINIO e INDEXNOW_KEY devem ser mantidos em sincronia com lib/config.ts
 * e o arquivo /public/[chave].txt.
 */

const DOMINIO = 'salraycoach.com' // SUBSTITUIR se o domínio mudar
const INDEXNOW_KEY = '30d298efbced4ea0b8fad98ab088275a' // SUBSTITUIR se gerar nova chave
const BATCH_SIZE = 100
const DELAY_MS = 2000

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function extractUrlsFromSitemap(xml) {
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
  return matches.map((m) => m[1])
}

function chunk(array, size) {
  const chunks = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

async function submitBatch(urls, batchNumber, totalBatches) {
  const body = {
    host: DOMINIO,
    key: INDEXNOW_KEY,
    keyLocation: `https://${DOMINIO}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  }

  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  })

  console.log(
    `[Batch ${batchNumber}/${totalBatches}] ${urls.length} URLs — status ${response.status} ${response.statusText}`
  )
}

async function main() {
  console.log(`Fetching sitemap at https://${DOMINIO}/sitemap.xml ...`)
  const sitemapResponse = await fetch(`https://${DOMINIO}/sitemap.xml`)

  if (!sitemapResponse.ok) {
    throw new Error(`Failed to fetch sitemap.xml: ${sitemapResponse.status} ${sitemapResponse.statusText}`)
  }

  const xml = await sitemapResponse.text()
  const urls = extractUrlsFromSitemap(xml)

  if (urls.length === 0) {
    console.log('No URLs found in sitemap.')
    return
  }

  const batches = chunk(urls, BATCH_SIZE)
  console.log(`${urls.length} URLs found — sending in ${batches.length} batch(es) of up to ${BATCH_SIZE}.`)

  for (let i = 0; i < batches.length; i++) {
    await submitBatch(batches[i], i + 1, batches.length)
    if (i < batches.length - 1) {
      await sleep(DELAY_MS)
    }
  }

  console.log('IndexNow submission complete.')
}

main().catch((error) => {
  console.error('Error submitting to IndexNow:', error.message)
  process.exit(1)
})
