import {describe,it,expect} from 'vitest'
import {readFileSync} from 'node:fs'
const list=(JSON.parse(readFileSync('supabase/qa/m03_office_semantic_36_review.json','utf8')) as {questions:Array<{code:string,format:string,status:string,difficulty:number,options?:string[],answer_index?:number,left?:string[],right?:string[],mapping?:Record<string,number>,steps?:string[],order?:number[]}>}).questions
describe('TASK-281 Office review semantic gate',()=>{
 it('preserves 36 unique candidates in review',()=>{expect(list).toHaveLength(36);expect(new Set(list.map(q=>q.code)).size).toBe(36);expect(list.every(q=>q.status==='review')).toBe(true)})
 it('requires format-native answer structures',()=>{for(const q of list){expect(q.difficulty).toBeGreaterThanOrEqual(1);expect(q.difficulty).toBeLessThanOrEqual(5);if(q.format==='Y1'){expect(q.options).toHaveLength(4);expect(new Set(q.options).size).toBe(4);expect(q.answer_index).toBeGreaterThanOrEqual(0);expect(q.answer_index).toBeLessThan(4)}else if(q.format==='Y2'){expect(q.left).toHaveLength(4);expect(q.right).toHaveLength(4);expect([...Object.values(q.mapping!)].sort()).toEqual([1,2,3,4])}else{expect(q.steps).toHaveLength(4);expect([...q.order!].sort()).toEqual([1,2,3,4])}}})
 it('reworks four context-dependent Y3 examples',()=>{for(const c of ['M03-S26-E02-07','M03-S26-E03-07','M03-S26-P01-03','M03-S26-P02-05']){const q=list.find(q=>q.code===c)!;expect(q.format).toBe('Y3');expect(q.steps).toHaveLength(4)}})
})
