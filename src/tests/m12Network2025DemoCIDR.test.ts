import { describe, expect, it } from 'vitest'
import source from '../content/tarmoq/Kompyuter_tarmoqlari_300_savol_V2.json'

// 2025 kuzgi informatika demo (PDF p11, Q25): 192.168.10.32/27, 4 mask options.
describe('TASK-220 2025 demo CIDR mask and address-count provenance', () => {
  it('computes mask and network/broadcast/usable hosts independently', () => {
    const prefix = 27
    const mask = (0xffffffff << (32 - prefix)) >>> 0
    const dotted = [24, 16, 8, 0].map(shift => (mask >>> shift) & 255).join('.')
    expect(dotted).toBe('255.255.255.224')
    const base = 192 * 2 ** 24 + 168 * 2 ** 16 + 10 * 2 ** 8 + 32
    const network = (base & mask) >>> 0
    const total = 2 ** (32 - prefix)
    const octet = (v: number) => [24, 16, 8, 0].map(shift => (v >>> shift) & 255).join('.')
    expect(octet(network)).toBe('192.168.10.32')
    expect(octet((network + total - 1) >>> 0)).toBe('192.168.10.63')
    expect(total).toBe(32)
    expect(total - 2).toBe(30)
  })
  it('ties mask calculation to stable M12 V2 source items', () => {
    const m = source.find(q => q.id === 'TAR-05-014')
    expect(m).toBeDefined()
    expect(m?.ans).toBe('/27')
    expect(m?.q).toContain('255.255.255.224')
  })
})
