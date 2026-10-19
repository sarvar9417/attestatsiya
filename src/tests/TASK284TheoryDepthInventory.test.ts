import { describe, expect, it } from 'vitest'
import { inspectOfflineTheory } from '../../scripts/audit-theory-depth'

describe('TASK-284 M01-depth quality gate', () => {
  const { benchmarkChars, rows } = inspectOfflineTheory()
  const byId = Object.fromEntries(rows.map(row => [row.subtopicId, row]))

  it('retains a real large benchmark and never calls unreviewed books page-verified', () => {
    expect(benchmarkChars).toBeGreaterThan(10_000)
    expect(byId['M01.02'].blocks).toBeGreaterThan(60)
    expect(byId['M01.02'].percentOfM0102).toBe(100)
    expect(rows.length).toBeGreaterThan(70)
    expect(rows.every(row => row.pageVerification === 'unverified')).toBe(true)
  })

  it('promotes M03.01/M15.02 above briefing depth while identifying the remaining short lessons', () => {
    expect(rows.some(row => row.depthTriage === 'brief')).toBe(true)
    for (const id of ['M03.01', 'M15.02']) {
      expect(byId[id].characters, id).toBeGreaterThan(10_000)
      expect(byId[id].blocks, id).toBeGreaterThanOrEqual(60)
      expect(byId[id].sections, id).toBeGreaterThanOrEqual(12)
      expect(byId[id].pageVerification, id).toBe('unverified')
    }
    expect(byId['M03.04'].characters).toBeLessThan(benchmarkChars)
    expect(byId['M15.04'].characters).toBeLessThan(benchmarkChars)
  })

  it('new exemplary books have meaningful chapter structure and preserve legacy', () => {
    expect(byId['M03.05'].blocks).toBeGreaterThanOrEqual(55)
    expect(byId['M03.05'].sections).toBeGreaterThanOrEqual(9)
    expect(byId['M03.05'].examplesAndSolutions).toBeGreaterThanOrEqual(5)
    expect(byId['M03.05'].goals).toBe(1)
    expect(byId['M03.05'].exercises).toBeGreaterThanOrEqual(3)
    expect(byId['M15.01'].blocks).toBeGreaterThanOrEqual(55)
    expect(byId['M15.01'].sections).toBeGreaterThanOrEqual(8)
    expect(byId['M15.01'].exercises).toBeGreaterThanOrEqual(3)
  })
})
