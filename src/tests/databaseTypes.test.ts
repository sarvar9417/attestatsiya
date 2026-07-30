import { describe, expect, expectTypeOf, it } from 'vitest'
import {
  Constants,
  type Database,
  type Enums,
  type Json,
  type Tables,
  type TablesInsert,
} from '../lib/database.types'

type SubmitAnswerArgs =
  Database['public']['Functions']['submit_answer']['Args']
type PublicTableName = keyof Database['public']['Tables']
type RemovedLegacyTable = Extract<
  | 'roles'
  | 'specification_versions'
  | 'subtopics'
  | 'attempts'
  | 'mock_exams',
  PublicTableName
>

describe('remote UUID database type contract', () => {
  it('uses UUID identifiers for core assessment tables', () => {
    expectTypeOf<Tables<'modules'>['id']>().toEqualTypeOf<string>()
    expectTypeOf<Tables<'questions'>['id']>().toEqualTypeOf<string>()
    expectTypeOf<Tables<'exams'>['id']>().toEqualTypeOf<string>()
    expectTypeOf<Tables<'exam_items'>['question_id']>().toEqualTypeOf<string>()
  })

  it('does not expose the archived BIGINT schema', () => {
    expectTypeOf<RemovedLegacyTable>().toEqualTypeOf<never>()
  })

  it('models secure submit_answer arguments', () => {
    expectTypeOf<SubmitAnswerArgs>().toMatchTypeOf<{
      p_answer: Json
      p_exam_id: string
      p_question_id: string
      p_time_spent?: number
    }>()
  })

  it('keeps profile roles and inserts aligned with the remote enums', () => {
    expectTypeOf<Tables<'profiles'>['role']>().toEqualTypeOf<
      Enums<'user_role'>
    >()
    expectTypeOf<TablesInsert<'profiles'>['id']>().toEqualTypeOf<string>()
    expect(Constants.public.Enums.user_role).toEqual([
      'user',
      'editor',
      'admin',
    ])
  })

  it('contains the official assessment enum values', () => {
    expect(Constants.public.Enums.exam_section).toEqual([
      'specialty',
      'professional_standard',
      'pedagogy',
      'methodology',
    ])
    expect(Constants.public.Enums.question_format).toEqual(['Y1', 'Y2', 'Y3'])
  })
})
