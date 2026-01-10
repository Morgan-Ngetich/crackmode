import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Cache these at module level
let templateCache = null
let renderCache = null

function loadTemplate() {
  if (templateCache) return templateCache
  
  console.log('🔍 Searching for template...')
  
  // Based on test.js results, the correct path is:
  const templatePath = path.join(__dirname, '../frontend/dist/client/index.html')
  
  console.log('Loading template from:', templatePath)
  
  if (!fs.existsSync(templatePath)) {
    console.error('❌ Template not found at:', templatePath)
    console.log('Available files in frontend:', fs.readdirSync(path.join(__dirname, '../frontend')))
    throw new Error(`Template not found at: ${templatePath}`)
  }
  
  templateCache = fs.readFileSync(templatePath, 'utf-8')
  console.log('✅ Template loaded, size:', templateCache.length, 'bytes')
  
  return templateCache
}

async function loadRender() {
  if (renderCache) return renderCache
  
  console.log('🔍 Loading server bundle...')
  
  // Based on test.js results, the correct path is:
  const serverPath = path.join(__dirname, '../frontend/dist/server/entry-server.js')
  
  console.log('Loading server from:', serverPath)
  
  if (!fs.existsSync(serverPath)) {
    console.error('❌ Server bundle not found at:', serverPath)
    console.log('Available files in frontend/dist:', fs.readdirSync(path.join(__dirname, '../frontend/dist')))
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

export default async function handler(req, res) {
  console.log('\n' + '='.repeat(50))
  console.log('🚀 SSR Request received')
  console.log('URL:', req.url)
  console.log('='.repeat(50))
  
  // Declare these first to avoid initialization errors
  let htmlTemplate = null
  let renderFn = null
  
  try {
    const url = req.url?.split('?')[0] || '/'
    
    // Load template and render function
    console.log('\n📦 Loading resources...')
    htmlTemplate = loadTemplate()
    renderFn = await loadRender()
    
    // DEBUG: Check template for script tags
    console.log('\n🔍 Template Script Check:')
    console.log('Template has <script type="module">:', htmlTemplate.includes('<script type="module"'))
    const scriptMatch = htmlTemplate.match(/<script[^>]*src="\/assets\/[^"]+\.js"[^>]*>/g)
    console.log('Script tags found:', scriptMatch ? scriptMatch.length : 0)
    if (scriptMatch) {
      scriptMatch.forEach((tag, i) => console.log(`  Script ${i + 1}:`, tag))
    }
    
    const userAgent = req.headers['user-agent'] || ''
    const isBot = /bot|crawler|spider|crawling/i.test(userAgent) || 
                  /facebookexternalhit|twitterbot|linkedinbot|slackbot|telegrambot|whatsapp|discordbot/i.test(userAgent)
    
    console.log(`👤 Request from: ${isBot ? 'BOT' : 'USER'}`)
    
    // Perform SSR
    try {
      console.log('\n🎨 Starting SSR rendering...')
      
      const cookies = req.headers.cookie || ''
      const renderResult = await renderFn({ url, cookies })
      
      console.log('✅ SSR render complete')
      console.log('HTML length:', renderResult.html?.length || 0)
      
      const { html, head } = renderResult
      
      const finalHtml = htmlTemplate
        .replace('<!--ssr-head-->', 
          (head?.title || '') + 
          (head?.meta || '') + 
          (head?.link || '') + 
          (head?.script || '')
        )
        .replace('<!--ssr-outlet-->', html || '')
      
      // DEBUG: Check final HTML for script tags
      console.log('\n🔍 Final HTML Script Check:')
      console.log('Final has <script type="module">:', finalHtml.includes('<script type="module"'))
      const finalScriptMatch = finalHtml.match(/<script[^>]*src="\/assets\/[^"]+\.js"[^>]*>/g)
      console.log('Script tags in final:', finalScriptMatch ? finalScriptMatch.length : 0)
      
      if (finalHtml.includes('<!--ssr-head-->') || finalHtml.includes('<!--ssr-outlet-->')) {
        console.warn('⚠️  Placeholders still present!')
      } else {
        console.log('✅ Placeholders replaced')
      }
      
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
      res.status(200).send(finalHtml)
      
      console.log('✅ SSR successful for:', url)
      
    } catch (ssrError) {
      console.error('\n❌ SSR Render Error:', ssrError.message)
      console.error('Stack:', ssrError.stack)
      
      // Fallback - use the loaded template
      const fallback = getFallbackContent(url)
      const fallbackHtml = htmlTemplate
        .replace('<!--ssr-head-->', `
          <title>${fallback.title}</title>
          <meta name="description" content="${fallback.description}">
        `)
        .replace('<!--ssr-outlet-->', fallback.content)
      
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.status(200).send(fallbackHtml)
      
      console.log('⚠️  Served fallback')
    }
    
  } catch (error) {
    console.error('\n❌❌❌ CRITICAL Error:', error.message)
    console.error('Stack:', error.stack)
    
    // Ultimate fallback - don't rely on htmlTemplate
    const fallback = getFallbackContent(req.url?.split('?')[0] || '/')
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${fallback.title}</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          <div style="max-width: 800px; margin: 100px auto; padding: 20px; text-align: center;">
            <h1>CrackMode</h1>
            <h2>Master LeetCode & Algorithms</h2>
            <div style="color: red; margin: 20px 0;">
              <strong>Error:</strong> ${error.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
            </div>
          </div>
        </body>
      </html>
    `)
  }
}

function getFallbackContent(url) {
  return {
    title: 'CrackMode | Master LeetCode & Algorithms',
    description: 'Master coding interviews with comprehensive LeetCode solutions',
    content: `
      <div style="max-width: 800px; margin: 100px auto; text-align: center; padding: 20px;">
        <h1 style="font-size: 48px;">CrackMode</h1>
        <h2 style="font-size: 24px; color: #666;">Master LeetCode & Algorithms</h2>
        <p style="color: #888;">Loading...</p>
      </div>
    `
  }
}