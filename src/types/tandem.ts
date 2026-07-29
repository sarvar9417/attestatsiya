// ═══════════════════════════════════════════════════════════════════════════
// Tandem — Do'st bilan o'rganish tizimi tiplari
// ═══════════════════════════════════════════════════════════════════════════

/** Do'stlik statusi */
export type FriendshipStatus = 'pending' | 'accepted' | 'blocked'

/** Elo rating tier */
export type EloTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'grandmaster'

/** Foydalanuvchining Elo rating ma'lumotlari */
export interface UserElo {
  userId: string
  rating: number
  tier: EloTier
  matchesPlayed: number
  wins: number
  losses: number
  draws: number
  updatedAt: string
}

/** Elo o'zgarish tarixi */
export interface EloHistoryEntry {
  id: string
  userId: string
  duelId: string
  oldRating: number
  newRating: number
  change: number
  opponentName: string
  result: 'win' | 'loss' | 'draw'
  createdAt: string
}

/** Duel rejimlari */
export type DuelMode = 'vocab' | 'grammar' | 'reading' | 'speaking' | 'hotseat' | 'lesson'

/** Duel statusi */
export type DuelStatus = 'pending' | 'opponent_turn' | 'done' | 'expired'

/** Taklif qiluvchi tomon */
export type DuelRole = 'challenger' | 'opponent'

// ─── Do'stlik ───────────────────────────────────────────────────────────────

export interface Friendship {
  id:         string
  user_id:    string
  friend_id:  string
  status:     FriendshipStatus
  created_at: string
}

// ─── Juftlik (1:1) ───────────────────────────────────────────────────────────

export interface TandemPair {
  id               : string
  user_a           : string
  user_b           : string
  combined_streak  : number
  freeze_used_on   : string | null   // grace muhlat ishlatilgan kun
  last_both_active : string | null   // ikkalasi ham faol bo'lgan oxirgi kun
  total_xp         : number
  created_at       : string
}

// ─── Async Duel ──────────────────────────────────────────────────────────────

export interface Duel {
  id              : string
  challenger      : string
  opponent        : string | null   // null = AI bot
  mode            : DuelMode
  status          : DuelStatus
  question_set    : DuelQuestion[]
  challenger_score: number | null
  opponent_score  : number | null
  is_bot          : boolean
  lesson_id?      : string | null    // 'lesson' mode uchun
  lesson_title?   : string | null    // dars nomi
  expires_at      : string          // now() + 24h
  created_at      : string
}

export interface DuelQuestion {
  id       : number
  english  : string
  options  : string[]
  correct  : number
  passage? : string    // reading mode uchun matn
}

// ─── AI hakam bahosi ─────────────────────────────────────────────────────────

export interface DuelResult {
  id           : string
  duel_id      : string
  user_id      : string
  grammar_score: number | null
  vocab_score  : number | null
  topic_score  : number | null
  feedback     : string | null
  created_at   : string
}

// ─── UI state turlari ────────────────────────────────────────────────────────

export interface FriendWithProfile {
  friendshipId: string
  userId      : string
  name        : string
  level       : string
  streak      : number
  lastActive  : string | null
  status      : FriendshipStatus
}

export interface DuellistItem {
  id        : string
  opponentId: string
  opponentName: string
  mode      : DuelMode
  status    : DuelStatus
  myScore   : number | null
  theirScore: number | null
  expiresAt : string
  isBot     : boolean
  lessonTitle?: string | null   // 'lesson' mode uchun dars nomi
}

// ─── AI Roleplay Duo ─────────────────────────────────────────────────────────

/** Roleplay Duo session statusi */
export type RoleplaySessionStatus = 'invited' | 'user_a_playing' | 'user_a_done' | 'user_b_playing' | 'user_b_done' | 'completed'

/** Roleplay Duo session */
export interface RoleplaySession {
  id        : string
  pair_id   : string
  scenario_id: string
  creator_id: string
  status    : RoleplaySessionStatus
  /** User A (creator) ning suhbat tarixi */
  user_a_messages: { role: 'user' | 'assistant'; content: string }[]
  /** User B (juft) ning suhbat tarixi */
  user_b_messages: { role: 'user' | 'assistant'; content: string }[]
  /** User A bahosi (ScenarioReport formatida) */
  user_a_evaluation: RoleplayEvaluation | null
  /** User B bahosi */
  user_b_evaluation: RoleplayEvaluation | null
  expires_at: string
  created_at: string
  updated_at: string
}

export interface RoleplayEvaluation {
  fluency      : number
  taskSuccess  : number
  newWords     : { word: string; meaning: string }[]
  mistakes     : { wrong: string; correct: string; tip: string }[]
  encouragement: string
}

/** UI list item uchun */
export interface RoleplayDuoItem {
  id           : string
  scenarioTitle: string
  scenarioEmoji: string
  status       : RoleplaySessionStatus
  creatorName  : string
  myTurn       : boolean   // joriy foydalanuvchi harakat qilishi kerakmi?
  scoreA       : number | null
  scoreB       : number | null
  createdAt    : string
}

// ─── Deep-link kodi ──────────────────────────────────────────────────────────

export interface InviteCode {
  code     : string
  inviterId: string
  expiresAt: string
}
