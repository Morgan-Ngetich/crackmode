import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let template
let render

function loadTemplate() {
  if (!template) {
    // ✅ From api/render.js → ../frontend/dist/client/index.html
    const templatePath = path.join(__dirname, '../frontend/dist/client/index.html')
    console.log('Loading template from:', templatePath)
    
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found at: ${templatePath}`)
    }
    
    template = fs.readFileSync(templatePath, 'utf-8')
  }
  return template
}

async function loadRender() {
  if (!render) {
    const serverPath = path.join(__dirname, '../frontend/dist/server/entry-server.js')
    console.log('Loading server from:', serverPath)
    
    if (!fs.existsSync(serverPath)) {
      throw new Error(`Server entry not found at: ${serverPath}`)
    }
    
    const module = await import(serverPath)
    render = module.render
  }
  return render
}

export default async function handler(req, res) {
  try {
    const url = req.url.split('?')[0]
    console.log('SSR request for:', url)
    
    // Load template and render function
    const htmlTemplate = loadTemplate()
    const renderFn = await loadRender()
    
    // Detect bots (optional - you had this in your original)
    const userAgent = req.headers['user-agent'] || ''
    const isBot = /bot|crawler|spider|crawling/i.test(userAgent) || 
                  /facebookexternalhit|twitterbot|linkedinbot|slackbot|telegrambot|whatsapp|discordbot/i.test(userAgent)
    
    console.log(`Request from ${isBot ? 'BOT' : 'USER'}: ${userAgent.substring(0, 50)}...`)
    
    // Perform SSR
    try {
      console.log('Attempting SSR...')
      
      const cookies = req.headers.cookie || ''
      const { html, head } = await renderFn({ url, cookies })
      
      const finalHtml = htmlTemplate
        .replace('<!--ssr-head-->', head.title + head.meta + head.link + head.script)
        .replace('<!--ssr-outlet-->', html)
      
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.setHeader('Cache-Control', 'no-cache')
      res.status(200).send(finalHtml)
      
      console.log('✅ SSR successful for:', url)
      
    } catch (ssrError) {
      console.error('SSR Error:', ssrError)
      
      // Fallback
      const fallback = getFallbackContent(url)
      const fallbackHtml = htmlTemplate
        .replace('<!--ssr-head-->', `
          <title>${fallback.title}</title>
          <meta name="description" content="${fallback.description}">
        `)
        .replace('<!--ssr-outlet-->', fallback.content)
      
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.status(200).send(fallbackHtml)
      
      console.log('⚠️ Served fallback for:', url)
    }
    
  } catch (error) {
    console.error('Handler error:', error)
    
    // Ultimate fallback
    const fallback = getFallbackContent(req.url.split('?')[0])
    const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${fallback.title}</title>
          <meta name="description" content="${fallback.description}">
        </head>
        <body>
          ${fallback.content}
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
        </div>
      </div>
    `
  }
}