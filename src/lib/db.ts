// ═══════════════════════════════════════════════════════════════════════════
// db.ts — Typed Supabase Helper
// ═══════════════════════════════════════════════════════════════════════════
//
// Maqsad: Service fayllaridagi `as never` / `as unknown as` castlarini
//         kamaytirish. Supabase generated types bilan ishlashni osonlashtirish.
//
// Pattern:
//   import { db } from '../lib/db'
//
//   // Typed select
//   const { data } = await db.from('users').select('*').eq('id', userId)
//
//   // Typed RPC
//   const { data } = await db.rpc('get_word_counts_by_level')
//
//   // JSON column → app type (null→undefined conversion)
//   const skill = db.jsonRow<ReadingSection>(row.reading)
//
//   // Row → App type (null fields → undefined)
//   export function toApp<T extends Record<string, unknown>>(row: T): AppRow<T>
// ═══════════════════════════════════════════════════════════════════════════

import { supabase } from './supabase'
import type { Database, Json } from '../types/supabase'

// ─── Types ────────────────────────────────────────────────────────────────────

type TableName = keyof Database['public']['Tables']
type RpcName = string & keyof Database['public']['Functions']

/**
 * Maps all nullable fields (T | null) to optional (T | undefined).
 * This bridges Supabase's null-based typing with app's undefined-based typing.
 */
type NullToUndef<T> = T extends null
  ? undefined
  : T extends (infer U)[]
    ? NullToUndef<U>[]
    : T extends Record<string, unknown>
      ? { [K in keyof T]: NullToUndef<T[K]> }
      : T extends undefined
        ? undefined
        : T

// ─── Typed DB ─────────────────────────────────────────────────────────────────

class TypedDB {
  /**
   * Typed table access. Returns the same query builder as supabase.from()
   * but with the table properly typed from the Database definition.
   *
   * @example
   *   const { data } = await db.from('users').select('*').eq('id', userId)
   */
  from<T extends TableName>(table: T) {
    return supabase.from(table)
  }

  /**
   * Typed RPC call. Args and return types are inferred from the Database type.
   *
   * @example
   *   const { data } = await db.rpc('get_word_counts_by_level')
   *   const { data } = await db.rpc('get_daily_phrases', {
   *     p_user_id: userId,
   *     p_level: level ?? null,
   *   })
   */
  rpc<Name extends RpcName>(
    name: Name,
    args?: Database['public']['Functions'][Name]['Args'] extends never
      ? undefined
      : Database['public']['Functions'][Name]['Args'],
  ) {
    if (args === undefined) {
      return supabase.rpc(name)
    }
    return supabase.rpc(name, args as Database['public']['Functions'][Name]['Args'])
  }

  /**
   * Convert a Supabase Row (with `null`) to an app type (with `undefined`).
   * Use this on return values when Row type doesn't match the app interface.
   *
   * @example
   *   return db.toApp(data) as PersonalWord
   */
  toApp<T>(row: T): NullToUndef<T> {
    if (row === null || row === undefined) return row as NullToUndef<T>
    if (Array.isArray(row)) return row.map(r => this.toApp(r)) as NullToUndef<T>
    if (typeof row === 'object') {
      const result: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(row as Record<string, unknown>)) {
        result[key] = value === null ? undefined : this.toApp(value)
      }
      return result as NullToUndef<T>
    }
    return row as NullToUndef<T>
  }

  /**
   * Typed access to a JSON column value.
   * Supabase types JSON columns as `Json` union — use this to cast to your app type.
   *
   * @example
   *   const lessonData = db.jsonFrom<LessonRow>(row.data)
   *   const questions = db.jsonFrom<TQ[]>(mockRow.data)
   */
  jsonFrom<T>(json: Json | null | undefined): T | null | undefined {
    if (json === null) return null as T | null
    if (json === undefined) return undefined as T | undefined
    return json as unknown as T
  }

  /**
   * Convert app data to Supabase Json type for inserts/updates.
   * Use this when inserting JSON columns.
   *
   * @example
   *   question_set: db.toJson(questions)
   */
  toJson<T>(value: T): Json {
    return value as unknown as Json
  }

  /**
   * Cast a Supabase query result to your app type.
   * Use this when Supabase Row type doesn't structurally match your app type
   * (e.g. null vs undefined, or JSON column type differences).
   *
   * @example
   *   const duel = db.cast<Duel>(data)
   *   const duels = db.cast<Duel[]>(data ?? [])
   */
  cast<T>(value: unknown): T {
    return value as T
  }
}

// ─── Singleton ────────────────────────────────────────────────────────────────

export const db = new TypedDB()

// ─── Utility Types ────────────────────────────────────────────────────────────

/**
 * Extract the Row type from a table in the Database.
 *
 * @example
 *   type UserRow = TableRow<'users'>
 */
export type TableRow<T extends TableName> = Database['public']['Tables'][T]['Row']

/**
 * Extract the Insert type from a table.
 *
 * @example
 *   type UserInsert = TableInsert<'users'>
 */
export type TableInsert<T extends TableName> = Database['public']['Tables'][T]['Insert']

/**
 * Extract the Update type from a table.
 *
 * @example
 *   type UserUpdate = TableUpdate<'users'>
 */
export type TableUpdate<T extends TableName> = Database['public']['Tables'][T]['Update']
