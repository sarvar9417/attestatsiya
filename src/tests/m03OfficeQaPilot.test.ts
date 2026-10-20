import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
const data=JSON.parse(readFileSync(resolve(process.cwd(),'supabase/qa/m03_office_style_pilot_36.json'),'utf8')) as {questions:Array<{code:string,chapter:string,format:string,difficulty:number,stem_md:string,explanation_md:string,source_reference:string,status:string,options:string[],answer_index?:number,left?:string[],right?:string[],mapping?:Record<string,number>,steps?:string[],order?:number[]}>}
const q=data.questions
describe('TASK-280 source-grounded Office candidates',()=>{
 it('contains 36 unique review-only items in Y1=24 Y2=6 Y3=6',()=>{expect(q).toHaveLength(36);expect(new Set(q.map(x=>x.code)).size).toBe(36);for(const [fmt,n] of [['Y1',24],['Y2',6],['Y3',6]] as const)expect(q.filter(x=>x.format===fmt)).toHaveLength(n);expect(q.every(x=>x.status==='review'&&x.stem_md&&x.explanation_md&&x.source_reference)).toBe(true)})
 it('covers all three programs',()=>{expect(q.filter(x=>x.chapter.startsWith('W'))).toHaveLength(8);expect(q.filter(x=>x.chapter.startsWith('E'))).toHaveLength(20);expect(q.filter(x=>x.chapter.startsWith('P'))).toHaveLength(8)})
 it('has unique Y1 choices, bijective Y2 maps and proper Y3 orders',()=>{for(const x of q){if(x.format==='Y1'){expect(x.options).toHaveLength(4);expect(new Set(x.options).size).toBe(4);expect(x.answer_index).toBeGreaterThanOrEqual(0);expect(x.answer_index).toBeLessThan(4)}else if(x.format==='Y2'){expect(x.left).toHaveLength(4);expect(x.right).toHaveLength(4);expect(Object.values(x.mapping||{}).sort()).toEqual([1,2,3,4])}else{expect(x.steps).toHaveLength(4);expect([...x.order!].sort()).toEqual([1,2,3,4])}}})
})
