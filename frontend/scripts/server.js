import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProduction = process.env.NODE_ENV === 'production'
const PORT = process.argv[2] || process.env.PORT || 8080

console.log('🚀 Starting server from:', __dirname)
console.log('🏗️  Production mode:', isProduction)

// Fallback content generator
function getFallbackContent(url) {
  if (url === '/' || url === '') {
    return {
      title: 'Crackmode - Documentation',
      description: 'Get better at solving leetcode problems with Crackmode.',
      content: `
        <div id="root">
          <header style="text-align: center; padding: 2rem;">
            <h1>Crackmode</h1>
            <p>Welcome to Crackmode!</p>
          </header>
        </div>
      `
    }
  } else {
    return {
      title: 'Crackmode - Documentation',
      description: 'Get better at solving leetcode problems with Crackmode.',
      content: '<div id="root"></div>'
    }
  }
}

async function createServer() {
  const app = express()

  let vite
  if (!isProduction) {
    // Only import vite in development
    const { createServer: createViteServer } = await import('vite')
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
      root: path.resolve(__dirname, '..')
    })
    app.use(vite.middlewares)
    console.log('✅ Vite dev server initialized')
  } else {
    // ✅ SERVE STATIC FILES IN PRODUCTION
    // This must come BEFORE the SSR catch-all route
    app.use('/assets', express.static('/usr/share/nginx/html/assets', {
      maxAge: '1y',
      immutable: true,
      setHeaders: (res, filepath) => {
        if (filepath.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
        } else if (filepath.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css; charset=utf-8')
        }
      }
    }))
    console.log('✅ Static assets configured from: /usr/share/nginx/html/assets')
  }

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
  })

  // Handle all OTHER routes (SSR)
  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl.split("?")[0]
      console.log('\n🔄 SSR request for:', url)

      let template, render

      if (!isProduction) {
        // Dev mode
        const templatePath = path.resolve(__dirname, '../index.html')
        console.log('📄 Loading dev template from:', templatePath)
        
        template = fs.readFileSync(templatePath, 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/seo/entry-server.tsx')).render
      } else {
        // Production mode
        console.log('📄 Loading production template and server...')

        // Template from nginx html directory
        const templatePath = '/usr/share/nginx/html/index.html'
        console.log('   Template path:', templatePath)
        
        if (!fs.existsSync(templatePath)) {
          throw new Error(`Template not found at: ${templatePath}`)
        }
        
        template = fs.readFileSync(templatePath, 'utf-8')

        // Server entry
        const serverPath = path.resolve(__dirname, '../dist/server/entry-server.js')
        console.log('   Server path:', serverPath)

        if (!fs.existsSync(serverPath)) {
          throw new Error(`Server entry not found at: ${serverPath}`)
        }

        render = (await import(serverPath)).render
      }

      // Always do SSR
      try {
        console.log('🎨 Attempting SSR...')
        const cookies = req.headers.cookie || ""
        const protocol = req.headers['x-forwarded-proto'] || 'http'
        const host = req.headers.host || req.headers['x-forwarded-host'] || 'localhost:' + PORT
        const { html, head } = await render({
          url,
          cookies,
          host,
          protocol
        })

        const finalHtml = template
          .replace(`<!--ssr-head-->`, head.title + head.meta + head.link + head.script)
          .replace(`<!--ssr-outlet-->`, html)

        res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml)
        console.log('✅ SSR successful for:', url)
      } catch (ssrError) {
        console.error('❌ SSR Error:', ssrError)

        // Fallback with route-specific content
        const fallback = getFallbackContent(url)
        const fallbackHtml = template
          .replace(`<!--ssr-head-->`,
            `<title>${fallback.title}</title>
             <meta name="description" content="${fallback.description}">`)
          .replace(`<!--ssr-outlet-->`, fallback.content)

        res.status(200).set({ 'Content-Type': 'text/html' }).end(fallbackHtml)
        console.log('⚠️  Served fallback for:', url)
      }
      
    } catch (e) {
      console.error('❌ Route handler error:', e)

      // Ultimate fallback
      const fallback = getFallbackContent(req.originalUrl.split("?")[0])
      const errorHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${fallback.title}</title>
          <meta name="description" content="${fallback.description}">
        </head>
        <body>
          ${fallback.content}
          <script>console.error('Server error:', ${JSON.stringify(e.message)})</script>
        </body>
        </html>
      `

      res.status(500).set({ 'Content-Type': 'text/html' }).end(errorHtml)
    }
  })

  app.listen(PORT, () => {
    console.log(`\n✅ Server running on http://localhost:${PORT}\n`)
  })
}

createServer().catch(console.error)