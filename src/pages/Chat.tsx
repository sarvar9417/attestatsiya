import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import {
  Send, Bot, User, Trash2,
  Zap, AlertCircle, ChevronDown,
  Copy, Check, RefreshCw,
} from 'lucide-react'
import { sendMessageStream, type ChatMessage, MODEL } from '../lib/claude'
import { AiLoadingOverlay } from '../components/ui/AiLoadingOverlay'
import { QUICK_PROMPTS, type TutorMode } from '../lib/prompts'
import { useNavigationGuard } from '../hooks/useNavigationGuard'
import { useI18n } from '../i18n'
import { useStore } from '../store/useStore'
import { addSession } from '../db/database'
import { getTodayTashkent } from '../utils/tashkentDate'
import { monitoring } from '../lib/monitoring'
import { sanitizeHtml } from '../lib/sanitizeHtml'

// ─── Types ────────────────────────────────────────────────────────────────────

interface UIMessage extends ChatMessage {
  id: number
  timestamp: Date
  isStreaming?: boolean
  error?: boolean
}

// ─── Markdown renderer (headings, bold, code, links, lists) ───────────────────

function renderContent(text: string) {
  const lines = text.split('\n')
  const elements: JSX.Element[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trimStart()

    // ── Headings ──
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const text = headingMatch[2]
      const Tag = level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3'
      const size = level === 1 ? 'text-lg font-bold' : level === 2 ? 'text-base font-bold' : 'text-sm font-semibold'
      elements.push(
        <Tag key={i} className={`${size} text-gray-900 dark:text-gray-100 mt-3 mb-1`}>
          {renderInline(text)}
        </Tag>
      )
      continue
    }

    // ── Horizontal rule ──
    if (/^---\s*$/.test(trimmed)) {
      elements.push(<hr key={i} className="my-3 border-gray-200 dark:border-gray-700" />)
      continue
    }

    // ── Unordered list ──
    const ulMatch = trimmed.match(/^[-*]\s+(.+)/)
    if (ulMatch) {
      elements.push(
        <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
          <span className="text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0">•</span>
          <span>{renderInline(ulMatch[1])}</span>
        </li>
      )
      continue
    }

    // ── Ordered list ──
    const olMatch = trimmed.match(/^(\d+)[.)]\s+(.+)/)
    if (olMatch) {
      elements.push(
        <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
          <span className="text-gray-400 dark:text-gray-500 font-mono text-xs mt-0.5 flex-shrink-0 w-4 text-right">{olMatch[1]}.</span>
          <span>{renderInline(olMatch[2])}</span>
        </li>
      )
      continue
    }

    // ── Empty line — close lists ──
    if (trimmed === '') {
      elements.push(<div key={i} className="h-2" />)
      continue
    }

    // ── Regular paragraph ──
    elements.push(
      <p key={i} className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 my-0.5">
        {renderInline(line)}
      </p>
    )
  }

  return elements
}

function renderInline(text: string) {
  const parts: (string | JSX.Element)[] = []
  let remaining = text
  let keyIdx = 0

  // Bold **text**
  remaining = remaining.replace(/\*\*(.+?)\*\*/g, (_, inner) => `‹b›${inner}‹/b›`)
  // Inline code `code`
  remaining = remaining.replace(/`([^`]+)`/g, (_, inner) => `‹code›${inner}‹/code›`)
  // Links [text](url)
  remaining = remaining.replace(/\[(.+?)\]\((.+?)\)/g, (_, t, u) => `‹a›${t}‹│›${u}‹/a›`)

  const segments = remaining.split(/(‹b›.+?‹\/b›|‹code›.+?‹\/code›|‹a›.+?‹\/a›)/g)
  for (const seg of segments) {
    if (seg.startsWith('‹b›') && seg.endsWith('‹/b›')) {
      parts.push(<strong key={keyIdx++} className="font-semibold">{seg.slice(3, -4)}</strong>)
    } else if (seg.startsWith('‹code›') && seg.endsWith('‹/code›')) {
      parts.push(
        <code key={keyIdx++}
          className="bg-gray-100 dark:bg-gray-800 text-primary-700 dark:text-primary-400 px-1.5 py-0.5 rounded text-xs font-mono">
          {seg.slice(6, -7)}
        </code>
      )
    } else if (seg.startsWith('‹a›') && seg.endsWith('‹/a›')) {
      const inner = seg.slice(3, -4)
      const pipeIdx = inner.indexOf('‹│›')
      const linkText = inner.slice(0, pipeIdx)
      const linkUrl = inner.slice(pipeIdx + 3)
      parts.push(
        <a key={keyIdx++} href={linkUrl} target="_blank" rel="noopener noreferrer"
          className="text-primary-600 dark:text-primary-400 underline hover:no-underline">
          {linkText}
        </a>
      )
    } else {
      parts.push(seg)
    }
  }

  return parts.length > 0 ? parts : text
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg, onRegenerate }: {
  msg: UIMessage
  onRegenerate?: () => void
}) {
  const { t } = useI18n()
  const isUser = msg.role === 'user'
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} group`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
        ${isUser
          ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
          : 'bg-b2-100 dark:bg-b2-900/50 text-b2-700 dark:text-b2-300'
        }`}>
        {isUser ? <User size={15} /> : <Bot size={15} />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[78%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed relative
          ${isUser
            ? 'bg-primary-600 dark:bg-primary-700 text-white rounded-tr-sm'
            : msg.error
              ? 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-tl-sm'
              : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-sm shadow-sm'
          }`}
        >
          {msg.error && <AlertCircle size={14} className="inline mr-1.5 mb-0.5" />}
          {isUser
            ? msg.content
            : renderContent(msg.content)
          }
          {msg.isStreaming && (
            <span className="inline-block w-1 h-4 bg-b2-500 ml-0.5 rounded-sm animate-pulse" />
          )}

          {/* Action buttons — only on assistant messages, not streaming, not error */}
          {!isUser && !msg.isStreaming && !msg.error && (
            <div className="absolute -bottom-4 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                aria-label={t('chat.copyLabel')}
                className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all shadow-sm"
                title={t('chat.copyLabel')}
              >
                {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
              </button>
              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  aria-label={t('chat.regenerateLabel')}
                  className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all shadow-sm"
                  title={t('chat.regenerateLabel')}
                >
                  <RefreshCw size={12} />
                </button>
              )}
            </div>
          )}
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-600 px-1">
          {msg.timestamp.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
}

// ─── Mode Selector ────────────────────────────────────────────────────────────

const MODE_IDS: { id: TutorMode; color: string }[] = [
  { id: 'general',          color: 'text-primary-600' },
  { id: 'grammar-check',    color: 'text-orange-600'  },
  { id: 'vocabulary',       color: 'text-b1-600'      },
  { id: 'writing-feedback', color: 'text-b2-600'      },
  { id: 'lesson-explain',   color: 'text-indigo-600'  },
]

// ─── API Key Banner ───────────────────────────────────────────────────────────

function ApiKeyBanner() {
  const { t } = useI18n()
  return (
    <div className="mx-3 sm:mx-4 my-3 p-3 sm:p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-sm">
      <p className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2">
        <AlertCircle size={16} /> {t('chat.apiKeyTitle')}
      </p>
      <p className="text-amber-700 dark:text-amber-400 mt-1 text-xs" dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('chat.apiKeyDesc')) }} />
      <a
        href="https://console.anthropic.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-2 text-xs text-amber-900 dark:text-amber-300 underline"
      >
        {t('chat.apiKeyLink')}
      </a>
    </div>
  )
}

// ─── Main Chat ────────────────────────────────────────────────────────────────

const INITIAL_MESSAGE: UIMessage = {
  id: 0,
  role: 'assistant',
  content: `Hello! I'm your **EnglishPath AI Tutor** powered by ${MODEL}. 🎓

I can help you with:
① **Grammar** — I'll correct your mistakes and explain the rules
② **Vocabulary** — deep explanations with examples and collocations
③ **Writing** — detailed feedback and scoring
④ **Free conversation** — practice real-life English

What would you like to work on today?`,
  timestamp: new Date(),
}

const API_KEY_MISSING =
  !import.meta.env.VITE_ANTHROPIC_API_KEY ||
  import.meta.env.VITE_ANTHROPIC_API_KEY === 'your_key_here'

export default function Chat() {
  const [messages, setMessages] = useState<UIMessage[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<TutorMode>('general')
  const [isStreaming, setIsStreaming] = useState(false)
  const [showModes, setShowModes] = useState(false)
  const [sessionStart] = useState(Date.now())
  const { t } = useI18n()

  useNavigationGuard(input.trim().length > 0)

  const bottomRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { addXP, incrementStreak, updateSkillProgress, todayGrammarPct } = useStore()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`
  }, [input])

  // Save session on unmount
  useEffect(() => {
    return () => {
      const mins = Math.round((Date.now() - sessionStart) / 60000)
      if (mins < 1) return
      addSession({
        date: getTodayTashkent(),
        type: 'ai-chat',
        durationMinutes: mins,
        xpEarned: mins * 5,
        createdAt: Date.now(),
      }).catch((e) => monitoring.captureException(e instanceof Error ? e : new Error(String(e)), { context: 'addSession' }))
    }
  }, [sessionStart])

  const send = useCallback(async (overrideText?: string) => {
    const text = (overrideText ?? input).trim()
    if (!text || isStreaming) return
    if (!overrideText) setInput('')

    const userMsg: UIMessage = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    const assistantId = Date.now() + 1
    const assistantMsg: UIMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setIsStreaming(true)

    const controller = new AbortController()
    abortRef.current = controller

    // Build history for API (skip the initial greeting)
    const history: ChatMessage[] = messages
      .slice(1)
      .concat(userMsg)
      .map(({ role, content }) => ({ role, content }))

    await sendMessageStream(
      history,
      mode,
      (token) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: m.content + token }
              : m
          )
        )
      },
      (_full) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, isStreaming: false } : m
          )
        )
        setIsStreaming(false)
        addXP(10)
        incrementStreak()
        if (mode === 'grammar-check') {
          updateSkillProgress('todayGrammarPct', Math.min(100, todayGrammarPct + 10))
        } else if (mode === 'writing-feedback') {
          updateSkillProgress('todayWritingPct', Math.min(100, useStore.getState().todayWritingPct + 10))
        }
      },
      (err) => {
        if (err.name === 'AbortError') {
          setMessages((prev) => prev.filter((m) => m.id !== assistantId))
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: err.message, isStreaming: false, error: true }
                : m
            )
          )
        }
        setIsStreaming(false)
      },
      controller.signal
    )

    if (abortRef.current === controller) abortRef.current = null
  }, [input, isStreaming, messages, mode, addXP, incrementStreak, updateSkillProgress, todayGrammarPct])

  const handleCancel = () => {
    abortRef.current?.abort()
    abortRef.current = null
  }

  const clearChat = () => {
    setMessages([INITIAL_MESSAGE])
  }

  const MODES = useMemo(() => MODE_IDS.map((m) => ({
    ...m,
    label: m.id === 'general' ? t('chat.modeFreeTalk') :
           m.id === 'grammar-check' ? t('chat.modeGrammar') :
           m.id === 'vocabulary' ? t('chat.modeVocab') :
           m.id === 'writing-feedback' ? t('chat.modeWriting') :
           t('chat.modeLesson'),
  })), [t])

  const currentMode = MODES.find((m) => m.id === mode) ?? MODES[0]

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-3.5
        border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-b2-500 to-primary-600
            rounded-xl flex items-center justify-center shadow-sm">
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">{t('chat.title')}</p>
            <p className="text-xs text-green-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
              {MODEL}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Mode pill */}
          <div className="relative">
            <button
              onClick={() => setShowModes((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs font-semibold
                ${currentMode.color}`}
            >
              {currentMode.label}
              <ChevronDown size={12} />
            </button>
            {showModes && (
              <div className="absolute right-0 top-9 z-20 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700
                rounded-xl shadow-lg py-1 min-w-[160px]">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setMode(m.id); setShowModes(false) }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700
                      transition-colors ${m.color} ${mode === m.id ? 'bg-gray-50 dark:bg-gray-700' : ''}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={clearChat}
            aria-label={t('chat.clearChatLabel')}
            className="p-2 rounded-xl text-gray-400 hover:text-red-500
              hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            title={t('chat.clearChatLabel')}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* ── API key warning ── */}
      {API_KEY_MISSING && <ApiKeyBanner />}

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-3 sm:py-5 space-y-5 scrollbar-hide mobile-safe-bottom">
        {messages.map((msg, idx) => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            onRegenerate={idx > 0 && !isStreaming
              ? () => {
                  // Find the last user message before this assistant message
                  for (let i = idx - 1; i >= 0; i--) {
                    if (messages[i].role === 'user' && !messages[i].error) {
                      // Remove this assistant message and regenerate its response
                      setMessages((prev) => prev.slice(0, idx))
                      send(messages[i].content)
                      break
                    }
                  }
                }
              : undefined
            }
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ── Quick prompts ── */}
      <div className="flex gap-2 px-3 sm:px-5 pb-2 overflow-x-auto scrollbar-hide flex-shrink-0">
        {QUICK_PROMPTS.map((qp) => (
          <button
            key={qp.label}
            disabled={isStreaming}
            onClick={() => {
              setMode(qp.mode)
              setInput(qp.text)
              textareaRef.current?.focus()
            }}
            className="flex-shrink-0 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
              rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400
              hover:border-primary-400 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-950/30 dark:hover:text-primary-400
              transition-all disabled:opacity-40"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* ── Input ── */}
      <div className="px-3 sm:px-5 pb-5 flex-shrink-0">
        <div className="flex gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
          rounded-2xl shadow-sm focus-within:border-primary-400 dark:focus-within:border-primary-500
          focus-within:ring-2 focus-within:ring-primary-100 dark:focus-within:ring-primary-900/30 transition-all p-3">
          <textarea
            ref={textareaRef}
            aria-label={t('chat.inputAria')}
            className="flex-1 resize-none outline-none text-sm text-gray-800 dark:text-gray-200
              placeholder-gray-400 dark:placeholder-gray-500 bg-transparent leading-relaxed min-h-[40px] max-h-[160px]"
            placeholder={
              API_KEY_MISSING
                ? t('chat.placeholderApiKey')
                : mode === 'grammar-check'
                  ? t('chat.placeholderGrammar')
                  : mode === 'writing-feedback'
                    ? t('chat.placeholderWriting')
                    : mode === 'vocabulary'
                      ? t('chat.placeholderVocab')
                      : t('chat.placeholderGeneral')
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            disabled={isStreaming || API_KEY_MISSING}
            rows={1}
          />
          <div className="flex flex-col items-end justify-between gap-1">              <span className="text-xs text-gray-300 dark:text-gray-600 font-mono">
              {input.length > 0 ? `${input.length}` : ''}
            </span>
            <button
              onClick={() => send()}
              disabled={isStreaming || !input.trim() || API_KEY_MISSING}
              aria-label={t('chat.sendAria')}
              className="w-9 h-9 bg-primary-600 hover:bg-primary-700
                rounded-xl flex items-center justify-center text-white
                transition-all hover:scale-105 active:scale-95
                disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100
                shadow-sm"
            >
              {isStreaming
                ? <Zap size={16} className="animate-pulse" />
                : <Send size={16} />
              }
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-600 text-center mt-1.5">
          {t('chat.footerHint')}
        </p>
      </div>

      {isStreaming && <AiLoadingOverlay onCancel={handleCancel} />}
    </div>
  )
}
