import {describe,expect,it} from 'vitest'
import {readFileSync} from 'node:fs'

type Registry={inventory_total:number;initial_triage:Record<string,number>;new_candidate_adjudication:{represented_in_database:number;rejected:number;unadjudicated:number;represented_lineages:Record<string,number>;task530_batches_06_12_added:number};rejection_groups:Array<{code:string;reason:string;message_ids:number[]}>}
const registry=JSON.parse(readFileSync('docs/quality/task530_pedguli_adjudication.json','utf8')) as Registry
const expectedRejected=[514,632,657,659,664,673,739,785,795,796,797,863,1033,1036,1112,1115,1214,1260,1350,1443,1445,1447,1450,1488,1559,1572,1575,1888,2174,2185,2242,2243,2244,2245,2246,2247,2260,2404,2480,2486,2487,2684,2685,2687,2688,2689,2696,2722,3113]
const batchFiles=['20261022035000_task530_pedguli_verified_batch06.sql','20261022040000_task530_pedguli_verified_batch07.sql','20261022041000_task530_pedguli_verified_batch08.sql','20261022042000_task530_pedguli_verified_batch09.sql','20261022043000_task530_pedguli_verified_batch10.sql','20261022044000_task530_pedguli_verified_batch11.sql','20261022045000_task530_pedguli_verified_batch12.sql']
const batchIds=batchFiles.flatMap(file=>[...readFileSync(`supabase/migrations/${file}`,'utf8').matchAll(/\{"m":(\d+),/g)].map(match=>Number(match[1])))

describe('TASK-530 PedGuli complete adjudication',()=>{
  it('accounts for the complete 429-message inventory',()=>{expect(Object.values(registry.initial_triage).reduce((a,b)=>a+b,0)).toBe(registry.inventory_total);expect(registry.inventory_total).toBe(429)})
  it('accounts for every new candidate',()=>{const a=registry.new_candidate_adjudication;expect(a.represented_in_database+a.rejected+a.unadjudicated).toBe(registry.initial_triage.new_candidate);expect(a.unadjudicated).toBe(0);expect(Object.values(a.represented_lineages).reduce((x,y)=>x+y,0)).toBe(a.represented_in_database)})
  it('records every rejection exactly once with a reason',()=>{const ids=registry.rejection_groups.flatMap(group=>group.message_ids).sort((a,b)=>a-b);expect(ids).toEqual(expectedRejected);expect(new Set(ids).size).toBe(49);for(const group of registry.rejection_groups)expect(group.reason.length).toBeGreaterThan(60)})
  it('keeps all accepted TASK-530 batch sources outside the rejection registry',()=>{expect(batchIds).toHaveLength(208);expect(new Set(batchIds).size).toBe(208);expect(batchIds.some(id=>expectedRejected.includes(id))).toBe(false);expect(registry.new_candidate_adjudication.task530_batches_06_12_added).toBe(208)})
})
