import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProduction = process.env.NODE_ENV === 'production'
const PORT = process.env.PORT || 5174

console.log('🚀 Starting server...')
console.log('📁 __dirname:', __dirname)
console.log('🏗️  Mode:', isProduction ? 'PRODUCTION' : 'DEVELOPMENT')

async function createServer() {
  const app = express()
  let vite

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite')
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
      root: path.resolve(__dirname, '..')
    })
    app.use(vite.middlewares)
    console.log('✅ Vite dev server initialized')
  } else {
    app.use('/assets', express.static(path.join(__dirname, '../dist/client/assets'), {
      maxAge: '1y',
      immutable: true
    }))
    console.log('✅ Static assets configured')
  }

  // API proxy
  app.use('/api/*', (req, res) => {
    console.log('❌ API request (no backend configured):', req.originalUrl)
    res.status(404).json({ error: 'API - configure proxy if needed' })
  })

  // SSR for all routes
  app.use('*', async (req, res) => {
    const url = req.originalUrl.split('?')[0]
    console.log('\n🔄 SSR Request:', url)
    
    try {
      let template, render

      if (!isProduction) {
        // Dev mode
        const templatePath = path.resolve(__dirname, '../index.html')
        console.log('📄 Loading template from:', templatePath)
        
        if (!fs.existsSync(templatePath)) {
          throw new Error(`Template not found at: ${templatePath}`)
        }
        
        template = fs.readFileSync(templatePath, 'utf-8')
        console.log('✅ Template loaded, length:', template.length)
        
        template = await vite.transformIndexHtml(url, template)
        console.log('✅ Template transformed by Vite')
        
        console.log('📦 Loading SSR module: /src/seo/entry-server.tsx')
        const ssrModule = await vite.ssrLoadModule('/src/seo/entry-server.tsx')
        console.log('✅ SSR module loaded, exports:', Object.keys(ssrModule))
        
        render = ssrModule.render
        
        if (!render) {
          throw new Error('No render function exported from entry-server.tsx')
        }
      } else {
        // Production mode
        const templatePath = path.join(__dirname, '../dist/client/index.html')
        console.log('📄 Loading template from:', templatePath)
        
        template = fs.readFileSync(templatePath, 'utf-8')
        
        const serverPath = path.join(__dirname, '../dist/server/entry-server.js')
        console.log('⚙️  Loading server from:', serverPath)
        
        const serverModule = await import(serverPath)
        render = serverModule.render
      }

      console.log('🎨 Calling render function...')
      const renderResult = await render({
        url,
        cookies: req.headers.cookie || ''
      })
      
      console.log('✅ Render complete, result keys:', Object.keys(renderResult))
      console.log('   - html length:', renderResult.html?.length || 0)
      console.log('   - head.title:', renderResult.head?.title?.substring(0, 50) || 'none')
      console.log('   - head.meta length:', renderResult.head?.meta?.length || 0)

      const { html, head } = renderResult

      // Check if placeholders exist in template
      const hasHeadPlaceholder = template.includes('<!--ssr-head-->')
      const hasOutletPlaceholder = template.includes('<!--ssr-outlet-->')
      
      console.log('🔍 Template check:')
      console.log('   - Has <!--ssr-head-->:', hasHeadPlaceholder)
      console.log('   - Has <!--ssr-outlet-->:', hasOutletPlaceholder)

      if (!hasHeadPlaceholder || !hasOutletPlaceholder) {
        console.warn('⚠️  WARNING: Template missing SSR placeholders!')
      }

      const finalHtml = template
        .replace('<!--ssr-head-->', head.title + head.meta + head.link + head.script)
        .replace('<!--ssr-outlet-->', html)

      // Verify replacement happened
      const stillHasPlaceholder = finalHtml.includes('<!--ssr-head-->') || finalHtml.includes('<!--ssr-outlet-->')
      if (stillHasPlaceholder) {
        console.error('❌ ERROR: Placeholders still present after replacement!')
      } else {
        console.log('✅ Placeholders successfully replaced')
      }

      res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml)
      console.log('✅ SSR successful for:', url)
      
    } catch (e) {
      if (vite) vite.ssrFixStacktrace(e)
      console.error('\n❌ SSR ERROR for', url)
      console.error('Error:', e.message)
      console.error('Stack:', e.stack)
      
      res.status(500).send(`
        <!DOCTYPE html>
        <html>
          <head><title>SSR Error</title></head>
          <body>
            <h1>SSR Error</h1>
            <pre>${e.message}\n\n${e.stack}</pre>
          </body>
        </html>
      `)
    }
  })

  app.listen(PORT, () => {
    console.log(`\n✅ Server running at http://localhost:${PORT}\n`)
  })
}

createServer().catch(err => {
  console.error('❌ Failed to start server:', err)
  process.exit(1)
})