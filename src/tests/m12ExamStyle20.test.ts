import { describe, expect, it } from 'vitest'
import newBank from '../content/tarmoq/M12_demo_style_20_original_Y1_v4.json'
import previousBank from '../content/tarmoq/Kompyuter_tarmoqlari_300_savol_V2.json'

const data = newBank
function selected(id: string) {
  const q = data.find(item => item.id === id)
  if (!q) throw new Error('missing exam source item: ' + id)
  return q.options[q.correct]
}
function prefixMask(prefix: number): string {
  const val = (0xffffffff << (32 - prefix)) >>> 0
  return [24,16,8,0].map(shift => (val >>> shift) & 255).join('.')
}
function networkBroadcast(ip: string,prefix: number): [string,string] {
  const x = ip.split('.').map(Number).reduce((n,v) => ((n << 8) | v) >>> 0,0) >>> 0
  const mask = (0xffffffff << (32-prefix))>>>0
  const net = (x & mask)>>>0
  const bc = (net | (~mask >>> 0))>>>0
  const dotted=(n:number)=>[24,16,8,0].map(s=>((n>>>s)&255)).join('.')
  return [dotted(net),dotted(bc)]
}
describe('TASK-230 2025/2026 sample-style M12 questions',()=>{
  it('preserves distinct, source-attributed questions across all 10 chapters',()=>{
    expect(data).toHaveLength(20)
    expect(new Set(data.map(q=>q.id)).size).toBe(20)
    const existing=new Set(previousBank.map(x=>x.q.toLocaleLowerCase('uz-UZ')))
    for(let chapter=1;chapter<=10;chapter++) {
      expect(data.filter(q=>q.ch===chapter)).toHaveLength(2)
    }
    for(const q of data){
      expect(q.format).toBe('Y1')
      expect(q.options).toHaveLength(4)
      expect(new Set(q.options).size).toBe(4)
      expect(q.correct).toBeGreaterThanOrEqual(0)
      expect(q.correct).toBeLessThan(4)
      expect(q.source_reference.length).toBeGreaterThan(20)
      expect(q.source_demo.length).toBeGreaterThan(12)
      expect(q.explanation.length).toBeGreaterThan(25)
      expect(existing.has(q.stem.toLocaleLowerCase('uz-UZ')),q.id).toBe(false)
      expect(q.difficulty).toBe(4)
    }
  })
  it('independently checks CIDR /21 and /19 mask answer keys',()=>{
    expect(selected('TAR-EXAM26-05-01')).toBe(prefixMask(21))
    expect(selected('TAR-EXAM26-05-02')).toBe(prefixMask(19))
  })
  it('independently checks network and broadcast pair for /20',()=>{
    expect(selected('TAR-EXAM26-06-01')).toBe(
      networkBroadcast('172.18.79.219',20).join(' — '))
  })
  it('recomputes all four dotted IPv4 octets from binary',()=>{
    const octets=['11000000','10101000','00101010','11010101']
    expect(selected('TAR-EXAM26-06-02')).toBe(octets.map(v=>parseInt(v,2)).join('.'))
  })
  it('independently checks VLSM sizes, address boundaries and non-overlap',()=>{
    const specs=[['192.168.50.0',25,100],['192.168.50.128',26,40],['192.168.50.192',27,20]] as const
    let previousLast=-1
    for(const [ip,prefix,needed] of specs) {
      const [start,last]=networkBroadcast(ip,prefix)
      const addr=(x:string)=>x.split('.').map(Number).reduce((n,v)=>(n*256+v)>>>0,0)>>>0
      expect(addr(start)).toBeGreaterThan(previousLast)
      previousLast=addr(last)
      expect(2**(32-prefix)-2).toBeGreaterThanOrEqual(needed)
    }
    expect(selected('TAR-EXAM26-07-01')).toBe(
      'A: 192.168.50.0/25; B: 192.168.50.128/26; C: 192.168.50.192/27')
  })
  it('checks private IPv4 fragment puzzle and intersection set arithmetic',()=>{
    expect(selected('TAR-EXAM26-07-02')).toBe('BACD')
    expect(selected('TAR-EXAM26-09-01')).toBe('220 000')
    expect(450000+380000-610000).toBe(220000)
  })
})
