import { useState, useMemo } from 'react'
import { GRAMMAR_TOPICS } from '../../data/grammar'
import type { GrammarTopic } from '../../data/grammar'
import { GRAMMAR_COLORS } from '../../lib/grammarColors'
import { ChevronRight, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'

// ─── Constants ──────────────────────────────────────────────────────────────

const LEVEL_CFG = {
  A2:  { x: 160, color: '#22c55e', bg: 'rgba(34,197,94,0.05)', label: 'A2 · Boshlang\'ich', emoji: '🌱' },
  B1:  { x: 390, color: '#3b82f6', bg: 'rgba(59,130,246,0.05)', label: 'B1 · O\'rta',         emoji: '🌿' },
  'B1+': { x: 620, color: '#a855f7', bg: 'rgba(168,85,247,0.05)', label: 'B1+ · Yuqori O\'rta', emoji: '🌳' },
  B2:  { x: 850, color: '#f59e0b', bg: 'rgba(245,158,11,0.05)', label: 'B2 · Yuqori',        emoji: '🔥' },
} as const

const TAG_TO_CATEGORY: Record<string, keyof typeof GRAMMAR_COLORS> = {
  Conditionals: 'conditionals',
  Tenses:       'tenses',
  Passive:      'passives',
  Grammar:      'other',
  Modals:       'modals',
  Comparatives: 'other',
  Vocabulary:   'vocabulary',
  Prepositions: 'prepositions',
  Articles:     'articles',
  Reported:     'reported',
  Phrasal:      'phrasal',
}

// ─── Connections: related topics across levels ──────────────────────────────

const CONNECTIONS: [string, string][] = [
  // Conditionals chain
  ['first-conditional',         'first-conditional-full'],
  ['first-conditional-full',    'second-conditional'],
  ['second-conditional',        'third-conditional'],
  ['third-conditional',         'mixed-conditionals'],
  // Passive chain
  ['passive-voice-a2',          'passive-voice'],
  ['passive-voice',             'advanced-passive'],
  // Present Perfect chain
  ['present-perfect-a2',        'present-perfect'],
  // Reported Speech chain
  ['reported-speech',           'reported-speech-b2'],
  // Relative Clauses chain
  ['relative-clauses',          'relative-clauses-b2'],
  // Modals chain
  ['modal-verbs-a2',            'advanced-modals'],
  // Wish / If Only chain
  ['wish-if-only',              'wish-if-only-b2'],
  // Cross connections
  ['present-perfect',           'reported-speech'],
  ['passive-voice',             'advanced-passive'],
  ['second-conditional',        'wish-if-only'],
  ['gerunds-infinitives',       'advanced-modals'],
]

// ─── Layout calculator ─────────────────────────────────────────────────────

interface NodePos {
  topic: GrammarTopic
  x: number
  y: number
  level: 'A2' | 'B1' | 'B1+' | 'B2'
  tagColor: string
  category: keyof typeof GRAMMAR_COLORS
  strength: number  // 0–100: how well the user knows this topic
}

function computeLayout(progress: Record<string, number>): { nodes: NodePos[]; connections: { from: NodePos; to: NodePos }[] } {
  const Y_START = 80
  const Y_END = 540
  const Y_RANGE = Y_END - Y_START

  const levelTopics: Record<string, GrammarTopic[]> = { A2: [], B1: [], 'B1+': [], B2: [] }
  for (const t of GRAMMAR_TOPICS) {
    if (levelTopics[t.level]) levelTopics[t.level].push(t)
  }

  const nodes: NodePos[] = []

  for (const level of ['A2', 'B1', 'B1+', 'B2'] as const) {
    const topics = levelTopics[level]
    const cfg = LEVEL_CFG[level]
    const count = topics.length
    const spacing = count > 1 ? Y_RANGE / (count - 1) : 0
    const startY = count > 1 ? Y_START : (Y_START + Y_END) / 2

    topics.forEach((topic, i) => {
      const category = TAG_TO_CATEGORY[topic.tag] ?? 'other'
      nodes.push({
        topic,
        x: cfg.x,
        y: startY + i * spacing,
        level,
        tagColor: GRAMMAR_COLORS[category]?.text ?? '#78716c',
        category,
        strength: progress[topic.id] ?? 0,
      })
    })
  }

  const nodeMap = new Map(nodes.map(n => [n.topic.id, n]))
  const connections: { from: NodePos; to: NodePos }[] = []

  for (const [fromId, toId] of CONNECTIONS) {
    const from = nodeMap.get(fromId)
    const to = nodeMap.get(toId)
    if (from && to) connections.push({ from, to })
  }

  return { nodes, connections }
}

// ─── SVG path helpers ──────────────────────────────────────────────────────

function connectionPath(
  from: { x: number; y: number },
  to: { x: number; y: number },
): string {
  const dx = to.x - from.x
  const cpLen = Math.abs(dx) * 0.4
  const cp1x = from.x + cpLen
  const cp2x = to.x - cpLen
  return `M ${from.x} ${from.y} C ${cp1x} ${from.y}, ${cp2x} ${to.y}, ${to.x} ${to.y}`
}

// ─── Tag icon mapping ─────────────────────────────────────────────────────

const TAG_ICONS: Record<string, string> = {
  Conditionals: '🎯',
  Tenses:       '🕐',
  Passive:      '🔄',
  Grammar:      '📐',
  Modals:       '⚡',
  Comparatives: '📊',
  Vocabulary:   '📝',
}

// ════════════════════════════════════════════════════════════════════════════
// Component
// ════════════════════════════════════════════════════════════════════════════

interface GrammarDNAMapProps {
  onTopicSelect?: (topic: GrammarTopic) => void
}

export function GrammarDNAMap({ onTopicSelect }: GrammarDNAMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)

  const layout = useMemo(() => computeLayout({}), [])
  const { nodes, connections } = layout

  const highlightId = hoveredId ?? selectedId

  // Find directly connected nodes for highlighting
  const connectedSet = useMemo(() => {
    const set = new Set<string>()
    if (!highlightId) return set
    set.add(highlightId)
    for (const conn of connections) {
      if (conn.from.topic.id === highlightId) set.add(conn.to.topic.id)
      if (conn.to.topic.id === highlightId) set.add(conn.from.topic.id)
    }
    return set
  }, [highlightId, connections])

  const dimOthers = highlightId !== null

  // ── Zoom controls ──────────────────────────────────────────────────────

  function handleWheel(e: React.WheelEvent) {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      setZoom(z => Math.max(0.5, Math.min(2, z - e.deltaY * 0.002)))
    }
  }

  // ── Sorted tags for legend ─────────────────────────────────────────────

  const uniqueTags = useMemo(() => {
    const tags = new Set(nodes.map(n => n.topic.tag))
    return Array.from(tags)
  }, [nodes])

  // ═══════════════════════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════════════════════

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-5 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/40 rounded-xl flex items-center justify-center">
            <span className="text-lg">🧬</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
              Grammar DNA — Bilimlar tarmog'i
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {nodes.length} ta mavzu · {connections.length} ta bog'lanish
            </p>
          </div>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom(z => Math.max(0.5, z - 0.15))}
            className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Kichraytirish"
          >
            <ZoomOut size={13} className="text-gray-500" />
          </button>
          <span className="text-xs text-gray-400 w-8 text-center font-mono">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(z => Math.min(2, z + 0.15))}
            className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Kattalashtirish"
          >
            <ZoomIn size={13} className="text-gray-500" />
          </button>
          <button
            onClick={() => {
              setZoom(1)
              setSelectedId(null)
              setHoveredId(null)
            }}
            className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ml-1"
            title="100% ga qaytarish"
          >
            <Maximize2 size={11} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* ── SVG Canvas ──────────────────────────────────────────────────── */}
      <div
        className="overflow-auto cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
      >
        <svg
          viewBox={`0 0 ${1000 / zoom} ${620 / zoom}`}
          className="w-full sm:min-w-[600px]"
          style={{ minHeight: 360 }}
        >
            <defs>
              {/* Level zone gradients */}
              {(['A2', 'B1', 'B1+', 'B2'] as const).map(level => (
                <radialGradient key={level} id={`zone-${level}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={LEVEL_CFG[level].color} stopOpacity="0.08" />
                  <stop offset="100%" stopColor={LEVEL_CFG[level].color} stopOpacity="0" />
                </radialGradient>
              ))}

              {/* Glow filter */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="glow-heavy">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* ── Level zone backgrounds ──────────────────────────────────── */}
            {(['A2', 'B1', 'B1+', 'B2'] as const).map(level => {
              const cfg = LEVEL_CFG[level]
              return (
                <ellipse
                  key={level}
                  cx={cfg.x}
                  cy={310}
                  rx="130"
                  ry="280"
                  fill={`url(#zone-${level})`}
                  className="transition-opacity duration-300"
                  opacity={dimOthers ? (connectedSet.size > 0 ? 0.6 : 0.2) : 1}
                />
              )
            })}

            {/* ── Level labels ────────────────────────────────────────────── */}
            {(['A2', 'B1', 'B1+', 'B2'] as const).map(level => {
              const cfg = LEVEL_CFG[level]
              return (
                <g key={`label-${level}`}>
                  <text
                    x={cfg.x}
                    y={28}
                    textAnchor="middle"
                    className="text-xs font-bold"
                    fill={cfg.color}
                    opacity={dimOthers ? 0.4 : 1}
                  >
                    {cfg.emoji} {cfg.label}
                  </text>
                  <text
                    x={cfg.x}
                    y={44}
                    textAnchor="middle"
                    className="text-xs"
                    fill={cfg.color}
                    opacity={dimOthers ? 0.3 : 0.6}
                  >
                    {nodes.filter(n => n.level === level).length} ta mavzu
                  </text>
                </g>
              )
            })}

            {/* ── Connections (bezier curves) ─────────────────────────────── */}
            {connections.map(conn => {
              const isHighlighted =
                highlightId !== null &&
                (conn.from.topic.id === highlightId || conn.to.topic.id === highlightId)

              const opacity = dimOthers ? (isHighlighted ? 0.9 : 0.06) : 0.2
              const strokeW = isHighlighted ? 2.5 : 1.2
              const color = conn.from.tagColor

              return (
                <g key={`conn-${conn.from.topic.id}-${conn.to.topic.id}`}>
                  {/* Glow line */}
                  {isHighlighted && (
                    <path
                      d={connectionPath(conn.from, conn.to)}
                      fill="none"
                      stroke={color}
                      strokeWidth={6}
                      opacity={0.2}
                      filter="url(#glow-heavy)"
                    />
                  )}
                  {/* Main line */}
                  <path
                    d={connectionPath(conn.from, conn.to)}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeW}
                    opacity={opacity}
                    strokeDasharray={isHighlighted ? 'none' : '6 4'}
                    className="transition-all duration-300"
                  />
                </g>
              )
            })}

            {/* ── Topic nodes ─────────────────────────────────────────────── */}
            {nodes.map(node => {
              const isHighlighted = connectedSet.has(node.topic.id)
              const isDimmed = dimOthers && !isHighlighted
              const isSelected = node.topic.id === selectedId
              const nodeRadius = isSelected ? 8 : hoveredId === node.topic.id ? 7 : 5.5

              return (
                <g
                  key={node.topic.id}
                  className="transition-all duration-200"
                  opacity={isDimmed ? 0.2 : 1}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredId(node.topic.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => {
                    const newId = node.topic.id === selectedId ? null : node.topic.id
                    setSelectedId(newId)
                    if (newId && onTopicSelect) {
                      onTopicSelect(node.topic)
                    }
                  }}
                >
                  {/* Glow ring for hovered/selected */}
                  {(isSelected || hoveredId === node.topic.id) && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={14}
                      fill={node.tagColor}
                      opacity={0.15}
                      filter="url(#glow)"
                    />
                  )}

                  {/* Strength arc */}
                  {node.strength > 0 && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={11}
                      fill="none"
                      stroke={node.tagColor}
                      strokeWidth={2}
                      strokeDasharray={`${(node.strength / 100) * 69.1} 69.1`}
                      transform={`rotate(-90 ${node.x} ${node.y})`}
                      opacity={isDimmed ? 0.1 : 0.5}
                      className="transition-all duration-700"
                    />
                  )}

                  {/* Node dot */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={nodeRadius}
                    fill={isSelected || hoveredId === node.topic.id ? node.tagColor : '#fff'}
                    stroke={node.tagColor}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    filter={isSelected ? 'url(#glow)' : undefined}
                  />

                  {/* Node label */}
                  <text
                    x={node.x}
                    y={node.y + (node.y < 70 ? 18 : node.y > 560 ? -14 : 16)}
                    textAnchor="middle"
                    className="text-xs font-medium"
                    fill={isHighlighted && dimOthers ? node.tagColor : '#6b7280'}
                    style={{ pointerEvents: 'none' }}
                  >
                    {node.topic.title.length > 16
                      ? node.topic.title.slice(0, 14) + '…'
                      : node.topic.title}
                  </text>
                </g>
              )
            })}
        </svg>
      </div>

      {/* ── Detail panel ────────────────────────────────────────────────── */}
      {highlightId && (() => {
        const node = nodes.find(n => n.topic.id === highlightId)
        if (!node) return null
        const topic = node.topic
        const cfg = LEVEL_CFG[node.level]

        return (
          <div className="border-t border-gray-100 dark:border-gray-700 px-4 sm:px-6 py-4 animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start justify-between gap-4 max-w-3xl mx-auto">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: cfg.color }}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: cfg.color }}>
                    {node.level} · {topic.tag}
                  </span>
                  {topic.week && (
                    <span className="text-xs text-gray-400">hafta {topic.week}</span>
                  )}
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                  {topic.title}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">{topic.subtitle}</p>

                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-gray-400">
                    📝 {topic.exercises.length} ta mashq
                  </span>
                  <span className="text-xs text-gray-400">
                    +{topic.exercises.length * 10} XP
                  </span>
                </div>

                {/* Connection info */}
                {(() => {
                  const related = connections
                    .filter(c => c.from.topic.id === highlightId || c.to.topic.id === highlightId)
                    .map(c => c.from.topic.id === highlightId ? c.to : c.from)
                  if (related.length === 0) return null
                  return (
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-xs text-gray-400">Bog'langan:</span>
                      {related.map(r => (
                        <button
                          key={r.topic.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedId(r.topic.id)
                            onTopicSelect?.(r.topic)
                          }}
                          className="text-xs px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          {r.topic.title}
                        </button>
                      ))}
                    </div>
                  )
                })()}
              </div>

              <button
                onClick={() => onTopicSelect?.(topic)}
                className="shrink-0 btn-primary text-xs px-3 py-1.5 flex items-center gap-1 rounded-lg"
              >
                Boshlash <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )
      })()}

      {/* ── Tag Legend ──────────────────────────────────────────────────── */}
      <div className="border-t border-gray-100 dark:border-gray-700 px-4 sm:px-6 py-2.5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 max-w-3xl mx-auto">
          {uniqueTags.map(tag => {
            const cat = TAG_TO_CATEGORY[tag] ?? 'other'
            const col = GRAMMAR_COLORS[cat]
            return (
              <span key={tag} className="flex items-center gap-1 text-xs text-gray-400">
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: col.text }}
                />
                {TAG_ICONS[tag] ?? '📌'} {tag}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
