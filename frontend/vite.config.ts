import { defineConfig, type UserConfig, type ConfigEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { visualizer } from 'rollup-plugin-visualizer'
import mdx from '@mdx-js/rollup'
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
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [remarkGfm],
      }),
      react(),
      process.env.ANALYZE === 'true' &&
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
        filename: 'dist/client/stats.html',
      }),
    ].filter(Boolean),

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
    },

    build: {
      // minify: isProd ? 'esbuild' : false,
      minify: false,
      
      target: 'es2020',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 500,

      commonjsOptions: {
        include: [/node_modules/],
        extensions: ['.js', '.cjs'],
        strictRequires: true,
        transformMixedEsModules: true,
      },

      ...(isSsrBuild ? {
        ssr: true,
        outDir: 'dist/server',
        rollupOptions: {
          input: './src/seo/entry-server.tsx',
          output: {
            format: 'esm',
            entryFileNames: 'entry-server.js',
          },
        },
      } : {
        // Client build options
        outDir: 'dist/client',
        rollupOptions: {
          // ✅ Add this to exclude server files from client bundle
          external: (id) => {
            // Exclude .server.ts files from client bundle
            if (id.includes('.server.ts') || id.includes('.server.tsx')) return true;
            if (id.includes('@types/')) return true;
            return false;
          },
          output: {
            manualChunks: (id) => {

              // Put React in its own chunk
              if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
                return 'vendor-react'
              }

              // Route-based splitting
              if (id.includes('/src/routes/') && id.includes('.lazy.tsx')) {
                const routeMatch = id.match(/\/src\/routes\/(.+?)\/index\.lazy\.tsx/)
                if (routeMatch) {
                  const routeName = routeMatch[1].replace(/\//g, '-')
                  return `route-${routeName}`
                }
              }

              // MDX content
              if (id.includes('.mdx') && !id.includes('node_modules')) {
                const mdxMatch = id.match(/\/src\/components\/docs\/(.+?)\.mdx/)
                if (mdxMatch) {
                  const mdxName = mdxMatch[1]
                  if (mdxName.includes('/')) {
                    const dir = mdxName.split('/')[0]
                    return `mdx-${dir}`
                  }
                  return `mdx-${mdxName}`
                }
                return 'mdx-content'
              }

              // CrackMode features
              if (id.includes('/src/crackmode/')) {
                if (id.includes('/components/')) {
                  return 'crackmode-components'
                }
                if (id.includes('/hooks/')) {
                  return 'crackmode-hooks'
                }
                return 'crackmode-core'
              }

              // Vendor splitting
              if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
                return 'vendor-react'
              }
              if (id.includes('@chakra-ui') || id.includes('@emotion')) {
                return 'vendor-ui'
              }
              if (id.includes('@tanstack/react-router')) {
                return 'vendor-router'
              }
              if (id.includes('@tanstack/react-query') || id.includes('zustand')) {
                return 'vendor-state'
              }
              if (id.includes('@mdx-js')) {
                return 'vendor-mdx-runtime'
              }
              if (id.includes('shiki') || id.includes('rehype-highlight')) {
                return 'vendor-syntax'
              }
              if (id.includes('fuse.js')) {
                return 'vendor-search'
              }
              if (id.includes('recharts')) {
                return 'vendor-visualization'
              }
              if (id.includes('node_modules')) {
                return 'vendor-other'
              }
            },
            chunkFileNames: 'assets/[name]-[hash:8].js',
            entryFileNames: 'assets/[name]-[hash:8].js',
            assetFileNames: 'assets/[name]-[hash:8].[ext]',
          }
        }
      }),
    },

    server: isDev ? {
      port: 5174,
      hmr: {
        overlay: true,
      },
      proxy: {
        '/api': {
          target: process.env.VITE_API_URL || 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    } : undefined,

    // SSR configuration - add external for Node.js modules
    ssr: {
      noExternal: [
        '@tanstack/react-router',
        '@chakra-ui/react',
        '@emotion/react',
        '@emotion/styled',
        '@mdx-js/react',
        'framer-motion',
        'react-helmet-async',
      ],
      // externalize Node.js built-ins
      external: ['fs', 'path', 'node:fs', 'node:path'],
    },

    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        '@tanstack/react-router',
        '@chakra-ui/react',
        '@emotion/react',
        '@emotion/styled',
        'framer-motion',
        '@mdx-js/react',
        'react-helmet-async',
      ],
      exclude: [
        'fuse.js',
        'recharts',
        'shiki',
      ],
      esbuildOptions: {
        // Force React 18
        jsx: 'automatic',
      },
      force: true // isDev,
    },

    esbuild: {
      jsx: 'automatic',
      jsxImportSource: 'react',
      drop: isProd ? ['console', 'debugger'] : [],
      target: 'es2020',
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
    },
  };
})