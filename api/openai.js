/* eslint-env node */
// Vercel serverless function — OpenAI API proxisi
// Browser hech qachon API kalitni ko'rmaydi

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    return res.status(500).json({ error: 'OpenAI API kaliti sozlanmagan. Serverda OPENAI_API_KEY ni belgilang.' })
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o'

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, ...body }),
    })

    if (!body.stream) {
      const data = await openaiRes.json()
      return res.status(openaiRes.status).json(data)
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    })

    const reader = openaiRes.body.getReader()
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
