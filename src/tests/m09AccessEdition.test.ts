import { describe, expect, it } from 'vitest'
import { M09_ACCESS_V2_SLUGS, isM09V2LessonSlug, selectPublishedM09V2Lessons } from '../features/content/m09AccessEdition'
import type { LessonSummary } from '../features/content/contentApi'

type Lesson = Pick<LessonSummary, 'id' | 'slug' | 'title_uz' | 'order_idx' | 'status'>
const all: Lesson[] = M09_ACCESS_V2_SLUGS.map((slug, index) => ({
  id: `00000000-0000-4000-8000-${String(index + 1).padStart(12,'0')}`,
  slug, title_uz: `V2 bob ${index + 1}`, order_idx: index + 6, status: 'published',
}))
describe('M09 Access V2 atomic learner release', () => {
  it('rejects a partly published edition', () => {
    expect(selectPublishedM09V2Lessons(all.slice(0, 5))).toBeNull()
    expect(selectPublishedM09V2Lessons(all.map((x,i) => i === 1 ? {...x,status:'review'} : x))).toBeNull()
  })
  it('rejects accidental duplicate chapters', () => {
    expect(selectPublishedM09V2Lessons([...all.slice(0,5), {...all[0], id:'other'}])).toBeNull()
  })
  it('only recognizes six canonical V2 lesson slugs', () => {
    expect(isM09V2LessonSlug('m09-v2-access-sql')).toBe(true)
    expect(isM09V2LessonSlug('m09-v2-unknown')).toBe(false)
  })
  it('returns exactly six published lessons sorted for learner navigation', () => {
    const result=selectPublishedM09V2Lessons([...all].reverse())
    expect(result?.map(x=>x.code)).toEqual([...M09_ACCESS_V2_SLUGS])
    expect(result?.every(x=>x.id && x.title)).toBe(true)
  })
  it('does not let unrelated old M09 lessons satisfy completeness', () => {
    expect(selectPublishedM09V2Lessons([{id:'legacy',slug:'malumotlar-bazasi-va-mbbt-asoslari',title_uz:'Old lesson',order_idx:1,status:'published'},...all.slice(0,5)])).toBeNull()
  })
})
