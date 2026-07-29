import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  scheduleReview,
  getDueReviews,
  getDueCount,
  getScheduledCount,
  getReviewStatus,
  strengthToPercent,
  daysUntilReview,
  getAllReviews,
  getWeakGrammarLessonIds,
} from '../grammarSrs'

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-06-15T12:00:00Z'))
})

afterEach(() => {
  vi.useRealTimers()
})

// ──====================================================================──
//  1. scheduleReview — Grade boundary mapping
// ──====================================================================──

describe('scheduleReview — score grade mapping', () => {
  it('score >= 90 → yodladim (Easy, box=5)', () => {
    scheduleReview('easy-a', 90)
    const r = getReviewStatus('easy-a')!
    expect(r.box).toBe(5)
    expect(r.lapses).toBe(0)
    expect(r.stability).toBeGreaterThan(2)
  })

  it('score 89 → bildim (Good, box=3) — chegaradan past', () => {
    scheduleReview('good-a', 89)
    const r = getReviewStatus('good-a')!
    expect(r.box).toBe(3)
    expect(r.stability).toBeGreaterThan(0)
  })

  it('score 70 → bildim (Good, box=3) — minimal Good', () => {
    scheduleReview('good-b', 70)
    const r = getReviewStatus('good-b')!
    expect(r.box).toBe(3)
    expect(r.stability).toBeGreaterThan(0)
  })

  it('score 69 → qiynaldim (Hard, box=1) — Good dan past', () => {
    scheduleReview('hard-a', 69)
    const r = getReviewStatus('hard-a')!
    expect(r.box).toBe(1)
    expect(r.lapses).toBe(0)
  })

  it('score 40 → qiynaldim (Hard, box=1) — minimal Hard', () => {
    scheduleReview('hard-b', 40)
    const r = getReviewStatus('hard-b')!
    expect(r.box).toBe(1)
  })

  it('score 39 → bilmadim (Again, box=0, lapses=1) — Hard dan past', () => {
    scheduleReview('again-a', 39)
    const r = getReviewStatus('again-a')!
    expect(r.box).toBe(0)
    expect(r.lapses).toBe(1)
  })

  it('score 0 → bilmadim (Again, box=0, lapses=1) — minimal', () => {
    scheduleReview('again-b', 0)
    const r = getReviewStatus('again-b')!
    expect(r.box).toBe(0)
    expect(r.lapses).toBe(1)
  })

  it('score 100 → yodladim (Easy, box=5) — maksimal', () => {
    scheduleReview('easy-b', 100)
    const r = getReviewStatus('easy-b')!
    expect(r.box).toBe(5)
    expect(r.stability).toBeGreaterThan(3)
  })
})

// ──====================================================================──
//  2. scheduleReview — FSRS-5 stability/difficulty lifecycle
// ──====================================================================──

describe('scheduleReview — FSRS-5 stability lifecycle', () => {
  it('5 marta Easy stability orth boradi', () => {
    for (let i = 0; i < 5; i++) {
      scheduleReview('c1', 95)
    }
    const r = getReviewStatus('c1')!
    expect(r.stability).toBeGreaterThan(5)
    expect(r.reps).toBe(5)
    expect(r.lapses).toBe(0)
  })

  it('stability exponential growth — har bir Easy oldingisidan katta', () => {
    const stabilities: number[] = []
    for (let i = 0; i < 6; i++) {
      scheduleReview('c2', 95)
      stabilities.push(getReviewStatus('c2')!.stability)
    }
    for (let i = 1; i < stabilities.length; i++) {
      expect(stabilities[i]).toBeGreaterThan(stabilities[i - 1])
    }
  })

  it('Good bilan ham stability oshadi, lekin Easy dan kichik', () => {
    scheduleReview('c3', 75) // Good
    scheduleReview('c3', 75) // Good
    scheduleReview('c3', 75) // Good
    const goodStability = getReviewStatus('c3')!.stability

    localStorage.clear()
    scheduleReview('c4', 95) // Easy
    scheduleReview('c4', 95) // Easy
    scheduleReview('c4', 95) // Easy
    const easyStability = getReviewStatus('c4')!.stability

    expect(goodStability).toBeLessThan(easyStability)
  })

  it('Easy → Again → Good: stability tushadi, keyin qisman tiklanadi', () => {
    scheduleReview('c5', 95) // Easy — yuqori stability
    const afterEasy = getReviewStatus('c5')!.stability

    scheduleReview('c5', 20) // Again — stability tushadi
    const afterAgain = getReviewStatus('c5')!.stability
    expect(afterAgain).toBeLessThan(afterEasy)

    scheduleReview('c5', 75) // Good — qisman tiklanadi
    const afterGood = getReviewStatus('c5')!.stability
    expect(afterGood).toBeGreaterThan(afterAgain)
  })

  it('lapses increment: Again → Again → Again = 3 lapses', () => {
    scheduleReview('c6', 20)
    scheduleReview('c6', 30)
    scheduleReview('c6', 10)
    expect(getReviewStatus('c6')!.lapses).toBe(3)
  })

  it('lapses: Good dan keyin Again → lapses faqat Again da oshadi', () => {
    scheduleReview('c7', 75) // Good — lapses=0
    expect(getReviewStatus('c7')!.lapses).toBe(0)

    scheduleReview('c7', 20) // Again — lapses=1
    expect(getReviewStatus('c7')!.lapses).toBe(1)

    scheduleReview('c7', 75) // Good — lapses=1 (o'zgarmaydi)
    expect(getReviewStatus('c7')!.lapses).toBe(1)
  })

  it('lapses: Hard da lapses oshmaydi', () => {
    scheduleReview('c8', 50) // Hard
    expect(getReviewStatus('c8')!.lapses).toBe(0)
    scheduleReview('c8', 55) // Hard
    expect(getReviewStatus('c8')!.lapses).toBe(0)
  })

  it('difficulty: Again dan keyin difficulty oshadi', () => {
    scheduleReview('c9', 95) // Easy — past difficulty
    const diffEasy = getReviewStatus('c9')!.difficulty

    scheduleReview('c9', 20) // Again — difficulty oshadi
    const diffAgain = getReviewStatus('c9')!.difficulty
    expect(diffAgain).toBeGreaterThan(diffEasy)
  })

  it('difficulty: Easy dan keyin difficulty kamayadi', () => {
    scheduleReview('c10', 30) // Again — yuqori difficulty
    const diffAgain = getReviewStatus('c10')!.difficulty

    scheduleReview('c10', 95) // Easy — difficulty kamayadi
    const diffEasy = getReviewStatus('c10')!.difficulty
    expect(diffEasy).toBeLessThan(diffAgain)
  })

  it('difficulty [1, 10] oraligida qoladi — 10 marta Again ham', () => {
    for (let i = 0; i < 10; i++) {
      scheduleReview('c11', 10)
    }
    const d = getReviewStatus('c11')!.difficulty
    expect(d).toBeGreaterThanOrEqual(1)
    expect(d).toBeLessThanOrEqual(10)
  })

  it('difficulty [1, 10] oraligida qoladi — 10 marta Easy ham', () => {
    for (let i = 0; i < 10; i++) {
      scheduleReview('c12', 100)
    }
    const d = getReviewStatus('c12')!.difficulty
    expect(d).toBeGreaterThanOrEqual(1)
    expect(d).toBeLessThanOrEqual(10)
  })
})

// ──====================================================================──
//  3. scheduleReview — nextReview interval tekshiruvi
// ──====================================================================──

describe('scheduleReview — nextReview interval', () => {
  it('Easy dan keyin nextReview > today', () => {
    scheduleReview('i1', 95)
    const r = getReviewStatus('i1')!
    expect(r.nextReview.localeCompare('2026-06-15')).toBeGreaterThan(0)
  })

  it('Again dan keyin ham nextReview > today (short interval)', () => {
    scheduleReview('i2', 20)
    const r = getReviewStatus('i2')!
    expect(r.nextReview.localeCompare('2026-06-15')).toBeGreaterThan(0)
    // Again short interval — odatda 1-2 kun
    const diff = new Date(r.nextReview).getTime() - new Date('2026-06-15').getTime()
    expect(diff / 86_400_000).toBeLessThanOrEqual(5)
  })

  it('muvaffaqiyatli takrorlar intervalni uzaytiradi', () => {
    const intervals: number[] = []
    for (let i = 0; i < 5; i++) {
      scheduleReview('i3', 90)
      const due = getReviewStatus('i3')!.nextReview
      const days = Math.round((new Date(due).getTime() - new Date('2026-06-15').getTime()) / 86_400_000)
      intervals.push(days)
      // next review ga o'tkazish uchun vaqtni suramiz
      vi.setSystemTime(new Date(due + 'T12:00:00Z'))
    }
    // Interval orth borishi kerak (stability oshgani sari)
    for (let i = 1; i < intervals.length; i++) {
      expect(intervals[i]).toBeGreaterThanOrEqual(intervals[i - 1])
    }
  })

  it('Again dan keyin interval qisqa bo\'ladi (< 5 kun)', () => {
    scheduleReview('i4', 20)
    const due = getReviewStatus('i4')!.nextReview
    const diff = Math.round((new Date(due).getTime() - new Date('2026-06-15').getTime()) / 86_400_000)
    expect(diff).toBeLessThanOrEqual(5)
  })
})

// ──====================================================================──
//  4. getDueReviews / getDueCount — edge cases
// ──====================================================================──

describe('getDueReviews / getDueCount — edge cases', () => {
  it('hech qanday review yo\'q — bo\'sh array va 0', () => {
    expect(getDueReviews()).toEqual([])
    expect(getDueCount()).toBe(0)
  })

  it('review bor, lekin hali hech biri due emas', () => {
    scheduleReview('f1', 95) // Easy → due kelajakda
    scheduleReview('f2', 85) // Good → due kelajakda
    expect(getDueCount()).toBe(0)
    expect(getScheduledCount()).toBe(2)
  })

  it('ham due, ham scheduled — dueCount to\'g\'ri', () => {
    scheduleReview('due-old', 20) // Again — qisqa interval
    const oldDue = getReviewStatus('due-old')!.nextReview

    scheduleReview('still-future', 95) // Easy — uzoq interval
    const futureDue = getReviewStatus('still-future')!.nextReview

    // 'due-old' tezroq due bo'lishi kerak
    expect(oldDue.localeCompare(futureDue)).toBeLessThan(0)

    // Eski darsning due vaqtiga yetamiz
    vi.setSystemTime(new Date(oldDue + 'T12:00:00Z'))
    const due = getDueReviews()
    expect(due.length).toBeGreaterThanOrEqual(1)
    expect(due.some(r => r.lessonId === 'due-old')).toBe(true)
    // 'still-future' hali due bo'lmasligi mumkin
    getScheduledCount()
    expect(getAllReviews().length).toBe(2)
  })

  it('getDueReviews nextReview bo\'yicha o\'sish tartibida saralanadi', () => {
    scheduleReview('march', 95)
    const marchDue = getReviewStatus('march')!.nextReview

    vi.setSystemTime(new Date('2026-07-01T12:00:00Z'))
    scheduleReview('july', 95)
    const julyDue = getReviewStatus('july')!.nextReview

    // March due < July due bo'lishi kerak
    expect(marchDue.localeCompare(julyDue)).toBeLessThan(0)

    // Ikkalasi ham due bo'lishi uchun vaqtni suramiz
    vi.setSystemTime(new Date('2028-01-01T12:00:00Z'))
    const due = getDueReviews()
    expect(due[0].lessonId).toBe('march') // March first
    expect(due[1].lessonId).toBe('july')  // July second
  })

  it('bir vaqtda due bo\'lgan bir necha dars— hammasi qaytadi', () => {
    scheduleReview('a', 95)
    scheduleReview('b', 95)
    scheduleReview('c', 95)

    vi.setSystemTime(new Date('2030-01-01T12:00:00Z'))
    expect(getDueCount()).toBe(3)
  })
})

// ──====================================================================──
//  5. getScheduledCount — correct counting
// ──====================================================================──

describe('getScheduledCount', () => {
  it('scheduled = all - due', () => {
    scheduleReview('s1', 30)  // Again
    scheduleReview('s2', 50)  // Hard
    scheduleReview('s3', 90)  // Easy

    expect(getDueCount()).toBe(0)
    expect(getScheduledCount()).toBe(3)

    // Vaqt o'tkazamiz
    vi.setSystemTime(new Date('2026-06-20T12:00:00Z'))
    // Again/Hard qisqa interval → due bo'lgan bo'lishi mumkin
    const due = getDueCount()
    const scheduled = getScheduledCount()
    expect(due + scheduled).toBe(3)
  })

  it('barcha due bo\'lganda scheduled = 0', () => {
    scheduleReview('x', 95)
    vi.setSystemTime(new Date('2030-01-01T12:00:00Z'))
    expect(getDueCount()).toBe(1)
    expect(getScheduledCount()).toBe(0)
  })
})

// ──====================================================================──
//  6. getWeakGrammarLessonIds — edge cases
// ──====================================================================──

describe('getWeakGrammarLessonIds — edge cases', () => {
  it('hech qanday review yo\'q — bo\'sh array', () => {
    expect(getWeakGrammarLessonIds()).toEqual([])
  })

  it('hammasi kuchli (stability >= 1, lapses = 0) — bo\'sh array', () => {
    scheduleReview('strong1', 95)
    scheduleReview('strong2', 95)
    scheduleReview('strong3', 95)
    const weak = getWeakGrammarLessonIds()
    expect(weak).toEqual([])
  })

  it('barcha reviewlar zaif — hammasi qaytadi', () => {
    scheduleReview('w1', 20)
    scheduleReview('w2', 30)
    scheduleReview('w3', 10)
    const weak = getWeakGrammarLessonIds()
    expect(weak.length).toBe(3)
    expect(weak).toContain('w1')
    expect(weak).toContain('w2')
    expect(weak).toContain('w3')
  })

  it('limit parametrni to\'g\'ri qo\'llaydi', () => {
    for (let i = 0; i < 10; i++) scheduleReview(`w${i}`, 20)
    expect(getWeakGrammarLessonIds(3)).toHaveLength(3)
    expect(getWeakGrammarLessonIds(5)).toHaveLength(5)
    expect(getWeakGrammarLessonIds(100)).toHaveLength(10)
  })

  it('lapses ko\'proq bo\'lgan dars birinchi o\'rinda', () => {
    scheduleReview('often-forgotten', 20)
    scheduleReview('often-forgotten', 20)
    scheduleReview('often-forgotten', 20) // 3 lapses
    scheduleReview('sometimes-hard', 20)
    scheduleReview('sometimes-hard', 20)  // 2 lapses
    scheduleReview('once-hard', 20)       // 1 lapse

    const weak = getWeakGrammarLessonIds()
    expect(weak[0]).toBe('often-forgotten')
    expect(weak[1]).toBe('sometimes-hard')
    expect(weak[2]).toBe('once-hard')
  })

  it('lapses teng bo\'lsa — stability past bo\'lgan birinchi', () => {
    scheduleReview('low-stab', 20)
    scheduleReview('low-stab', 75)   // qisman tiklanadi
    const lowStability = getReviewStatus('low-stab')!.stability

    scheduleReview('lower-stab', 20)
    const lowerStability = getReviewStatus('lower-stab')!.stability

    expect(lowerStability).toBeLessThan(lowStability)
    // Har ikkalasida 1 tadan lapse
    const weak = getWeakGrammarLessonIds()
    expect(weak[0]).toBe('lower-stab')
  })
})

// ──====================================================================──
//  7. daysUntilReview — helper function
// ──====================================================================──

describe('daysUntilReview', () => {
  it('due bugun — 0 kun', () => {
    // Review ni schedule qilamiz, keyin vaqtni uning due kuniga suramiz
    scheduleReview('d1', 20) // Again → 1 kundan keyin
    const dueDate = getReviewStatus('d1')!.nextReview
    vi.setSystemTime(new Date(dueDate + 'T12:00:00Z'))
    const r = getReviewStatus('d1')!
    expect(r.nextReview <= dueDate).toBe(true)
    expect(daysUntilReview(r)).toBe(0)
  })

  it('due kelajakda — musbat kun', () => {
    scheduleReview('d2', 95) // Easy → future
    const r = getReviewStatus('d2')!
    const days = daysUntilReview(r)
    expect(days).toBeGreaterThan(0)
  })

  it('due o\'tib ketgan — 0 kun (max(0, ...))', () => {
    scheduleReview('d3', 95)
    // 1 yil oldinga suramiz
    vi.setSystemTime(new Date('2027-06-15T12:00:00Z'))
    // d3 endi o'tib ketgan
    const r = getReviewStatus('d3')!
    expect(r.nextReview < '2027-06-15').toBe(true) // o'tib ketgan
    expect(daysUntilReview(r)).toBe(0)
  })
})

// ──====================================================================──
//  8. Multiple lessons — independent state
// ──====================================================================──

describe('multiple lessons — independent state', () => {
  it('10 ta darsning har biri alohida saqlanadi', () => {
    const ids = Array.from({ length: 10 }, (_, i) => `lesson-${i}`)
    ids.forEach((id, i) => scheduleReview(id, 50 + i * 5)) // Hard..Good

    const all = getAllReviews()
    expect(all).toHaveLength(10)
    ids.forEach(id => {
      expect(getReviewStatus(id)).not.toBeNull()
    })
  })

  it('bir darsga ta\'sir boshqasiga o\'tmaydi', () => {
    scheduleReview('alpha', 95)
    scheduleReview('beta', 20)

    const alpha = getReviewStatus('alpha')!
    const beta = getReviewStatus('beta')!

    expect(alpha.stability).toBeGreaterThan(beta.stability)
    expect(alpha.lapses).toBe(0)
    expect(beta.lapses).toBe(1)
  })
})

// ──====================================================================──
//  9. lastReviewed field — correct updating
// ──====================================================================──

describe('lastReviewed field', () => {
  it('birinchi review — lastReviewed = today', () => {
    scheduleReview('lr1', 90)
    expect(getReviewStatus('lr1')!.lastReviewed).toBe('2026-06-15')
  })

  it('ikkinchi review — lastReviewed yangilanadi', () => {
    scheduleReview('lr2', 90)
    vi.setSystemTime(new Date('2026-06-20T12:00:00Z'))
    scheduleReview('lr2', 90)
    expect(getReviewStatus('lr2')!.lastReviewed).toBe('2026-06-20')
  })
})

// ──====================================================================──
//  10. Realistic student simulation
// ──====================================================================──

describe('realistic student simulation — 6 oy', () => {
  it('student Present Perfect ni 6 oy davomida o\'rganadi', () => {
    const TOPIC = 'present-perfect'

    // 1-kun: birinchi o'rganish — qiyin (50% score)
    scheduleReview(TOPIC, 50)
    let r = getReviewStatus(TOPIC)!
    expect(r.reps).toBe(1)
    expect(r.lapses).toBe(0)
    const firstStability = r.stability

    // Due bo'lganda takrorlaymiz
    vi.setSystemTime(new Date(r.nextReview + 'T12:00:00Z'))
    scheduleReview(TOPIC, 70) // Good — tushuna boshladi
    r = getReviewStatus(TOPIC)!
    expect(r.reps).toBe(2)
    expect(r.stability).toBeGreaterThan(firstStability)
    const secondStability = r.stability

    // Yana due bo'lganda — yaxshi eslaydi
    vi.setSystemTime(new Date(r.nextReview + 'T12:00:00Z'))
    scheduleReview(TOPIC, 85) // Good — mustahkam
    r = getReviewStatus(TOPIC)!
    expect(r.reps).toBe(3)
    expect(r.stability).toBeGreaterThan(secondStability)
    const thirdStability = r.stability

    // 1 oydan keyin — a'lo eslaydi
    vi.setSystemTime(new Date(r.nextReview + 'T12:00:00Z'))
    scheduleReview(TOPIC, 95) // Easy — yodlagan
    r = getReviewStatus(TOPIC)!
    expect(r.reps).toBe(4)
    expect(r.stability).toBeGreaterThan(thirdStability)
    const fourthStability = r.stability

    // 2 oydan keyin — unutgan (Again)
    vi.setSystemTime(new Date(r.nextReview + 'T12:00:00Z'))
    scheduleReview(TOPIC, 30) // Again — eslay olmadi
    r = getReviewStatus(TOPIC)!
    expect(r.reps).toBe(5)
    expect(r.lapses).toBe(1)
    expect(r.stability).toBeLessThan(fourthStability)
    const fifthStability = r.stability

    // Qayta o'rganadi — Good
    vi.setSystemTime(new Date(r.nextReview + 'T12:00:00Z'))
    scheduleReview(TOPIC, 75)
    r = getReviewStatus(TOPIC)!
    expect(r.reps).toBe(6)
    expect(r.stability).toBeGreaterThan(fifthStability)  // recovery from lapse

    // Yana mustahkamlaydi — Easy
    const stabilityAfterGood = r.stability
    vi.setSystemTime(new Date(r.nextReview + 'T12:00:00Z'))
    scheduleReview(TOPIC, 95)
    r = getReviewStatus(TOPIC)!
    expect(r.reps).toBe(7)
    expect(r.lapses).toBe(1) // hali ham 1 (faqat Again oshirgan)
    expect(r.stability).toBeGreaterThan(stabilityAfterGood) // mustahkamlanadi

    // 3 oydan keyin — barqaror eslab qolgan
    const stabilityAfterEasy = r.stability
    vi.setSystemTime(new Date(r.nextReview + 'T12:00:00Z'))
    scheduleReview(TOPIC, 100)
    r = getReviewStatus(TOPIC)!
    expect(r.reps).toBe(8)
    // FSRS-5 fail dan keyin stability past boshlaydi, lekin barqaror o'sadi
    expect(r.stability).toBeGreaterThan(stabilityAfterEasy) // davomli o'sish

    // Umumiy tekshiruv
    expect(r.difficulty).toBeGreaterThanOrEqual(1)
    expect(r.difficulty).toBeLessThanOrEqual(10)
    expect(getDueCount()).toBe(0) // hali vaqti kelmagan
    expect(getScheduledCount()).toBe(1)
    // Topicda lapses=1 bor, shuning uchun getWeakGrammarLessonIds da qoladi
    // (getWeakGrammarLessonIds filter: r.lapses > 0 || r.stability < 1)
  })
})

// ──====================================================================──
//  11. getAllReviews — full collection
// ──====================================================================──

describe('getAllReviews', () => {
  it('bo\'sh localStorage — empty array', () => {
    expect(getAllReviews()).toEqual([])
  })

  it('bir necha dars — hammasini qaytaradi', () => {
    scheduleReview('a', 90)
    scheduleReview('b', 50)
    scheduleReview('c', 20)
    expect(getAllReviews()).toHaveLength(3)
  })

  it('qaytarilgan obyektlar to\'liq maydonga ega', () => {
    scheduleReview('full-check', 90)
    const all = getAllReviews()
    expect(all).toHaveLength(1)
    const r = all[0]
    expect(r).toHaveProperty('lessonId')
    expect(r).toHaveProperty('box')
    expect(r).toHaveProperty('nextReview')
    expect(r).toHaveProperty('lastReviewed')
    expect(r).toHaveProperty('lapses')
    expect(r).toHaveProperty('reps')
    expect(r).toHaveProperty('stability')
    expect(r).toHaveProperty('difficulty')
    expect(typeof r.stability).toBe('number')
    expect(typeof r.difficulty).toBe('number')
  })
})

// ──====================================================================──
//  12. getReviewStatus — edge cases
// ──====================================================================──

describe('getReviewStatus', () => {
  it('mavjud dars — to\'liq record', () => {
    scheduleReview('status-check', 90)
    const r = getReviewStatus('status-check')
    expect(r).not.toBeNull()
    expect(r!.lessonId).toBe('status-check')
    expect(r!.reps).toBe(1)
  })

  it('mavjud bo\'lmagan dars — null', () => {
    expect(getReviewStatus('imaginary-lesson')).toBeNull()
    expect(getReviewStatus('')).toBeNull()
  })

  it('case sensitive — katta-kichik harflar farqlanadi', () => {
    scheduleReview('MyLesson', 90)
    expect(getReviewStatus('MyLesson')).not.toBeNull()
    expect(getReviewStatus('mylesson')).toBeNull()
  })
})

// ──====================================================================──
//  13. strengthToPercent — edge cases
// ──====================================================================──

describe('strengthToPercent', () => {
  it('stability = 0 → 0%', () => {
    expect(strengthToPercent(0)).toBe(0)
  })

  it('stability = 10 → 100% (muqobil: cap 100)', () => {
    expect(strengthToPercent(10)).toBe(100)
  })

  it('stability = 15 → 100% (cap)', () => {
    expect(strengthToPercent(15)).toBe(100)
  })

  it('stability = 3.5 → 35%', () => {
    expect(strengthToPercent(3.5)).toBe(35)
  })

  it('stability = 0.5 → 5%', () => {
    expect(strengthToPercent(0.5)).toBe(5)
  })

  it('stability = 0.07 → 1% (round)', () => {
    expect(strengthToPercent(0.07)).toBe(1)
  })
})

// ──====================================================================──
//  14. Corrupted localStorage
// ──====================================================================──

describe('corrupted localStorage', () => {
  it('invalid JSON — empty state, no crash', () => {
    localStorage.setItem('grammar-srs-v2', '{broken json!!!')
    expect(getAllReviews()).toEqual([])
    expect(getDueCount()).toBe(0)
    expect(getScheduledCount()).toBe(0)
    expect(getWeakGrammarLessonIds()).toEqual([])
  })

  it('null value — empty state', () => {
    localStorage.setItem('grammar-srs-v2', 'null')
    expect(getAllReviews()).toEqual([])
  })

  it('not an object — empty state', () => {
    localStorage.setItem('grammar-srs-v2', '"just a string"')
    expect(getAllReviews()).toEqual([])
  })

  it('write korruptsiyadan keyin normal ishlaydi', () => {
    localStorage.setItem('grammar-srs-v2', 'corrupt')
    expect(getAllReviews()).toEqual([])

    // Keyin normal write
    scheduleReview('after-corrupt', 90)
    expect(getReviewStatus('after-corrupt')).not.toBeNull()
  })
})

// ──====================================================================──
//  15. Concurrent consistency — due + scheduled sum = total
// ──====================================================================──

describe('concurrent consistency', () => {
  it("dueCount + scheduledCount = getAllReviews().length (doim)", () => {
    // 0 ta
    expect(getDueCount() + getScheduledCount()).toBe(getAllReviews().length)

    // 3 ta qo'shamiz
    scheduleReview('con1', 95)
    scheduleReview('con2', 50)
    scheduleReview('con3', 20)
    expect(getDueCount() + getScheduledCount()).toBe(getAllReviews().length)

    // Vaqt o'tkazamiz — ba'zilari due bo'ladi
    vi.setSystemTime(new Date('2026-06-20T12:00:00Z'))
    expect(getDueCount() + getScheduledCount()).toBe(getAllReviews().length)

    // Yana 2 ta
    scheduleReview('con4', 95)
    scheduleReview('con5', 95)
    expect(getDueCount() + getScheduledCount()).toBe(getAllReviews().length)
  })
})
