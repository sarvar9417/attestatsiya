import { describe, expect, it } from 'vitest'
import source from '../content/tarmoq/Kompyuter_tarmoqlari_300_savol_V2.json'

function cidrMask(prefix: number) {
  const n = (0xffffffff << (32 - prefix)) >>> 0
  return [24, 16, 8, 0].map(shift => (n >>> shift) & 255).join('.')
}
function range(ip: string,prefix: number) {
  const a=ip.split('.').map(Number).reduce((p,n)=>(((p<<8)|n)>>>0),0)>>>0
  const mask=(0xffffffff << (32-prefix))>>>0
  const lo=(a&mask)>>>0, hi=(lo|(~mask>>>0))>>>0
  const dotted=(v:number)=>[24,16,8,0].map(n=>(v>>>n)&255).join('.')
  return {network:dotted(lo),broadcast:dotted(hi),first:dotted(lo+1),last:dotted(hi-1),usable:(hi-lo-1).toString()}
}
describe('TASK-230 independent IPv4 oracle — M12 original V2', () => {
  it('checks 31 previously identified CIDR/network/broadcast/host keys',()=>{
    let checks=0
    for(const q of source) {
      if(q.kind!=='Y1') continue
      const mask=q.q.match(/IPv4 \/(\d+) prefiksining uzluksiz subnet maskasini toping/)
      if(mask) {
        expect(q.ans,q.id).toBe(cidrMask(Number(mask[1])))
        checks++;continue
      }
      if(q.ch!==6)continue
      const match=q.q.match(/((?:\d{1,3}\.){3}\d{1,3})\/(\d{1,2})/)
      if(!match)continue
      const x=range(match[1],Number(match[2]))
      let target:string|undefined
      if(/network|tarmoq \(network\)/i.test(q.q))target=x.network
      else if(/broadcast manzil/i.test(q.q))target=x.broadcast
      else if(/birinchi foydalaniladigan host/i.test(q.q))target=x.first
      else if(/oxirgi foydalaniladigan host/i.test(q.q))target=x.last
      else if(/nechta.*host|jami nechta foydalaniladigan host/i.test(q.q))target=x.usable
      if(target!==undefined){expect(q.ans,q.id).toBe(target);checks++}
    }
    expect(checks).toBe(31)
  })
})
