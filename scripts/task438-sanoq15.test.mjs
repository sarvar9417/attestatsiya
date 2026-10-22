import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const sql=readFileSync(new URL('../supabase/maintenance/task438_publish_15_base_arithmetic_y1.sql',import.meta.url),'utf8')
test('15 exact source IDs, release gates and distinct answer options',()=>{
 const src='1QQrFePltR2GBNy5lb_Hs4JsKLUcwCWHP'
 const n=[...sql.matchAll(new RegExp("\\('"+src+"',([0-9]+),'S3.NUM.0[123]'","g"))].map(x=>Number(x[1]))
 assert.deepEqual(n,[1,2,3,5,7,11,12,13,14,15,16,17,18,19,20])
 const opts=[...sql.matchAll(/ARRAY\[(.*?)\]::text\[\],([0-3]),'/gs)]
 assert.equal(opts.length,15)
 for(const [,raw,k] of opts){const v=raw.match(/'(?:''|[^'])*'/g)||[];assert.equal(v.length,4);assert.equal(new Set(v).size,4);assert.ok(+k>=0&&+k<4)}
 for(const key of ['TASK438_SOURCE_LESSON_DRIFT','TASK438_RELEASE_QA_FAILED','TASK438_POSTFLIGHT','TASK438_ALREADY_EXISTS','TASK438_FALSE_HUMAN_ATTESTATION'])assert.ok(sql.includes(key))
 assert.ok(!n.includes(6)&&!n.includes(8));assert.ok(sql.trimEnd().endsWith('COMMIT;'))
})
test('numeric source computations are independently reproducible',()=>{
 const base=(n,b)=>{let s='';do{s=(n%b).toString(36).toUpperCase()+s;n=Math.floor(n/b)}while(n);return s}
 assert.equal(((2*8+4)**2),400)
 assert.equal((12**2+16**2),20**2)
 assert.equal(12*16/2,96)
 assert.equal(10*6/2,30)
 assert.equal(3607n.toString(), '3607') // decimal notation doesn't imply original radix
 const n8=s=>parseInt(s,8)
 assert.equal(n8('3607')+n8('25676'),n8('31505'))
 assert.equal(Math.hypot(17-9,14-8),10)
 assert.equal(base(10,2),'1010')
 assert.equal(13*15+13,208)
 assert.equal(3**12 %5,1)
 assert.equal(parseInt('321',4)+2*7*7+4,parseInt('237',8))
 assert.equal(7**27%8,7)
 assert.equal(16+8,24)
 assert.equal(base(Math.hypot(38-26,36-31),5),'23')
 assert.equal(base(Math.hypot(27,36),9),'50')
 const digits=base(3021,4).split('').map(Number)
 assert.equal(digits.filter(v=>v%2===0).reduce((a,b)=>a+b,0)-digits.filter(v=>v%2).reduce((a,b)=>a+b,0),-8)
 assert.equal(base((268+420+1220)/3,11),'529')
 assert.equal(base(47,7),'65')
})
