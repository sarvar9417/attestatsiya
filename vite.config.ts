import { defineConfig } from 'vitest/config'
import type { ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import type { IncomingMessage, ServerResponse } from 'http'
import 'dotenv/config'
import viteCompression from 'vite-plugin-compression'
import { VitePWA } from 'vite-plugin-pwa'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY || ''
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''

// Vite dev serverda Anthropic API proxisi — API kalit serverda qoladi
function anthropicProxyPlugin() {
  return {
    name: 'anthropic-proxy',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/claude', async (req: IncomingMessage, res: ServerResponse, _next: Function) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY === 'your_anthropic_api_key_here') {
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Anthropic API kaliti sozlanmagan. .env faylida ANTHROPIC_API_KEY ni belgilang.' }))
          return
        }

        let body = ''
        req.on('data', (chunk: string) => { body += chunk })
        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body)
            const model = parsed.model || process.env.VITE_CLAUDE_MODEL || 'claude-sonnet-4-5'

            const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
              },
              body: JSON.stringify({ model, ...parsed }),
            })

            if (!parsed.stream) {
              const data = await anthropicRes.json()
              res.statusCode = anthropicRes.status
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(data))
              return
            }

            res.setHeader('Content-Type', 'text/event-stream')
            res.setHeader('Cache-Control', 'no-cache')
            res.setHeader('Connection', 'keep-alive')
            res.statusCode = 200

            if (!anthropicRes.body) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'No response body from Anthropic API' }))
              return
            }
            const reader = anthropicRes.body.getReader()
            const decoder = new TextDecoder()
            while (true) {
              const { done, value } = await reader.read()
              if (done) break
              res.write(decoder.decode(value))
            }
            res.end()
          } catch (err) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }))
          }
        })
      })
    },
  }
}

// Vite dev serverda OpenAI TTS proxisi (Text-to-Speech)
function openaiTtsProxyPlugin() {
  return {
    name: 'openai-tts-proxy',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/tts', async (req: IncomingMessage, res: ServerResponse, _next: Function) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'OpenAI API kaliti sozlanmagan. .env faylida OPENAI_API_KEY ni belgilang.' }))
          return
        }

        let body = ''
        req.on('data', (chunk: string) => { body += chunk })
        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body)
            const { input, voice = 'alloy', speed = 1.0 } = parsed

            if (!input || typeof input !== 'string' || input.trim().length === 0) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'input matni kerak' }))
              return
            }

            if (input.length > 4096) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'input juda uzun (maks 4096 belgi)' }))
              return
            }

            const openaiRes = await fetch('https://api.openai.com/v1/audio/speech', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
              },
              body: JSON.stringify({
                model: 'tts-1',
                input: input.trim(),
                voice,
                speed: Math.max(0.25, Math.min(4.0, speed)),
                response_format: 'mp3',
              }),
            })

            if (!openaiRes.ok) {
              const errText = await openaiRes.text()
              res.statusCode = openaiRes.status
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: `OpenAI TTS xatosi (${openaiRes.status}): ${errText.slice(0, 200)}` }))
              return
            }

            // Stream MP3 audio back
            res.setHeader('Content-Type', 'audio/mpeg')
            res.setHeader('Cache-Control', 'public, max-age=86400')
            res.statusCode = 200

            if (!openaiRes.body) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'No response body from OpenAI TTS API' }))
              return
            }
            const reader = openaiRes.body.getReader()
            while (true) {
              const { done, value } = await reader.read()
              if (done) break
              res.write(Buffer.from(value))
            }
            res.end()
          } catch (err) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }))
          }
        })
      })
    },
  }
}

// Vite dev serverda OpenAI API proxisi
function openaiProxyPlugin() {
  return {
    name: 'openai-proxy',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/openai', async (req: IncomingMessage, res: ServerResponse, _next: Function) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'OpenAI API kaliti sozlanmagan. .env faylida OPENAI_API_KEY ni belgilang.' }))
          return
        }

        let body = ''
        req.on('data', (chunk: string) => { body += chunk })
        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body)
            const model = parsed.model || 'gpt-4o'

            const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
              },
              body: JSON.stringify({ model, ...parsed }),
            })

            if (!parsed.stream) {
              const data = await openaiRes.json()
              res.statusCode = openaiRes.status
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(data))
              return
            }

            res.setHeader('Content-Type', 'text/event-stream')
            res.setHeader('Cache-Control', 'no-cache')
            res.setHeader('Connection', 'keep-alive')
            res.statusCode = 200

            if (!openaiRes.body) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'No response body from OpenAI API' }))
              return
            }
            const reader = openaiRes.body.getReader()
            const decoder = new TextDecoder()
            while (true) {
              const { done, value } = await reader.read()
              if (done) break
              res.write(decoder.decode(value))
            }
            res.end()
          } catch (err) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }))
          }
        })
      })
    },
  }
}

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    anthropicProxyPlugin(),
    openaiTtsProxyPlugin(),
    openaiProxyPlugin(),
    // Compression va PWA faqat production build'da — dev'da keraksiz yuk
    ...(command === 'build' ? [
      viteCompression({ algorithm: 'gzip', threshold: 10240 }),
      VitePWA({
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'sw.ts',
        registerType: 'autoUpdate',
        includeAssets: [
          'favicon.svg',
          'icon-192.png',
          'icon-512.png',
          'icon-maskable-512.png',
          'apple-touch-icon.png',
        ],
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,gif,webp,woff2,ttf,eot,ico}'],
        },
      }),
    ] : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
    watch: {
      ignored: ['**/node_modules/**', '**/src/data/**', '**/*.test.*', '**/__tests__/**'],
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      'recharts',
      'zustand',
      '@supabase/supabase-js',
      'dexie',
    ],
  },
  build: {
    outDir: 'dist',
    // Enable hidden sourcemaps in production for Sentry error tracking.
    // The .map files stay in dist/ but are NOT served to browsers.
    // Upload to Sentry: npx sentry-cli sourcemaps inject ./dist && npx sentry-cli sourcemaps upload --release=<release> ./dist
    sourcemap: true,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        sourcemapIgnoreList: (relativeSourcePath: string) => relativeSourcePath.includes('node_modules'),
        manualChunks(id: string) {
          // Vendor chunks (node_modules) — single vendor chunk to avoid circular deps
          if (id.includes('node_modules')) {
            if (id.includes('recharts')) return 'charts'
            if (id.includes('dexie'))   return 'db'
            if (id.includes('lucide-react')) return 'icons'
            return 'vendor'
          }

          // Lesson data chunks (lazy loaded via loadAllLessons)
          if (id.includes('/src/data/dailyLessons') ||
              id.includes('/src/data/tenses/') ||
              id.includes('/src/data/daily/lessonsA2') ||
              id.includes('/src/data/daily/a2Part')) {
            return 'lessons-a1-a2'
          }
          if (id.includes('/src/data/daily/lessonsB1') ||
              id.includes('/src/data/daily/b1Part1') ||
              id.includes('/src/data/b1DailyLessons')) {
            return 'lessons-b1'
          }
          if (id.includes('/src/data/daily/lessonsB1plus') ||
              id.includes('/src/data/daily/b1plusPart') ||
              id.includes('/src/data/b1plusDailyLessons')) {
            return 'lessons-b1plus'
          }
          if (id.includes('/src/data/daily/lessonsB2') ||
              id.includes('/src/data/daily/b2Part') ||
              id.includes('/src/data/b2DailyLessons')) {
            return 'lessons-b2'
          }
          if (id.includes('/src/data/daily/reviewLessons')) {
            return 'lessons-reviews'
          }
          if (id.includes('/src/data/lessonSkillsContent') ||
              id.includes('/src/data/listeningLessons')) {
            return 'lessons-skills'
          }
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    env: {
      VITE_SUPABASE_URL: 'http://localhost:54321',
      VITE_SUPABASE_ANON_KEY: 'test-anon-key',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        lines: 30,
        functions: 30,
        branches: 30,
      },
      include: ['src/services/**', 'src/store/**', 'src/lib/**'],
      exclude: ['src/data/**', 'src/**/*.test.ts', 'src/lib/monitoring.ts'],
    },
  },
}))
