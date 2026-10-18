import { describe, expect, it } from 'vitest'
import { MODULES } from '../data/contentTree'
import { mergeCatalog, usePublishedNetworkV2Catalog } from '../features/content/catalog'
import type { LessonSummary, ModuleDetail } from '../features/content/contentApi'
const chapters = (): LessonSummary[] => Array.from({length:10},(_,i)=>({
  id: `c1200000-0000-4000-8000-${String(i+1).padStart(12,'0')}`,
  module_id:'uuid-m12', title_uz:`${i+1}-bob. Tarmoq`,
  slug:`tarmoq-v2-bob-${String(i+1).padStart(2,'0')}`,
  body_mdx:'# Tarmoq nazariyasi\n\nTasdiqlangan mavzu matni.',
  blocks:[], blocks_kind:'chapter', est_minutes:30, order_idx:i+11,
  status:'published', constructs:[],
}))
const detail=(lessons:LessonSummary[],code='M12'):ModuleDetail=>({
  id:'uuid-m12',code,title_uz:'Tarmoqlar',summary_uz:null,
  order_idx:12, exam_section:'specialty', status:'published',
  exam_question_count:2,lesson_count:lessons.length,lessons,
})
const base=()=>mergeCatalog(MODULES,[])
describe('TASK-220: M12 learner catalog must fail closed',()=>{
  it('loads all ten UUID lessons in book order once fully published',()=>{
    const before=base(),after=usePublishedNetworkV2Catalog(before,detail(chapters().reverse()))
    expect(after.find(m=>m.code==='M12')?.subtopics.map(x=>x.code)).toEqual(
      Array.from({length:10},(_,i)=>`tarmoq-v2-bob-${String(i+1).padStart(2,'0')}`))
    expect(after.find(m=>m.code==='M12')?.subtopics.every(x=>/^[0-9a-f-]{36}$/i.test(x.id))).toBe(true)
    expect(before.find(m=>m.code==='M12')?.subtopics).toHaveLength(9)
    expect(after.find(m=>m.code==='M13')?.subtopics).toEqual(before.find(m=>m.code==='M13')?.subtopics)
  })
  it.each([
    ['missing',chapters().slice(0,9)],
    ['draft',chapters().map((x,i)=>i===3?{...x,status:'draft'}:x)],
    ['no body',chapters().map((x,i)=>i===3?{...x,body_mdx:' '}:x)],
    ['duplicate',chapters().map((x,i)=>i===9?{...x,slug:'tarmoq-v2-bob-01'}:x)],
    ['foreign',chapters().map((x,i)=>i===9?{...x,slug:'other-lesson'}:x)],
  ])('keeps previous catalog on %s',(_scenario,items)=>{
    const old=base();expect(usePublishedNetworkV2Catalog(old,detail(items))).toBe(old)
  })
  it('does not touch unrelated modules',()=>{
    const old=base();expect(usePublishedNetworkV2Catalog(old,detail(chapters(),'M13'))).toBe(old)
  })
})
