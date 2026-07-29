/* eslint-env node */
// Vercel serverless function — OpenAI TTS (Text-to-Speech) proxisi
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

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const { input, voice = 'alloy', speed = 1.0 } = body

    if (!input || typeof input !== 'string' || input.trim().length === 0) {
      return res.status(400).json({ error: 'input matni kerak' })
    }

    if (input.length > 4096) {
      return res.status(400).json({ error: 'input juda uzun (maks 4096 belgi)' })
    }

    const openaiRes = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
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
      console.error('OpenAI TTS error:', openaiRes.status, errText)
      return res.status(openaiRes.status).json({
        error: `OpenAI TTS xatosi (${openaiRes.status}): ${errText.slice(0, 200)}`,
      })
    }

    // Stream MP3 audio back to client
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Cache-Control', 'public, max-age=86400')
    res.status(200)

    const reader = openaiRes.body.getReader()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      res.write(Buffer.from(value))
    }
    res.end()
  } catch (err) {
    console.error('TTS proxy error:', err)
    res.status(500).json({ error: err.message || 'TTS server xatosi' })
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
}
