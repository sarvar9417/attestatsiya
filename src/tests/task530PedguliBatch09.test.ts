import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const sql = readFileSync('supabase/migrations/20261022042000_task530_pedguli_verified_batch09.sql', 'utf8')
const match = sql.match(/FROM jsonb_array_elements\(\$bank\$\n([\s\S]+?)\n\$bank\$::jsonb\)/)
if (!match) throw new Error('TASK-530 batch 09 JSON not found')
const bank = JSON.parse(match[1]) as Array<{m:number;c:string;l:string;k:string;d:number;s:string;o:string[];a:number;e:string}>
const words = (value: string) => value.trim().split(/\s+/).length

describe('TASK-530 PedGuli verified batch 09', () => {
 it('contains 30 unique mastery and didactics sources', () => {
  expect(bank).toHaveLength(30); expect(new Set(bank.map(x=>x.m)).size).toBe(30)
  expect(bank.map(x=>x.m)).toEqual([988,989,993,994,996,997,1031,1032,1034,1035,1041,1100,1172,1175,1389,1395,1403,1404,1405,1406,1436,1441,1442,1444,1446,1471,1472,1473,1474,1475])
  expect(sql).toContain('TASK530_B09_SOURCE_ALREADY_REPRESENTED')
 })
 it('has complete pedagogical content', () => {
  for(const x of bank){expect(x.s.length).toBeGreaterThan(45);expect(x.e.length).toBeGreaterThan(80);expect(x.a).toBeGreaterThanOrEqual(0);expect(x.a).toBeLessThan(4)}
 })
 it('passes option uniqueness and production length-bias rules', () => {
  for(const x of bank){expect(x.o).toHaveLength(4);expect(new Set(x.o.map(v=>v.toLocaleLowerCase('uz'))).size).toBe(4);const c=x.o.map(words),min=Math.min(...c),max=Math.max(...c),cw=c[x.a],mw=Math.max(...c.filter((_,i)=>i!==x.a));expect(max,`${x.m}: ${c}`).toBeLessThanOrEqual(min*1.8);expect(cw,`${x.m}: ${c}`).toBeLessThanOrEqual(mw*1.25)}
 })
 it('publishes additively and atomically', () => {
  expect(sql).toContain('TASK530_B09_SEMANTIC_'); expect(sql).toContain('independent human expert signoff NOT claimed'); expect(sql).toContain('TASK530_B09_POSTFLIGHT_%_OF_30'); expect(sql).not.toMatch(/UPDATE\s+public\.question_keys\b/i); expect(sql).not.toMatch(/DELETE\s+FROM\s+public\.questions\b/i)
 })
})
