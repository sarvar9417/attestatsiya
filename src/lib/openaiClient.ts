import { monitoring } from './monitoring'
import { AppError, ERROR_CODES, USER_MESSAGES } from './errors'

const MODEL = 'gpt-4o'
const PROXY_URL = '/api/openai'

export async function openaiStreamResponse(
  params: { system: string; messages: { role: string; content: string }[]; maxTokens: number },
  onDelta: (token: string) => void,
  onDone: (full: string) => void,
  onError: (err: Error) => void,
  signal?: AbortSignal
): Promise<void> {
  try {
    const res = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: params.maxTokens,
        messages: [
          { role: 'system', content: params.system },
          ...params.messages,
        ],
        stream: true,
      }),
      signal,
    })

    if (!res.ok) {
      throw new AppError(ERROR_CODES.AI_UNAVAILABLE, USER_MESSAGES.AI_UNAVAILABLE, 'error')
    }

    let full = ''
    const reader = res.body?.getReader()
    if (!reader) { onDone(''); return }

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      if (signal?.aborted) { reader.cancel(); break }
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const data = line.slice(6).trim()
        if (!data || data === '[DONE]') continue
        try {
          const parsed = JSON.parse(data)
          const content = parsed.choices?.[0]?.delta?.content
          if (content) {
            full += content
            onDelta(content)
          }
        } catch (err) {
          monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'openaiStreamResponse:parseLine' })
        }
      }
    }

    onDone(full)
  } catch (err) {
    onError(err as Error)
  }
}