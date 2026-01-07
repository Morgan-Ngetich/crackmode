// Vercel serverless function
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Fallback content generator (from your server.js)
function getFallbackContent(url) {
  return {
    title: 'CrackMode | Master LeetCode & Algorithms',
    description: 'Master coding interviews with comprehensive LeetCode solutions and algorithm tutorials',
    content: `
      <div id="root">
        <header style="text-align: center; padding: 2rem;">
          <h1>CrackMode</h1>
          <p>Master LeetCode & Algorithms</p>
          <p>Your ultimate platform for coding interviews.</p>
        </header>
      </div>
    `
  };
}

// Cache the template and render function for better performance
let template;
let render;

async function loadTemplate() {
  if (!template) {
    const templatePath = path.join(__dirname, './frontend/dist/client/index.html');
    console.log('Loading template from:', templatePath);
    template = fs.readFileSync(templatePath, 'utf-8');
  }
  return template;
}

async function loadRender() {
  if (!render) {
    const serverPath = path.join(__dirname, './frontend/dist/server/entry-server.js');
    console.log('Loading server from:', serverPath);
    
    if (!fs.existsSync(serverPath)) {
      throw new Error(`Server entry not found at: ${serverPath}`);
    }
    
    const module = await import(serverPath);
    render = module.render;
  }
  return render;
}

export default async function handler(req, res) {
  try {
    const url = req.url.split("?")[0];
    console.log("SSR request for:", url);

    // Serve static assets directly
    if (url.startsWith('/assets/') || url.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff|woff2|ttf)$/)) {
      const filePath = path.join(__dirname, '../frontend/dist/client', url);
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath);
        const ext = path.extname(filePath);
        
        const contentTypes = {
          '.js': 'application/javascript; charset=utf-8',
          '.css': 'text/css; charset=utf-8',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.svg': 'image/svg+xml',
          '.ico': 'image/x-icon',
          '.woff': 'font/woff',
          '.woff2': 'font/woff2',
          '.ttf': 'font/ttf',
        };
        
        const contentType = contentTypes[ext] || 'application/octet-stream';
        
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        return res.status(200).send(content);
      }
    }

    // Load template and render function
    const htmlTemplate = await loadTemplate();
    const renderFn = await loadRender();

    // Check if this is a bot/crawler (from your server.js)
    const userAgent = req.headers['user-agent'] || '';
    const isBot = /bot|crawler|spider|crawling/i.test(userAgent) ||
      /facebookexternalhit|twitterbot|linkedinbot|slackbot|telegrambot|whatsapp|discordbot/i.test(userAgent);

    console.log(`Request from ${isBot ? 'BOT' : 'USER'}: ${userAgent.substring(0, 50)}...`);

    // Always do SSR (adapted from your server.js)
    try {
      console.log('Attempting SSR...');
      
      // Pass cookies to SSR render (from your server.js)
      const cookies = req.headers.cookie || "";
      const { html, head } = await renderFn({
        url,
        cookies
      });

      const finalHtml = htmlTemplate
        .replace(`<!--app-head-->`, head.title + head.meta + head.link + head.script)
        .replace(`<!--app-html-->`, html);

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).send(finalHtml);
      console.log('SSR successful for:', url);
    } catch (ssrError) {
      console.error('SSR Error:', ssrError);

      // Fallback with route-specific content (from your server.js)
      const fallback = getFallbackContent(url);
      const fallbackHtml = htmlTemplate
        .replace(`<!--app-head-->`,
          `<title>${fallback.title}</title>
           <meta name="description" content="${fallback.description}">`)
        .replace(`<!--app-html-->`, fallback.content);

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.status(200).send(fallbackHtml);
      console.log('Served fallback for:', url);
    }

  } catch (error) {
    console.error('Handler error:', error);

    // Ultimate fallback (from your server.js)
    const fallback = getFallbackContent(req.url.split("?")[0]);
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
        <script>console.error('Server error:', ${JSON.stringify(error.message)})</script>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(500).send(errorHtml);
  }
}