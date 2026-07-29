// Placement Test — natijani saqlash/o'qish servisi
// Reja: docs/EnglishPath_Roadmap.md (1.1)
// Jadval: placement_results (migratsiya 20250612000000)

import { supabase } from '../lib/supabase'
import { db } from '../lib/db'
import type { PlacementResult } from '../data/placement/types'
import { monitoring } from '../lib/monitoring'

/** Test natijasini DB'ga yozadi (har test — yangi yozuv = tarix) */
export async function savePlacementResult(userId: string, r: PlacementResult): Promise<void> {
  try {
    await supabase.from('placement_results').insert({
      user_id: userId,
      level: r.level,
      scores: db.toJson(r.bandScores),
      correct_count: r.correctCount,
      total_asked: r.totalAsked,
      taken_at: r.takenAt,
    })
  } catch (e) {
    monitoring.captureMessage('savePlacementResult failed (offline): ' + (e instanceof Error ? e.message : String(e)), 'warn')
    /* oflayn — natija baribir ilovaga o'rnatiladi */
  }
}

export interface LatestPlacement {
  level: string
  takenAt: string
}

/** Foydalanuvchining oxirgi placement natijasi (yo'q bo'lsa null) */
export async function getLatestPlacement(userId: string): Promise<LatestPlacement | null> {
  try {
    const { data, error } = await supabase
      .from('placement_results')
      .select('level, taken_at')
      .eq('user_id', userId)
      .order('taken_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (error || !data) return null
    return { level: data.level, takenAt: data.taken_at }
  } catch (e) {
    monitoring.captureMessage('getLatestPlacement failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return null
  }
}
