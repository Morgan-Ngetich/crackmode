import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

// Copy server bundle and manifest to api folder for Vercel
const apiDir = path.join(projectRoot, '../api');
const serverSrc = path.join(projectRoot, 'dist/server');
const manifestSrc = path.join(projectRoot, 'dist/client/.vite/manifest.json');

if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

// Copy server bundle
if (fs.existsSync(serverSrc)) {
  fs.cpSync(serverSrc, path.join(apiDir, 'server'), { recursive: true });
  console.log('✅ Copied server bundle to api/server');
}

// Copy manifest
if (fs.existsSync(manifestSrc)) {
  fs.copyFileSync(manifestSrc, path.join(apiDir, 'manifest.json'));
  console.log('✅ Copied manifest to api/manifest.json');
}