import { useState, useCallback, useEffect } from 'react'

// ── Types ───────────────────────────────────────────────────────────────────

export interface UserFact {
  id: string
  key: string
  value: string
  learnedFrom: string  // session context
  createdAt: string    // ISO date
}

interface LifeMemoryStore {
  facts: UserFact[]
}

// ── Key ─────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'life_memory_facts'

function loadStore(): LifeMemoryStore {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return { facts: [] }
}

function saveStore(store: LifeMemoryStore) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)) } catch {}
}

let idCounter = Date.now()
function genId() {
  idCounter += 1
  return `fact-${idCounter}`
}

// ── Hook ────────────────────────────────────────────────────────────────────

export function useLifeMemory() {
  const [store, setStore] = useState<LifeMemoryStore>(loadStore)

  // Persist
  useEffect(() => {
    saveStore(store)
  }, [store])

  /** Add a new fact (dedup by key) */
  const addFact = useCallback((key: string, value: string, learnedFrom: string) => {
    setStore(prev => {
      const existing = prev.facts.find(f => f.key.toLowerCase() === key.toLowerCase())
      if (existing) {
        // Update existing fact
        return {
          facts: prev.facts.map(f =>
            f.id === existing.id
              ? { ...f, value, learnedFrom, createdAt: new Date().toISOString() }
              : f
          ),
        }
      }
      // New fact
      return {
        facts: [
          ...prev.facts,
          { id: genId(), key, value, learnedFrom, createdAt: new Date().toISOString() },
        ],
      }
    })
  }, [])

  /** Delete a fact by id */
  const deleteFact = useCallback((id: string) => {
    setStore(prev => ({
      facts: prev.facts.filter(f => f.id !== id),
    }))
  }, [])

  /** Clear all facts */
  const clearFacts = useCallback(() => {
    setStore({ facts: [] })
  }, [])

  /** Extract facts from user messages using simple heuristics */
  const extractFactsFromMessages = useCallback((
    messages: string[],
    _context: string,
  ): Array<{ key: string; value: string }> => {
    const extracted: Array<{ key: string; value: string }> = []
    const lowerMsgs = messages.map(m => m.toLowerCase())

    for (const msg of lowerMsgs) {
      // "I have a [noun]" / "I've got a [noun]"
      let match = msg.match(/i'?ve?\s*got?\s+(?:a|an)?\s*(\w+(?:\s+\w+){0,2})/i)
      if (match && match[1] && match[1].length > 2) {
        extracted.push({ key: 'has', value: match[1] })
      }

      // "I live in [place]"
      match = msg.match(/i\s+live\s+in\s+(\w+(?:\s+\w+){0,2})/i)
      if (match && match[1] && match[1].length > 2) {
        extracted.push({ key: 'lives in', value: match[1] })
      }

      // "I work as/is a [profession]"
      match = msg.match(/i\s+(?:work\s+as|am\s+a|'?m\s+a)\s+(\w+(?:\s+\w+){0,2})/i)
      if (match && match[1] && match[1].length > 2) {
        extracted.push({ key: 'occupation', value: match[1] })
      }

      // "I want to [verb]"
      match = msg.match(/i\s+want\s+to\s+(\w+(?:\s+\w+){0,2})/i)
      if (match && match[1] && match[1].length > 2) {
        extracted.push({ key: 'wants to', value: match[1] })
      }

      // "I'm from [place]"
      match = msg.match(/i'?m\s+from\s+(\w+(?:\s+\w+){0,2})/i)
      if (match && match[1] && match[1].length > 2) {
        extracted.push({ key: 'from', value: match[1] })
      }

      // "I study [subject]"
      match = msg.match(/i\s+study\s+(\w+(?:\s+\w+){0,2})/i)
      if (match && match[1] && match[1].length > 2) {
        extracted.push({ key: 'studies', value: match[1] })
      }

      // "I like/enjoy/love [activity]"
      match = msg.match(/i\s+(?:like|enjoy|love)\s+(\w+(?:\s+\w+){0,2})/i)
      if (match && match[1] && match[1].length > 2) {
        extracted.push({ key: 'likes', value: match[1] })
      }

      // "I've visited [place]" / "I have been to [place]"
      match = msg.match(/i'?ve\s+(?:visited|been\s+to)\s+(\w+(?:\s+\w+){0,2})/i)
      if (match && match[1] && match[1].length > 2) {
        extracted.push({ key: 'visited', value: match[1] })
      }
    }

    // Dedup by key
    const seen = new Set<string>()
    return extracted.filter(f => {
      const key = f.key.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [])

  /** Build facts text for AI system prompt */
  const buildFactsText = useCallback((): string => {
    if (store.facts.length === 0) return ''
    return store.facts
      .map(f => `- ${f.key}: ${f.value}`)
      .join('\n')
  }, [store.facts])

  return {
    facts: store.facts,
    factCount: store.facts.length,
    addFact,
    deleteFact,
    clearFacts,
    extractFactsFromMessages,
    buildFactsText,
  }
}
