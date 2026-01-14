// api/render.js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ✅ Fix paths to work in Vercel's deployment structure
const clientPath = path.join(process.cwd(), 'frontend/dist/client')
const serverPath = path.join(process.cwd(), 'frontend/dist/server')

console.log('🔍 Checking paths...')
console.log('Client path:', clientPath)
console.log('Server path:', serverPath)
console.log('Client exists:', fs.existsSync(clientPath))
console.log('Server exists:', fs.existsSync(serverPath))

// Cache these at module level
let templateCache = null
let renderCache = null
let assetsCache = null

function loadTemplate() {
  if (templateCache) return templateCache

  console.log('🔍 Loading template...')
  
  // Try to find the template
  const templatePath = path.join(clientPath, 'index.html')
  
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found at: ${templatePath}`)
  }

  templateCache = fs.readFileSync(templatePath, 'utf-8')
  console.log('✅ Template loaded, length:', templateCache.length)
  
  return templateCache
}

async function loadRender() {
  if (renderCache) return renderCache

  console.log('🔍 Loading server bundle...')
  
  const entryServerPath = path.join(serverPath, 'entry-server.js')
  
  console.log('Looking for server bundle at:', entryServerPath)
  
  if (!fs.existsSync(entryServerPath)) {
    throw new Error(`Server bundle not found at: ${entryServerPath}`)
  }

  const module = await import(entryServerPath)
  renderCache = module.render

  if (!renderCache) {
    throw new Error('No render function exported from entry-server.js')
  }

  console.log('✅ Render function loaded')
  return renderCache
}

function getClientAssets() {
  if (assetsCache) return assetsCache

  const manifestPath = path.join(clientPath, '.vite/manifest.json')

  console.log('🔍 Looking for manifest at:', manifestPath)

  if (!fs.existsSync(manifestPath)) {
    console.error('❌ Manifest not found!')
    console.log('📁 Client directory contents:', fs.readdirSync(clientPath))
    throw new Error('Vite manifest not found - build may have failed')
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
    
    // ✅ FIXED: Look for the actual client entry point
    // Try common entry point names in order
    const entryKey = Object.keys(manifest).find(key => 
      key === 'src/main.tsx' || 
      key === 'main.tsx' ||
      key === 'src/entry-client.tsx' ||
      key === 'entry-client.tsx' ||
      key.endsWith('main.tsx')
    )

    if (!entryKey) {
      console.error('❌ Available manifest keys:', Object.keys(manifest))
      throw new Error('No client entry point found in manifest. Available keys: ' + Object.keys(manifest).join(', '))
    }

    console.log('✅ Found entry key:', entryKey)
    const entry = manifest[entryKey]

    assetsCache = {
      entry: `/${entry.file}`,
      css: entry.css?.map(f => `/${f}`) || [],
      preload: entry.imports?.map(imp => {
        const importEntry = manifest[imp]
        return importEntry ? `/${importEntry.file}` : null
      }).filter(Boolean) || []
    }

    console.log('✅ Assets loaded:', assetsCache)
    return assetsCache
  } catch (err) {
    console.error('❌ Failed to parse manifest:', err)
    throw err
  }
}

export default async function handler(req, res) {
  console.log('\n' + '='.repeat(50))
  console.log('🚀 SSR Request:', req.url)
  console.log('='.repeat(50))

  // Block static files
  if (req.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
    return res.status(404).send('Not found')
  }

  try {
    const url = req.url?.split('?')[0] || '/'

    // Load resources
    const htmlTemplate = loadTemplate()
    const renderFn = await loadRender()
    const assets = getClientAssets()

    console.log('📦 Starting SSR render...')
    
    const cookies = req.headers.cookie || ''
    const renderResult = await renderFn({ url, cookies })

    console.log('✅ SSR complete')
    console.log('   HTML length:', renderResult.html?.length || 0)

    const { html, head } = renderResult

    // Build head content
    const headContent = [
      head?.title || '',
      head?.meta || '',
      head?.link || '',
      head?.script || '',
      ...assets.css.map(href => `<link rel="stylesheet" href="${href}">`),
      ...assets.preload.map(href => `<link rel="modulepreload" crossorigin href="${href}">`),
      `<script type="module" crossorigin src="${assets.entry}"></script>`,
    ].filter(Boolean).join('\n')

    // Replace placeholders
    let finalHtml = htmlTemplate
      .replace('<!--ssr-head-->', headContent)
      .replace('<!--ssr-outlet-->', html || '')

    console.log('✅ SSR successful for:', url)
    console.log('   Final HTML length:', finalHtml.length)

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    res.status(200).send(finalHtml)

  } catch (error) {
    console.error('\n❌ SSR Error:', error)
    console.error('Stack:', error.stack)

    // Send error details in development
    const errorHtml = `
<!DOCTYPE html>
<html>
  <head>
    <title>SSR Error</title>
  </head>
  <body>
    <h1>SSR Error</h1>
    <pre>${error.message}\n\n${error.stack}</pre>
  </body>
</html>
    `

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.status(500).send(errorHtml)
  }
}