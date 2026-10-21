import { expect, test } from '@playwright/test'

// Protected learner route with a synthetic authenticated session and mocked API.
// This does NOT stand in for a real-user / live-Supabase authenticated staging E2E.
const uuid = (n: number) => `20000000-0000-4000-8000-${String(n).padStart(12, '0')}`
const cors = {
  'access-control-allow-origin': 'http://localhost:3000',
  'access-control-allow-headers': 'authorization,content-type',
  'access-control-allow-methods': 'GET,POST,OPTIONS',
  'content-type': 'application/json',
}

test('protected mock: native Y2 (3×3, 4×4) and Y3 (4 items) render, interact and autosave server payloads', async ({ page }) => {
  const y2Three = Array.from({ length: 3 }, (_, i) => ({
    left: uuid(110 + i), right: uuid(210 + i),
    leftLabel: `Chap uchlik ${i + 1}`, rightLabel: `O'ng uchlik ${i + 1}`,
  }))
  const y2Four = Array.from({ length: 4 }, (_, i) => ({
    left: uuid(310 + i), right: uuid(410 + i),
    leftLabel: `Chap to'rtlik ${i + 1}`, rightLabel: `O'ng to'rtlik ${i + 1}`,
  }))
  const y3Ids = Array.from({ length: 4 }, (_, i) => uuid(510 + i))
  const questions = [
    {
      item_id: uuid(11), order_idx: 1, question_id: uuid(21),
      format: 'Y2', stem_md: 'E2E: uchta moslikni toping', assets: [],
      options: [
        ...y2Three.map(o => ({ id: o.left, side: 'a', content_md: o.leftLabel })),
        ...y2Three.map(o => ({ id: o.right, side: 'b', content_md: o.rightLabel })),
      ],
    },
    {
      item_id: uuid(12), order_idx: 2, question_id: uuid(22),
      format: 'Y2', stem_md: 'E2E: to‘rtta moslikni toping', assets: [],
      options: [
        ...y2Four.map(o => ({ id: o.left, side: 'a', content_md: o.leftLabel })),
        ...y2Four.map(o => ({ id: o.right, side: 'b', content_md: o.rightLabel })),
      ],
    },
    {
      item_id: uuid(13), order_idx: 3, question_id: uuid(23),
      format: 'Y3', stem_md: 'E2E: to‘rtta bosqichni tartiblang', assets: [],
      options: y3Ids.map((id, i) => ({ id, side: 'a', content_md: `Bosqich ${i + 1}` })),
    },
  ]
  const submitted: Array<{ question_id: string; answer: { pairs?: Record<string, string>; order?: string[] } }> = []

  await page.addInitScript(() => {
    localStorage.setItem('attestatsiya.session.v1', JSON.stringify({
      access_token: 'native-formats-e2e-token',
      refresh_token: 'native-formats-e2e-refresh',
      expires_at: Date.now() + 3_600_000,
      user: {
        id: '20000000-0000-4000-8000-000000000099',
        email: 'native-formats-e2e@example.invalid', display_name: 'Format Tester', role: 'user',
      },
    }))
  })
  await page.route('http://localhost:3001/api/auth/onboarding', async route => {
    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: cors, body: '' })
      return
    }
    await route.fulfill({
      status: 200, headers: cors,
      body: JSON.stringify({
        available: true, completed: true, display_name: 'Format Tester',
        exam_date: null, daily_goal_minutes: 30, timezone: 'Asia/Tashkent',
        locale: 'uz-Latn', onboarding_completed_at: new Date().toISOString(),
      }),
    })
  })
  await page.route('http://localhost:3001/api/exam/**', async route => {
    const req = route.request()
    const path = new URL(req.url()).pathname
    if (req.method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: cors, body: '' })
      return
    }
    if (path === '/api/exam/mock/active') {
      await route.fulfill({ status: 200, headers: cors, body: 'null' })
      return
    }
    if (path === '/api/exam/start') {
      await route.fulfill({
        status: 200, headers: cors,
        body: JSON.stringify({
          exam_id: uuid(1), kind: 'mock', duration_sec: 7200,
          started_at: new Date().toISOString(), items: questions,
        }),
      })
      return
    }
    if (path === '/api/exam/submit') {
      const body = req.postDataJSON()
      submitted.push(body)
      await route.fulfill({ status: 200, headers: cors, body: JSON.stringify({ saved: true }) })
      return
    }
    if (path === '/api/exam/finish') {
      await route.fulfill({
        status: 200, headers: cors,
        body: JSON.stringify({
          exam_id: uuid(1), total_score: 0, max_score: 6, passed: false,
          breakdown: [], already_finished: false,
        }),
      })
      return
    }
    await route.fulfill({ status: 404, headers: cors, body: '{}' })
  })

  await page.goto('/exam/mock')
  await expect(page.getByRole('heading', { name: 'Attestatsiya mock sinovi' })).toBeVisible()
  await page.getByRole('button', { name: 'Sinovni boshlash' }).click()
  await expect(page.getByText('E2E: uchta moslikni toping')).toBeVisible()

  // Y2 3×3: unique right choices; browser cannot reuse a selected choice.
  let selects = page.getByRole('combobox')
  await expect(selects).toHaveCount(3)
  await selects.nth(0).selectOption(y2Three[0].right)
  await expect(selects.nth(1).locator(`option[value="${y2Three[0].right}"]`)).toBeDisabled()
  await selects.nth(1).selectOption(y2Three[1].right)
  await selects.nth(2).selectOption(y2Three[2].right)
  await expect.poll(() => submitted.find(x => x.question_id === uuid(21))?.answer.pairs).toEqual(
    Object.fromEntries(y2Three.map(p => [p.left, p.right])),
  )

  await page.getByRole('button', { name: 'Keyingi' }).click()
  await expect(page.getByText('E2E: to‘rtta moslikni toping')).toBeVisible()

  // Y2 4×4: same native UI, not a downgraded multiple-choice question.
  selects = page.getByRole('combobox')
  await expect(selects).toHaveCount(4)
  for (let i = 0; i < y2Four.length; i++) {
    await selects.nth(i).selectOption(y2Four[i].right)
  }
  await expect.poll(() => submitted.find(x => x.question_id === uuid(22))?.answer.pairs).toEqual(
    Object.fromEntries(y2Four.map(p => [p.left, p.right])),
  )

  await page.getByRole('button', { name: 'Keyingi' }).click()
  await expect(page.getByText('E2E: to‘rtta bosqichni tartiblang')).toBeVisible()
  await expect(page.getByRole('button', { name: /Bosqich .* — pastga/ })).toHaveCount(4)
  await page.getByRole('button', { name: /Bosqich .* — pastga/ }).first().click()

  await expect.poll(() => {
    const order = submitted.find(x => x.question_id === uuid(23))?.answer.order
    return Array.isArray(order) && order.length === 4 &&
      new Set(order).size === 4 && order.every(id => y3Ids.includes(id))
  }).toBe(true)
  // Assert only submitted item IDs are sent — never correctOrder or hidden answer keys.
  expect(submitted.every(x => !('correctOrder' in x.answer))).toBe(true)
})
