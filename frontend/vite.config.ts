import { defineConfig, type UserConfig, type ConfigEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { visualizer } from 'rollup-plugin-visualizer'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'

export default defineConfig((configEnv: ConfigEnv): UserConfig => {
  const { mode } = configEnv;
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
        filename: 'dist/stats.html',
      }),
    ].filter(Boolean),

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    build: {
      minify: isProd ? 'esbuild' : false,
      target: 'es2020',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 500,
      outDir: 'dist', // Vercel default

      rollupOptions: {
        output: {
          manualChunks: (id) => {
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
      ],
      exclude: [
        'fuse.js',
        'recharts',
        'shiki',
      ],
      force: isDev,
    },

    esbuild: {
      jsx: 'automatic',
      drop: isProd ? ['console', 'debugger'] : [],
      target: 'es2020',
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
    },
  };
})