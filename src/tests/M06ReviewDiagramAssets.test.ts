import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const source = (name: string) => readFileSync(
  join(process.cwd(), 'public', 'algoritmlash-v4', name), 'utf8',
)

describe('M06: review-question diagrams are deployed as actual assets', () => {
  it('includes both complete and readable flowcharts', () => {
    const product = source('flow_product_3_9.svg')
    const sum = source('flow_until_negative.svg')

    for (const svg of [product, sum]) {
      expect(svg).toContain('<svg ')
      expect(svg).toContain('</svg>')
      expect(svg).toContain('marker-end:url(#arrow)')
      expect(svg).toContain('role="img"')
      expect(svg).toContain('<title id="title">')
    }

    expect(product).toContain('P := 1; i := 3')
    expect(product).toContain('i ≤ 9 ?')
    expect(product).toContain('P := P × i')
    expect(product).toContain('i := i + 3')
    expect(product).toContain('P ni chiqarish')

    expect(sum).toContain('S := 0')
    expect(sum).toContain('a ni kiritish')
    expect(sum).toContain('a &lt; 0 ?')
    expect(sum).toContain('S := S + a')
    expect(sum).toContain('S ni chiqarish')
  })

  it('directed A→J graph has 8 paths, but 6 if E→I is closed', () => {
    const svg = source('dag_paths_a_j.svg')
    const links = [...svg.matchAll(/data-from="([A-J])" data-to="([A-J])"/g)]
      .map(([, from, to]) => [from, to] as const)

    expect(links).toHaveLength(15)
    expect(new Set(links.map(([a,b]) => a + b)).size).toBe(15)
    const count = (vertex: string, closeEI: boolean, visited: string[] = []): number => {
      if (vertex === 'J') return 1
      expect(visited).not.toContain(vertex) // reject accidental cycles
      return links.filter(([from, to]) =>
        from === vertex && !(closeEI && from === 'E' && to === 'I'),
      ).reduce((total, [, to]) => total + count(to, closeEI, [...visited, vertex]), 0)
    }
    expect(count('A', false)).toBe(8)
    expect(count('A', true)).toBe(6)
  })
})
