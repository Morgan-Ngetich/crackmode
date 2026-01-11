import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Cache these at module level
let templateCache = null
let renderCache = null
let assetsCache = null

function loadTemplate() {
  if (templateCache) return templateCache

  console.log('🔍 Searching for template...')

  // Try SSR-specific template first
  const ssrTemplatePath = path.join(__dirname, '../frontend/dist/client/index.ssr.html')

  if (fs.existsSync(ssrTemplatePath)) {
    console.log('✅ Using SSR template:', ssrTemplatePath)
    templateCache = fs.readFileSync(ssrTemplatePath, 'utf-8')
  } else {
    // Fallback to regular template (won't work well but won't crash)
    console.warn('⚠️  SSR template not found, using client template')
    const fallbackPath = path.join(__dirname, '../frontend/dist/client/index.html')
    templateCache = fs.readFileSync(fallbackPath, 'utf-8')
  }

  console.log('Template has ssr-outlet:', templateCache.includes('<!--ssr-outlet-->'))
  console.log('Template length:', templateCache.length)

  return templateCache
}

async function loadRender() {
  if (renderCache) return renderCache

  console.log('🔍 Loading server bundle...')

  const serverPath = path.join(__dirname, '../frontend/dist/server/entry-server.js')

  console.log('Loading server from:', serverPath)

  if (!fs.existsSync(serverPath)) {
    console.error('❌ Server bundle not found at:', serverPath)
    throw new Error(`Server bundle not found at: ${serverPath}`)
  }

  const module = await import(serverPath)
  renderCache = module.render

  if (!renderCache) {
    throw new Error('No render function exported from entry-server.js')
  }

  console.log('✅ Render function loaded')
  return renderCache
}

// Helper to read Vite manifest for asset URLs
function getClientAssets() {
  if (assetsCache) return assetsCache

  const manifestPath = path.join(__dirname, '../frontend/dist/client/.vite/manifest.json')

  if (!fs.existsSync(manifestPath)) {
    console.warn('⚠️  No Vite manifest found, using fallback assets')
    assetsCache = {
      entry: '/assets/index-By93VWIg.js',
      css: [],
      preload: [
        '/assets/vendor-react-CcKOZ5PQ.js',
        '/assets/vendor-router-BBRXXhp5.js',
        '/assets/vendor-ui-3Tm0xZ4s.js',
        '/assets/vendor-state-COm_RIo9.js',
        '/assets/vendor-other-CY1qFXbz.js',
      ]
    }
    return assetsCache
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
    const entry = manifest['src/main.tsx']

    if (!entry) {
      throw new Error('No src/main.tsx entry in manifest')
    }

    assetsCache = {
      entry: `/${entry.file}`,
      css: entry.css?.map(f => `/${f}`) || [],
      preload: entry.imports?.map(imp => {
        const importEntry = manifest[imp]
        return importEntry ? `/${importEntry.file}` : null
      }).filter(Boolean) || []
    }

    console.log('✅ Loaded assets from manifest:', {
      entry: assetsCache.entry,
      cssCount: assetsCache.css.length,
      preloadCount: assetsCache.preload.length
    })

    return assetsCache
  } catch (err) {
    console.error('⚠️  Failed to parse manifest:', err.message)
    // Return fallback
    assetsCache = {
      entry: '/assets/index-By93VWIg.js',
      css: [],
      preload: []
    }
    return assetsCache
  }
}

export default async function handler(req, res) {
  console.log('\n' + '='.repeat(50))
  console.log('🚀 SSR Request received')
  console.log('URL:', req.url)
  console.log('Method:', req.method)
  console.log('='.repeat(50))

  // Block static file requests
  if (req.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
    console.error('⚠️  STATIC FILE REQUEST REACHED SSR HANDLER:', req.url)
    return res.status(404).send('Static file should not reach SSR handler')
  }

  try {
    const url = req.url?.split('?')[0] || '/'

    // Load resources
    console.log('\n📦 Loading resources...')
    const htmlTemplate = loadTemplate()
    const renderFn = await loadRender()
    const assets = getClientAssets()

    const userAgent = req.headers['user-agent'] || ''
    const isBot = /bot|crawler|spider|crawling/i.test(userAgent) ||
      /facebookexternalhit|twitterbot|linkedinbot|slackbot|telegrambot|whatsapp|discordbot/i.test(userAgent)

    console.log(`👤 Request from: ${isBot ? 'BOT' : 'USER'}`)

    // Perform SSR
    console.log('\n🎨 Starting SSR rendering...')

    const cookies = req.headers.cookie || ''
    const renderResult = await renderFn({ url, cookies })

    console.log('✅ SSR render complete')
    console.log('   HTML length:', renderResult.html?.length || 0)
    console.log('   Head title:', renderResult.head?.title?.substring(0, 50) || 'none')

    const { html, head } = renderResult

    // Build head content
    const headContent = [
      head?.title || '',
      head?.meta || '',
      head?.link || '',
      head?.script || '',
      // Add CSS links
      ...assets.css.map(href => `<link rel="stylesheet" href="${href}">`),
      // Add preload links
      ...assets.preload.map(href => `<link rel="modulepreload" crossorigin href="${href}">`),
      // Add main script
      `<script type="module" crossorigin src="${assets.entry}"></script>`,
    ].filter(Boolean).join('\n')

    // Replace placeholders
    let finalHtml = htmlTemplate
      .replace('<!--ssr-head-->', headContent)
      .replace('<!--ssr-outlet-->', html || '')

    // Verify replacement
    if (finalHtml.includes('<!--ssr-head-->') || finalHtml.includes('<!--ssr-outlet-->')) {
      console.error('❌ Placeholders still present after replacement!')
      console.log('Template preview:', htmlTemplate.substring(0, 500))
    } else {
      console.log('✅ Placeholders replaced successfully')
    }

    // Check for actual content
    const hasContent = finalHtml.includes('<div') || finalHtml.includes('<main')
    console.log('Has content in HTML:', hasContent)
    console.log('Final HTML length:', finalHtml.length)

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    res.status(200).send(finalHtml)

    console.log('✅ SSR successful for:', url)

  } catch (error) {
    console.error('\n❌❌❌ SSR Error:', error.message)
    console.error('Stack:', error.stack)

    // Fallback HTML with client-side rendering
    const assets = getClientAssets()
    const fallbackHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/svg+xml" href="/group.png">
    <title>CrackMode | Master LeetCode & Algorithms</title>
    <meta name="description" content="Master coding interviews with comprehensive LeetCode solutions">
    ${assets.preload.map(href => `<link rel="modulepreload" crossorigin href="${href}">`).join('\n')}
    <script type="module" crossorigin src="${assets.entry}"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`.trim()

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.status(500).send(fallbackHtml)

    console.log('⚠️  Served fallback HTML with client-side rendering')
  }
}