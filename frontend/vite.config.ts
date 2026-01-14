import { defineConfig, type UserConfig, type ConfigEnv} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import mdx from "@mdx-js/rollup"
import remarkGfm from 'remark-gfm'

export default defineConfig((configEnv: ConfigEnv): UserConfig => {
  const { mode, isSsrBuild } = configEnv;
  const isDev = mode === 'development'
  const isProd = mode === 'production'

  return {
    base: "/",
    plugins: [
      mdx({
        jsxImportSource: 'react',
        providerImportSource: "@mdx-js/react",
        remarkPlugins: [remarkGfm],
      }),
      react(),
    ],
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    
    build: {
      manifest: isSsrBuild ? false : true,
      minify: isProd ? 'esbuild' : false,
      target: 'es2020',
      
      ...(isSsrBuild ? {
        ssr: true,
        outDir: 'dist/server',
        rollupOptions: {
          input: './src/seo/entry-server.tsx',
          output: {
            format: 'esm',
            entryFileNames: 'entry-server.js',
          },
          external: ['fs', 'path', 'url']
        }
      } : {
        outDir: 'dist/client',
        rollupOptions: {
          // Add explicit input for client build
          input: './src/main.tsx',
        }
      }),
    },
    
    ssr: {
      noExternal: ['@tanstack/react-router', '@chakra-ui/react', 'react-helmet-async'],
      external: ['fs', 'path', 'node:fs', 'node:path'],
    },
    
    server: isDev ? {
      port: 5174,
      proxy: {
        '/api': {
          target: process.env.VITE_API_URL || 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    } : undefined,
    
    esbuild: {
      jsx: 'automatic',
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
      drop: isProd ? ['console', 'debugger'] : [],
    },
  };
});