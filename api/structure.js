// api/structure.js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function listFiles(dir, depth = 0, maxDepth = 3) {
  if (depth > maxDepth) return '...'
  
  try {
    const items = fs.readdirSync(dir)
    const result = {}
    
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        result[item + '/'] = listFiles(fullPath, depth + 1, maxDepth)
      } else {
        result[item] = `${stat.size} bytes`
      }
    }
    
    return result
  } catch (error) {
    return `Error: ${error.message}`
  }
}

export default function handler(req, res) {
  const structure = {
    'Process CWD': listFiles(process.cwd()),
    'API Directory': listFiles(__dirname),
    'Parent Directory': listFiles(path.join(__dirname, '..')),
  }
  
  res.json(structure)
}