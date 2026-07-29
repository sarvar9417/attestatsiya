/* eslint-env node */
// Vercel serverless function — Anthropic API proxisi
// Browser hech qachon API kalitni ko'rmaydi

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Serverless function — ANTHROPIC_API_KEY (VITE_ prefiksiz, chunki bu client-side emas)
  // Vercel dashboard'da: ANTHROPIC_API_KEY = sk-ant-...
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
    return res.status(500).json({ error: 'Anthropic API kaliti sozlanmagan. Serverda ANTHROPIC_API_KEY ni belgilang.' })
  }

  const model = process.env.CLAUDE_MODEL || process.env.VITE_CLAUDE_MODEL || 'claude-sonnet-4-5'

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({ model, ...body }),
    })

    if (!body.stream) {
      const data = await anthropicRes.json()
      return res.status(anthropicRes.status).json(data)
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    })

    const reader = anthropicRes.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      res.write(decoder.decode(value))
    }

    res.end()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
}
