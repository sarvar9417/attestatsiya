import { buildSystemPrompt, type TutorMode } from './prompts'
import { monitoring } from './monitoring'
import { AppError, ERROR_CODES, USER_MESSAGES } from './errors'

export const MODEL = (import.meta.env.VITE_CLAUDE_MODEL as string | undefined) ?? 'claude-sonnet-4-5'
const PROXY_URL = '/api/claude'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function proxyFetch(body: Record<string, unknown>): Promise<Response> {
  let res: Response
  try {
    res = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new AppError(ERROR_CODES.NETWORK_ERROR, USER_MESSAGES.NETWORK_ERROR, 'error')
  }
  if (!res.ok) {
    throw new AppError(ERROR_CODES.AI_UNAVAILABLE, USER_MESSAGES.AI_UNAVAILABLE, 'error')
  }
  return res
}

export async function streamResponse(
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
        system: params.system,
        messages: params.messages,
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
          if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
            full += parsed.delta.text
            onDelta(parsed.delta.text)
          }
        } catch (err) {
          monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'streamResponse:parseLine' })
        }
      }
    }

    onDone(full)
  } catch (err) {
    onError(err as Error)
  }
}

export async function sendMessage(
  messages: ChatMessage[],
  mode: TutorMode = 'general'
): Promise<string> {
  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 1024,
    system: buildSystemPrompt(mode),
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    stream: false,
  })
  const data = await res.json()
  const block = data.content?.[0]
  return block?.type === 'text' ? block.text : ''
}

export async function sendMessageStream(
  messages: ChatMessage[],
  mode: TutorMode = 'general',
  onDelta: (token: string) => void,
  onDone: (fullText: string) => void,
  onError: (err: Error) => void,
  signal?: AbortSignal
): Promise<void> {
  return streamResponse(
    { system: buildSystemPrompt(mode), messages: messages.map((m) => ({ role: m.role, content: m.content })), maxTokens: 1024 },
    onDelta, onDone, onError, signal
  )
}
