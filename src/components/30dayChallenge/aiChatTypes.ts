// ── Shared types for AI Conversation sub-components ─────────────────────────

export interface ChatMsg {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export type ConversationMode = 'free' | 'roleplay'
