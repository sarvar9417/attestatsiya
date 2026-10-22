import {describe,expect,it} from 'vitest';import{readFileSync}from'node:fs'
const sql=readFileSync('supabase/migrations/20261022045000_task530_pedguli_verified_batch12.sql','utf8');const m=sql.match(/FROM jsonb_array_elements\(\$bank\$\n([\s\S]+?)\n\+?\] \$bank\$::jsonb\)/);if(!m)throw new Error('TASK-530 batch 12 JSON not found');const bank=JSON.parse(m[1]+'\n]') as Array<{m:number;c:string;l:string;k:string;d:number;s:string;o:string[];a:number;e:string}>;const words=(s:string)=>s.trim().split(/\s+/).length
describe('TASK-530 PedGuli verified batch 12',()=>{
it('contains 28 unique adjudicated sources',()=>{expect(bank).toHaveLength(28);expect(new Set(bank.map(x=>x.m)).size).toBe(28);expect(sql).toContain('TASK530_B12_SOURCE_ALREADY_REPRESENTED')})
it('has complete source rewrites',()=>{for(const x of bank){expect(x.s.length).toBeGreaterThan(45);expect(x.e.length).toBeGreaterThan(80);expect(x.o).toHaveLength(4)}})
it('passes option uniqueness and balance',()=>{for(const x of bank){expect(new Set(x.o.map(v=>v.toLocaleLowerCase('uz'))).size).toBe(4);const c=x.o.map(words),mi=Math.min(...c),ma=Math.max(...c),cw=c[x.a],mw=Math.max(...c.filter((_,i)=>i!==x.a));expect(ma,`${x.m}: ${c}`).toBeLessThanOrEqual(mi*1.8);expect(cw,`${x.m}: ${c}`).toBeLessThanOrEqual(mw*1.25)}})
it('publishes additively and atomically',()=>{expect(sql).toContain('TASK530_B12_SEMANTIC_');expect(sql).toContain('TASK530_B12_POSTFLIGHT_%_OF_28');expect(sql).not.toMatch(/UPDATE\s+public\.question_keys\b/i);expect(sql).not.toMatch(/DELETE\s+FROM\s+public\.questions\b/i)})
})
