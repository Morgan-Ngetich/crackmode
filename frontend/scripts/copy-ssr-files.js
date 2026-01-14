import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

// Copy server bundle to api folder for Vercel
const apiDir = path.join(projectRoot, '../api');
const serverSrc = path.join(projectRoot, 'dist/server');

if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

// Copy server bundle only
if (fs.existsSync(serverSrc)) {
  fs.cpSync(serverSrc, path.join(apiDir, 'server'), { recursive: true });
  console.log('✅ Copied server bundle to api/server');
} else {
  console.error('❌ Server bundle not found at:', serverSrc);
}