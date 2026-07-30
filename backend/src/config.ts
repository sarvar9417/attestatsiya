import 'dotenv/config'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`❌ ${name} environment variable is required`)
  }
  return value
}

export const config = {
  supabase: {
    url: requireEnv('SUPABASE_URL'),
    serviceKey: requireEnv('SUPABASE_SERVICE_KEY'),
  },
  server: {
    port: Number(process.env.PORT) || 3001,
    host: process.env.HOST || '0.0.0.0',
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  rateLimit: {
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
  },
} as const
