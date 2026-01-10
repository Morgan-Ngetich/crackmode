import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let template
let render

function loadTemplate() {
  if (!template) {
    console.log('🔍 Searching for template...')
    console.log('Current working directory:', process.cwd())
    console.log('__dirname:', __dirname)

    // Try multiple possible paths
    const possiblePaths = [
      // Vercel's likely structure (build outputs at root)
      path.join(process.cwd(), 'dist/client/index.html'),
      // Your current expected path
      path.join(__dirname, '../dist/client/index.html'),
      // Alternative Vercel structure
      path.join(__dirname, '../../dist/client/index.html'),
      // If frontend folder exists
      path.join(process.cwd(), 'frontend/dist/client/index.html'),
      path.join(__dirname, '../frontend/dist/client/index.html'),
    ]

    let templatePath = null
    for (const possiblePath of possiblePaths) {
      console.log('Checking:', possiblePath)
      if (fs.existsSync(possiblePath)) {
        templatePath = possiblePath
        console.log('✅ Template found at:', templatePath)
        break
      }
    }

    if (!templatePath) {
      // Log what's actually available for debugging
      console.log('📁 Available files:')
      try {
        console.log('Files in process.cwd():', fs.readdirSync(process.cwd()))
      } catch (e) {
        console.log('Cannot read process.cwd():', e.message)
      }

      try {
        console.log('Files in __dirname:', fs.readdirSync(__dirname))
      } catch (e) {
        console.log('Cannot read __dirname:', e.message)
      }

      throw new Error(`Template not found. Checked paths:\n${possiblePaths.join('\n')}`)
    }

    template = fs.readFileSync(templatePath, 'utf-8')
    console.log('📄 Template loaded, size:', template.length, 'bytes')
  }
  return template
}

async function loadRender() {
  if (!render) {
    console.log('🔍 Searching for server bundle...')

    const possiblePaths = [
      path.join(process.cwd(), 'dist/server/entry-server.js'),
      path.join(__dirname, '../dist/server/entry-server.js'),
      path.join(__dirname, '../../dist/server/entry-server.js'),
      path.join(process.cwd(), 'frontend/dist/server/entry-server.js'),
      path.join(__dirname, '../frontend/dist/server/entry-server.js'),
    ]

    let serverPath = null
    for (const possiblePath of possiblePaths) {
      console.log('Checking:', possiblePath)
      if (fs.existsSync(possiblePath)) {
        serverPath = possiblePath
        console.log('✅ Server bundle found at:', serverPath)
        break
      }
    }

    if (!serverPath) {
      throw new Error(`Server entry not found. Checked paths:\n${possiblePaths.join('\n')}`)
    }

    try {
      // For serverless environments, we need to use file:// URLs
      const fileUrl = `file://${serverPath}`
      console.log('Importing from:', fileUrl)

      const module = await import(fileUrl)
      render = module.render

      if (!render) {
        throw new Error('No render function exported from entry-server.js')
      }

      console.log('✅ Render function loaded')
      return render
    } catch (importError) {
      console.error('❌ Failed to import server bundle:', importError.message)
      console.error('Stack:', importError.stack)

      // Try alternative import method
      try {
        console.log('Trying alternative import method...')
        const module = await import(serverPath)
        render = module.render

        if (!render) {
          throw new Error('No render function exported (alt import)')
        }

        console.log('✅ Render function loaded via alternative method')
        return render
      } catch (secondError) {
        console.error('❌ Alternative import also failed:', secondError.message)
        throw secondError
      }
    }
  }
  return render
}

export default async function handler(req, res) {
  console.log('\n' + '='.repeat(50))
  console.log('🚀 SSR Request received')
  console.log('URL:', req.url)
  console.log('Method:', req.method)
  console.log('User-Agent:', req.headers['user-agent']?.substring(0, 100) || 'none')
  console.log('='.repeat(50))

  try {
    const url = req.url?.split('?')[0] || '/'

    // Load template and render function
    console.log('\n📦 Loading resources...')
    console.log('Template has <script type="module">:', htmlTemplate.includes('<script type="module"'))
    const scriptMatch = htmlTemplate.match(/<script[^>]*src="\/assets\/[^"]+\.js"[^>]*>/g)
    console.log('Script tags found:', scriptMatch ? scriptMatch.length : 0)
    if (scriptMatch) {
      scriptMatch.forEach((tag, i) => console.log(`  Script ${i + 1}:`, tag))
    }
    const htmlTemplate = loadTemplate()
    const renderFn = await loadRender()

    // Detect bots for logging
    const userAgent = req.headers['user-agent'] || ''
    const isBot = /bot|crawler|spider|crawling/i.test(userAgent) ||
      /facebookexternalhit|twitterbot|linkedinbot|slackbot|telegrambot|whatsapp|discordbot/i.test(userAgent)

    console.log(`👤 Request from: ${isBot ? 'BOT' : 'USER'}`)

    // Perform SSR
    try {
      console.log('\n🎨 Starting SSR rendering...')

      const cookies = req.headers.cookie || ''
      console.log('Cookies present:', cookies ? 'Yes' : 'No')

      const renderResult = await renderFn({ url, cookies })
      console.log('✅ SSR render complete')
      console.log('HTML length:', renderResult.html?.length || 0)
      console.log('Head present:', !!(renderResult.head))

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

      // Verify replacement worked
      if (finalHtml.includes('<!--ssr-head-->') || finalHtml.includes('<!--ssr-outlet-->')) {
        console.warn('⚠️  WARNING: Placeholders still present after replacement!')
      } else {
        console.log('✅ Placeholders successfully replaced')
      }

      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
      res.status(200).send(finalHtml)

      console.log('✅ SSR successful for:', url)
      console.log('📤 Response sent, size:', finalHtml.length, 'bytes')

    } catch (ssrError) {
      console.error('\n❌ SSR Render Error:', ssrError.message)
      console.error('Stack:', ssrError.stack)

      // Fallback to static content
      console.log('🔄 Falling back to static content...')
      const fallback = getFallbackContent(url)
      const fallbackHtml = htmlTemplate
        .replace('<!--ssr-head-->', `
          <title>${fallback.title}</title>
          <meta name="description" content="${fallback.description}">
          <meta name="robots" content="noindex">
        `)
        .replace('<!--ssr-outlet-->', fallback.content)

      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.setHeader('Cache-Control', 'no-cache')
      res.status(200).send(fallbackHtml)

      console.log('⚠️  Served fallback for:', url)
    }

  } catch (error) {
    console.error('\n❌❌❌ CRITICAL Handler Error')
    console.error('Message:', error.message)
    console.error('Stack:', error.stack)

    // Ultimate fallback - basic HTML
    const fallback = getFallbackContent(req.url?.split('?')[0] || '/')
    const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${fallback.title}</title>
          <meta name="description" content="${fallback.description}">
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            .container { max-width: 800px; margin: 100px auto; text-align: center; padding: 40px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #333; margin-bottom: 16px; }
            h2 { color: #666; margin-bottom: 32px; }
            .error { color: #dc2626; background: #fef2f2; padding: 16px; border-radius: 4px; margin: 20px 0; text-align: left; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 style="font-size: 48px; margin-bottom: 16px;">CrackMode</h1>
            <h2 style="font-size: 24px; color: #666; margin-bottom: 32px;">Master LeetCode & Algorithms</h2>
            <p style="font-size: 18px; color: #888; margin-bottom: 24px;">Your ultimate platform for coding interviews.</p>
            <div class="error">
              <strong>SSR Error:</strong> ${error.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
            </div>
            <p>Loading client-side application...</p>
          </div>
          <div id="root"></div>
          <script>
            console.log('SSR failed, loading client-side...');
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          </script>
          <script type="module" crossorigin src="/assets/index.js"></script>
        </body>
      </html>
    `

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.status(500).send(errorHtml)
  }
}

function getFallbackContent(url) {
  return {
    title: 'CrackMode | Master LeetCode & Algorithms',
    description: 'Master coding interviews with comprehensive LeetCode solutions and algorithm tutorials',
    content: `
      <div id="root">
        <div style="max-width: 800px; margin: 100px auto; text-align: center; padding: 20px;">
          <h1 style="font-size: 48px; margin-bottom: 16px;">CrackMode</h1>
          <h2 style="font-size: 24px; color: #666; margin-bottom: 32px;">Master LeetCode & Algorithms</h2>
          <p style="font-size: 18px; color: #888;">Your ultimate platform for coding interviews.</p>
          <p style="color: #666; margin-top: 20px;">Loading...</p>
        </div>
      </div>
      <script>
        console.log('Static fallback loaded for: ${url}');
      </script>
    `
  }
}