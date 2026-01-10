// api/test.js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default function handler(req, res) {
  try {
    console.log('🔍 Test endpoint called')
    
    const info = {
      // Directory info
      currentDir: __dirname,
      parentDir: path.join(__dirname, '..'),
      grandparentDir: path.join(__dirname, '../..'),
      cwd: process.cwd(),
      
      // File existence checks
      exists: {
        // Check dist in various locations
        distInCwd: fs.existsSync(path.join(process.cwd(), 'dist')),
        distInParent: fs.existsSync(path.join(__dirname, '../dist')),
        distInGrandparent: fs.existsSync(path.join(__dirname, '../../dist')),
        frontendDist: fs.existsSync(path.join(process.cwd(), 'frontend/dist')),
        
        // Check specific files
        templateInDist: fs.existsSync(path.join(process.cwd(), 'dist/client/index.html')),
        serverBundle: fs.existsSync(path.join(process.cwd(), 'dist/server/entry-server.js')),
        
        // Check from __dirname perspective
        templateRelative: fs.existsSync(path.join(__dirname, '../dist/client/index.html')),
        serverRelative: fs.existsSync(path.join(__dirname, '../dist/server/entry-server.js')),
      },
      
      // Directory listings
      filesInCwd: fs.readdirSync(process.cwd()),
      filesInCurrentDir: fs.readdirSync(__dirname),
      filesInParent: fs.readdirSync(path.join(__dirname, '..')),
      
      // If dist exists, show its contents
      ...(fs.existsSync(path.join(process.cwd(), 'dist')) && {
        distContents: {
          root: fs.readdirSync(path.join(process.cwd(), 'dist')),
          client: fs.existsSync(path.join(process.cwd(), 'dist/client')) 
            ? fs.readdirSync(path.join(process.cwd(), 'dist/client'))
            : 'no client folder',
          server: fs.existsSync(path.join(process.cwd(), 'dist/server'))
            ? fs.readdirSync(path.join(process.cwd(), 'dist/server'))
            : 'no server folder',
        }
      }),
      
      // Environment info
      nodeEnv: process.env.NODE_ENV,
      vercel: process.env.VERCEL,
      vercelEnv: process.env.VERCEL_ENV,
      vercelRegion: process.env.VERCEL_REGION,
      
      // Request info
      requestUrl: req.url,
      userAgent: req.headers['user-agent']?.substring(0, 100) || 'none',
    }
    
    console.log('📊 Test info collected:', Object.keys(info))
    
    // Set headers and send response
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Cache-Control', 'no-cache')
    res.status(200).json(info)
    
  } catch (error) {
    console.error('❌ Test endpoint error:', error)
    
    res.status(500).json({
      error: error.message,
      stack: error.stack,
      cwd: process.cwd(),
      __dirname: __dirname,
    })
  }
}