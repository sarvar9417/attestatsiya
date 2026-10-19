import { describe, expect, it } from 'vitest'
import { inspectOfflineTheory } from '../../scripts/audit-theory-depth'

describe('TASK-284 M01-depth quality gate', () => {
  const { benchmarkChars, rows } = inspectOfflineTheory()
  const byId = Object.fromEntries(rows.map(row => [row.subtopicId, row]))

  it('retains a real large benchmark and never calls unreviewed books page-verified', () => {
    expect(benchmarkChars).toBeGreaterThan(10_000)
    expect(byId['M01.02'].blocks).toBeGreaterThan(100)
    expect(byId['M01.02'].percentOfM0102).toBe(100)
    expect(rows.length).toBeGreaterThan(70)
    expect(rows.every(row => row.pageVerification === 'unverified')).toBe(true)
  })

  it('detects that uniform BookReader styling does not mean uniform theory depth', () => {
    expect(rows.some(row => row.depthTriage === 'brief')).toBe(true)
    expect(byId['M03.01'].characters).toBeLessThan(benchmarkChars)
    expect(byId['M15.02'].characters).toBeLessThan(benchmarkChars)
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
