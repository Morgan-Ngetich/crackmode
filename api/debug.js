// api/debug.js
import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  const pathsToCheck = [
    { name: 'dist/client/index.html', path: path.join(process.cwd(), 'dist/client/index.html') },
    { name: 'dist/server/entry-server.js', path: path.join(process.cwd(), 'dist/server/entry-server.js') },
    { name: '../dist/client/index.html', path: path.join(__dirname, '../dist/client/index.html') },
    { name: '../dist/server/entry-server.js', path: path.join(__dirname, '../dist/server/entry-server.js') },
  ]
  
  const results = pathsToCheck.map(p => ({
    name: p.name,
    exists: fs.existsSync(p.path),
    size: fs.existsSync(p.path) ? fs.statSync(p.path).size : 0,
  }))
  
  res.json({
    results,
    cwd: process.cwd(),
    dirname: __dirname,
    timestamp: new Date().toISOString(),
  })
}