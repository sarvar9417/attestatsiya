import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const inventory = JSON.parse(
  readFileSync(resolve('docs/data/TASK246_FALL_DEMO_SCREENSHOT_MANIFEST.json'), 'utf8'),
) as {
  schemaVersion: number
  sourceDriveFileId: string
  imageCount: number
  candidateQuestionCount: number
  reviewOnly: boolean
  gradingKeysIncluded: boolean
  questions: Array<{
    inventoryId: string
    ordinal: number
    sourceImages: Array<{ imageNumber: number; part: string }>
    editorialStatus: string
    formatCandidate: string
    transcriptionVerified: boolean
    answerKeyVerified: boolean
    distractorsVerified: boolean
    sourcePageVerified: boolean
    duplicateChecked: boolean
    rightsVerified: boolean
  }>
}

describe('TASK-246 Drive DOCX screenshot-to-question audit guard', () => {
  it('tracks exactly 50 review-only candidates from 54 different images', () => {
    expect(inventory.schemaVersion).toBe(1)
    expect(inventory.sourceDriveFileId).toBe('13VVttASqpDVP4R1fsVtt3YARHs4uHnB8')
    expect(inventory.imageCount).toBe(54)
    expect(inventory.candidateQuestionCount).toBe(50)
    expect(inventory.reviewOnly).toBe(true)
    expect(inventory.gradingKeysIncluded).toBe(false)
    expect(inventory.questions).toHaveLength(50)
    const actual = inventory.questions.flatMap(q => q.sourceImages.map(i => i.imageNumber))
    expect(new Set(actual)).toEqual(new Set(Array.from({ length: 54 }, (_, index) => index + 1)))
    expect(inventory.questions.map(q => q.inventoryId)).toEqual(
      Array.from({ length: 50 }, (_, i) => `FALL26-Q${String(i + 1).padStart(2, '0')}`),
    )
  })

  it('retains six combined pairs and separately labels two double-question screenshots', () => {
    const multiImages = inventory.questions
      .filter(q => q.sourceImages.length === 2)
      .map(q => q.sourceImages.map(v => v.imageNumber).join('-'))
    expect(multiImages).toEqual(['4-5', '11-12', '14-15', '21-22', '27-28', '34-35'])
    expect(inventory.questions.filter(q => q.sourceImages.some(s => s.imageNumber === 31)))
      .toHaveLength(2)
    expect(inventory.questions.filter(q => q.sourceImages.some(s => s.imageNumber === 32)))
      .toHaveLength(2)
    for (const number of [31, 32]) {
      const parts = inventory.questions.flatMap(q => q.sourceImages)
        .filter(s => s.imageNumber === number).map(s => s.part)
      expect(parts).toEqual(['a', 'b'])
    }
  })

  it('keeps all questions unpublished and without unverified answer keys', () => {
    for (const [index, q] of inventory.questions.entries()) {
      expect(q.ordinal).toBe(index + 1)
      expect(q.editorialStatus).toBe('review')
      expect(q.formatCandidate).toBe('Y1')
      expect(q.transcriptionVerified).toBe(false)
      expect(q.answerKeyVerified).toBe(false)
      expect(q.distractorsVerified).toBe(false)
      expect(q.sourcePageVerified).toBe(false)
      expect(q.duplicateChecked).toBe(false)
      expect(q.rightsVerified).toBe(false)
      expect(Object.keys(q)).not.toContain('answer')
      expect(Object.keys(q)).not.toContain('answerKey')
      expect(Object.keys(q)).not.toContain('options')
    }
    expect(inventory.questions.filter(q => q.ordinal <= 35)).toHaveLength(35)
    expect(inventory.questions.filter(q => q.ordinal >= 36 && q.ordinal <= 40)).toHaveLength(5)
    expect(inventory.questions.filter(q => q.ordinal >= 41)).toHaveLength(10)
  })
})
