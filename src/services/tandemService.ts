// ═══════════════════════════════════════════════════════════════════════════
// tandemService.ts — Barrel file
// ═══════════════════════════════════════════════════════════════════════════
//
// Re-eksport barcha tandem servislaridan. Importlar o'zgarmaydi:
//   import { addFriendByCode } from '../services/tandemService'  ✅
//
// Har bir servis alohida faylda:
//   inviteCodeService.ts     — Invite code CRUD
//   friendshipService.ts     — Do'stlik CRUD + Leaderboard
//   tandemPairService.ts     — Juftlik (Tandem Pair) CRUD
//   duelService.ts           — Async Duel CRUD + AI hakam
//   eloService.ts            — Elo Rating
//   weeklyDuelService.ts     — Haftalik Duel
//
// ═══════════════════════════════════════════════════════════════════════════

export {
  getOrCreateInviteCode,
  lookupUserIdByInviteCode,
} from './inviteCodeService'

export {
  addFriendByCode,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
  getFriends,
  getFriendLeaderboard,
  getFriendsLessonRecommendations,
} from './friendshipService'

export type {
  LeaderboardEntry,
  FriendLessonProgress,
} from './friendshipService'

export {
  getTandemPair,
  createTandemPair,
  updateTandemStreak,
} from './tandemPairService'

export {
  getDuelById,
  createDuel,
  lessonExercisesToDuelQuestions,
  createLessonDuel,
  submitDuelAnswers,
  getOpponentPendingDuels,
  getActiveDuels,
  getDuelHistory,
  cancelDuel,
  saveHotSeatResult,
  saveDuelVerdict,
  submitSpeakingDuelAnswer,
} from './duelService'

export {
  getUserElo,
  updateEloAfterDuel,
  getEloHistory,
  getEloLeaderboard,
} from './eloService'

export type {
  EloLeaderboardEntry,
} from './eloService'

export {
  getOrCreateWeeklyDuel,
  updateWeeklyDuelXP,
  settleWeeklyDuel,
  getWeeklyDuelWins,
} from './weeklyDuelService'

export type {
  WeeklyDuelData,
} from './weeklyDuelService'
